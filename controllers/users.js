const http2 = require('http2');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CONFLICT,
} = http2.constants;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => res.status(200).send({ data: newUser }))
    .catch((err) => {
      if (err.code === 11000) {
        next(HTTP_STATUS_CONFLICT).send({ message: 'Такой пользователь уже есть' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' }))
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((updatedAvatar) => res.send(updatedAvatar))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw (HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};
