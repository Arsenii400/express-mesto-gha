const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const user = require('./routes/users');
const card = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { loginValidation, createUserValidation } = require('./middlewares/user-celebrate');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use('/users', user);
app.use('/cards', card);
app.use('*', (req, res, next) => {
  next(new NotFoundError('«Запрашиваемый путь не найден»'));
});
app.use(errors());
app.use((err, req, res) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT, () => {});
