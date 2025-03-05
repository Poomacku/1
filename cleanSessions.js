const User = require('./models/userModel');

const cleanExpiredSessions = () => {
  User.cleanExpiredSessions((err, result) => {
    if (err) {
      console.error('Error cleaning expired sessions:', err);
    } else {
      console.log('Expired sessions cleaned:', result.affectedRows);
    }
  });
};

// Uruchamianie czyszczenia sesji co godzinę
setInterval(cleanExpiredSessions, 3600000);

// Natychmiastowe uruchomienie przy starcie skryptu
cleanExpiredSessions();