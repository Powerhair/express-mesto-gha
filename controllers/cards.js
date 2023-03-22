const http2 = require('http2');
const Card = require('../models/card');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(200).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для создания карточки' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным  _id не найдена' }))
    .then((result) => {
      const owner = result.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(result)
          .then(() => {
            res.status(200).send(result);
          })
          .catch(next);
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Вы можете удалять только свои карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным  _id не найдена' }))
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным  _id не найдена' }))
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
