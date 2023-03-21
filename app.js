const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.set('strictQuery', true);
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('connected');
  })
  .catch((err) => {
    console.log(`error ${err}`);
  });

app.use(express.json());

app.use('/', router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({

      message: statusCode === 500
        ? 'Произошла ошибка'
        : message,
    });
  next();
});

app.use(
  (req, res) => {
    res.status(404).send({ message: 'Страница не найдена' });
  },
);

app.listen(PORT);
