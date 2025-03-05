const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, 'secretkey');
    User.findSessionByUserId(decoded.id, (err, sessionResults) => {
      if (err) return res.status(500).send(err);
      if (sessionResults.length === 0) return res.status(401).send('Invalid token.');
      
      req.user = decoded;
      next();
    });
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};