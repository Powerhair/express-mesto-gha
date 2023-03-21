const router = require('express').Router();
const http2 = require('http2');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const authRouter = require('./auth');

const {
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

const pageNotFound = (req, res, next) => {
  next(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
};

router.use('/', authRouter);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', pageNotFound);

module.exports = router;
