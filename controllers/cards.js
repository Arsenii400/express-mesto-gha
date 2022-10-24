const Card = require('../models/card');

module.exports.findCards = (req, res) => {
  Card.find({})
    .then((user) => res.status(200).res.send({ data: user }))
    .catch(() => res.status(500).send({ message: '«На сервере произошла ошибка»' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: '«Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({
          message: '«На сервере произошла ошибка»',
        });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((user) => {
      if (user) {
        res.status(200).res.send({ data: user });
      } else {
        res.status(404).send({
          message: '«Пользователь по указанному _id не найден»',
        });
      }
    })
    .catch(() => res.status(500).send({ message: '«На сервере произошла ошибка»' }));
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).res.send({ data: user });
      } else {
        res.status(404).send({
          message: '«Пользователь по указанному _id не найден»',
        });
      }
    })
    .catch(() => res.status(500).send({ message: '«На сервере произошла ошибка»' }));
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((user) => {
      if (user) {
        res.status(200).res.send({ data: user });
      } else {
        res.status(404).send({
          message: '«Пользователь по указанному _id не найден»',
        });
      }
    })
    .catch(() => res.status(500).send({ message: '«На сервере произошла ошибка»' }));
};
