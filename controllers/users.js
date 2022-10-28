const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const IncorrectIdError = require('../errors/incorrect-id-err');
const EmailError = require('../errors/email-err');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.findCurrentUser = (req, res, next) => {
  if (validator.isMongoId(req.user._id)) {
    User.findById(req.user._id)
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          throw new NotFoundError('«Пользователь по указанному _id не найден»');
        }
      })
      .catch(next);
  } else {
    next(new IncorrectIdError('«Введён некорректный id»'));
  }
};

module.exports.findUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  if (validator.isMongoId(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          throw new NotFoundError('«Пользователь по указанному _id не найден»');
        }
      })
      .catch(next);
  } else {
    next(new IncorrectIdError('«Введён некорректный id»'));
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectIdError('«Переданы некорректные данные при создании пользователя»'));
      } else if (err.code === 11000) {
        next(new EmailError('«Такой email уже зарегистрирован»'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('«Пользователь по указанному _id не найден»');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectIdError('«Переданы некорректные данные при обновлении профиля»'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('«Пользователь по указанному _id не найден»');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectIdError('«Переданы некорректные данные при обновлении профиля»'));
      } else {
        next(err);
      }
    });
};
