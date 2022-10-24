const validator = require('validator');
const User = require('../models/user');

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({
      message: '«На сервере произошла ошибка»',
    }));
};

module.exports.findUserById = (req, res) => {
  if (validator.isMongoId(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          res.status(404).send({
            message: '«Пользователь по указанному _id не найден»',
          });
        }
      })
      .catch(() => res.status(500).send({
        message: '«На сервере произошла ошибка»',
      }));
  } else {
    res.status(400).send({
      message: 'Введён некорректный id',
    });
  }
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '«Переданы некорректные данные при создании пользователя»' });
      } else {
        res.status(500).send({
          message: '«На сервере произошла ошибка»',
        });
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({
          message: '«Пользователь по указанному _id не найден»',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '«Переданы некорректные данные при обновлении профиля»' });
      } else {
        res.status(500).send({
          message: '«На сервере произошла ошибка»',
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({
          message: '«Пользователь по указанному _id не найден»',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '«Переданы некорректные данные при обновлении профиля»' });
      } else {
        res.status(500).send({
          message: '«На сервере произошла ошибка»',
        });
      }
    });
};
