const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = function(req, res, next) {
  const token = req.cookies.token || req.header('Authorization');
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, 'secretkey');
    User.findSessionByUserId(decoded.id, (err, sessionResults) => {
      if (err) return res.status(500).send(err);
      if (sessionResults.length === 0) return res.redirect('/login');
      
      req.user = decoded;
      next();
    });
  } catch (ex) {
    res.redirect('/login');
  }
};