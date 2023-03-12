const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6406e55a6a19bb1786e1600c',
  };

  next();
});

app.use('/', router);

app.listen(PORT);
