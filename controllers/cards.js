const validator = require('validator');
const Card = require('../models/card');
const {
  serverErrorCode,
  incorrectDataErrorCode,
  notFoundIdErrorCode,
} = require('../constants');

module.exports.findCards = (req, res) => {
  Card.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(serverErrorCode).send({ message: '«На сервере произошла ошибка»' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectDataErrorCode).send({ message: '«Переданы некорректные данные при создании карточки' });
      } else {
        res.status(serverErrorCode).send({
          message: '«На сервере произошла ошибка»',
        });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  if (validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          res.status(notFoundIdErrorCode).send({
            message: '«Пользователь по указанному _id не найден»',
          });
        }
      })
      .catch(() => res.status(serverErrorCode).send({ message: '«На сервере произошла ошибка»' }));
  } else {
    res.status(incorrectDataErrorCode).send({
      message: 'Введён некорректный id',
    });
  }
};

module.exports.putLike = (req, res) => {
  if (validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          res.status(notFoundIdErrorCode).send({
            message: '«Пользователь по указанному _id не найден»',
          });
        }
      })
      .catch(() => res.status(serverErrorCode).send({ message: '«На сервере произошла ошибка»' }));
  } else {
    res.status(incorrectDataErrorCode).send({
      message: 'Введён некорректный id',
    });
  }
};

module.exports.removeLike = (req, res) => {
  if (validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          res.status(notFoundIdErrorCode).send({
            message: '«Пользователь по указанному _id не найден»',
          });
        }
      })
      .catch(() => res.status(serverErrorCode).send({ message: '«На сервере произошла ошибка»' }));
  } else {
    res.status(incorrectDataErrorCode).send({
      message: 'Введён некорректный id',
    });
  }
};
