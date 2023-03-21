const jwt = require('jsonwebtoken');
const Needauthorized = require('../errors/Needauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let payload;

  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Needauthorized('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');

    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new Needauthorized('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
