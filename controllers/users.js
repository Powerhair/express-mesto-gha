const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVERE_ERROR,
} = require('../errors/errors_constants');

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        next(
          res
            .status(INTERNAL_SERVERE_ERROR)
            .send({ message: 'Ошибка по умолчанию' })
        );
      } else {
        next(err);
      }
    });
};

// POST /users — создаёт пользователя
module.exports.postUsers = (req, res, next) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса данные
  User.create({ name, about, avatar })
    .then((user) =>
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          res.status(BAD_REQUEST).send({
            message: 'Переданы некорректные данные при создании пользователя',
          })
        );
        // next(new BadRequestError('Переданы некорректные данные при создании пользователя' ));
      } else if (err.name === 'InternalServerError') {
        next(
          res
            .status(INTERNAL_SERVERE_ERROR)
            .send({ message: 'Ошибка по умолчанию' })
        );
        // next(new InternalServerError('Ошибка по умолчанию'));
      } else {
        next(err);
      }
    });
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.findUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        // throw next(new NotFoundError('пользователя с несуществующим в БД id'));
        return res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий в БД id' });
      }
      return res.send({ data: user });
    })
    // .catch(() => res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' }));
    .catch((err) => {
      if (err.name === 'CastError') {
        // next (new BadRequestError('Получение пользователя с некорректным id'))
        next(
          res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' })
        );
      } else {
        next(err);
      }
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        // throw next(new NotFoundError('пользователя с несуществующим в БД id'));
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          res.status(BAD_REQUEST).send({
            message: 'Переданы некорректные данные при создании пользователя',
          })
        );
        // next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'InternalServerError') {
        next(
          res
            .status(INTERNAL_SERVERE_ERROR)
            .send({ message: 'Ошибка по умолчанию' })
        );
        // next(new InternalServerError('Ошибка по умолчанию'));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.patchUsersAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        // throw next(new NotFoundError('пользователя с несуществующим в БД id'));
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          res.status(BAD_REQUEST).send({
            message: 'Переданы некорректные данные при создании пользователя',
          })
        );
        // next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'InternalServerError') {
        next(
          res
            .status(INTERNAL_SERVERE_ERROR)
            .send({ message: 'Ошибка по умолчанию' })
        );
        // next(new InternalServerError('Ошибка по умолчанию'));
      } else {
        next(err);
      }
    });
};
