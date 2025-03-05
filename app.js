const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const checkAuth = require('./middleware/checkAuth');
const User = require('./models/userModel');
const app = express();

// Dodanie czyszczenia sesji
require('./cleanSessions');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);

// Dodanie ścieżek do widoków HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/dashboard', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/logout', checkAuth, (req, res) => {
  const userId = req.user.id;
  User.deleteSession(userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res.clearCookie('token');
    res.redirect('/');
  });
});

// Zabezpieczona trasa
app.get('/protected', checkAuth, (req, res) => {
  res.send('This is a protected route.');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});