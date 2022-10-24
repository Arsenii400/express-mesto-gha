const card = require('express').Router();
const {
  findCards,
  createCard,
  deleteCardById,
  putLike, removeLike,
} = require('../controllers/cards');

card.get('/', findCards);
card.post('/', createCard);
card.delete('/:cardId', deleteCardById);
card.put('/:cardId/likes', putLike);
card.delete('/:cardId/likes', removeLike);

module.exports = card;
