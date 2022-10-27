const user = require('express').Router();
const {
  findCurrentUser,
  findUsers,
  findUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

user.get('/me', findCurrentUser);
user.get('/', findUsers);
user.get('/:userId', findUserById);
user.patch('/me', updateUser);
user.patch('/me/avatar', updateAvatar);

module.exports = user;
