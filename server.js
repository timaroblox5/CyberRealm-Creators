const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Инициализация базы данных
const db = new sqlite3.Database('my_database.db');

// Создание таблицы пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Регистрация нового пользователя
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Пример простой вставки данных пользователя в базу данных
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'User registered successfully!' });
  });
});

// Вход пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Пример простого запроса на проверку логина и пароля
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful!' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
