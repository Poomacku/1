const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(sql, [userData.username, userData.password], callback);
  },
  findByUsername: (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], callback);
  },
  createSession: (userId, token, callback) => {
    const sql = `INSERT INTO sessions (user_id, token) VALUES (?, ?)`;
    db.query(sql, [userId, token], callback);
  },
  deleteSession: (userId, callback) => {
    const sql = `DELETE FROM sessions WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  },
  findSessionByUserId: (userId, callback) => {
    const sql = `SELECT * FROM sessions WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  },
  cleanExpiredSessions: (callback) => {
    const sql = `DELETE FROM sessions WHERE created_at < NOW() - INTERVAL 1 HOUR`;
    db.query(sql, [], callback);
  }
};

module.exports = User;