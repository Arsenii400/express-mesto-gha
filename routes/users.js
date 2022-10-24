const user = require('express').Router();
const {
  createUser,
  findUsers,
  findUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

user.get('/', findUsers);
user.get('/:userId', findUserById);
user.post('/', createUser);
user.patch('/me', updateUser);
user.patch('/me/avatar', updateAvatar);

module.exports = user;
