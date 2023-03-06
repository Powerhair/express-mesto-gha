const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');

const cardsRoutes = require('./routes/cards');
const { NOT_FOUND } = require('./errors/errors_constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', true);
mongoose
  .connect('mongodb://0.0.0.0:27017/mestodb')
  .then(() => {
    console.log('Database connected.');
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '63ef1ba9f92d535c71085ff3', // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

app.use(usersRoutes);
app.use(cardsRoutes);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неправильный путь' });
});

app.listen(PORT);
