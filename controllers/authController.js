const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).send('Username already exists');

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
      User.create({ username, password: hash }, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('User registered');
      });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('User not found');
    
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send(err);
      if (!isMatch) return res.status(401).send('Password incorrect');
      
      User.findSessionByUserId(user.id, (err, sessionResults) => {
        if (err) return res.status(500).send(err);
        if (sessionResults.length > 0) return res.status(403).send('User already logged in');

        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
        User.createSession(user.id, token, (err, sessionResult) => {
          if (err) return res.status(500).send(err);
          res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
          res.status(200).json({ token });
        });
      });
    });
  });
};

exports.logout = (req, res) => {
  const userId = req.user.id;
  User.deleteSession(userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res.clearCookie('token');
    res.status(200).send('User logged out');
  });
};

exports.cleanExpiredSessions = (req, res) => {
  User.cleanExpiredSessions((err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Expired sessions cleaned');
  });
};