const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./routes/users');
const card = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '63567cf4709494719370014a',
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', user);
app.use('/cards', card);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый путь не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
