const uuidv1 = require('uuid/v1');

const setCookie = (req, res, next) => {
  if (!req.cookies['userId']) {
    res.cookie('userId', uuidv1(), { maxAge: 900000 });
  }
  next();
};

module.exports = setCookie;
