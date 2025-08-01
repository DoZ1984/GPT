const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?,?)', [username, hashed], err => {
    if (err) {
      return res.render('register', { error: 'Usuario existente' });
    }
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (!row) return res.render('login', { error: 'Credenciales incorrectas' });
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.render('login', { error: 'Credenciales incorrectas' });
    req.session.user = { id: row.id, username: row.username };
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Single player page
app.get('/single', (req, res) => {
  res.render('single');
});

// Multiplayer page
app.get('/multi', (req, res) => {
  res.render('multi');
});

const texts = [
  'El veloz murciélago hindú comía feliz cardillo y kiwi.',
  'La cigüeña tocaba el saxofón detrás del palenque de paja.',
  'Jovencillo emponzoñado de whisky, ¡qué figurota exhibe!'
];

io.on('connection', socket => {
  socket.on('joinRace', () => {
    socket.join('race');
    if (io.sockets.adapter.rooms.get('race').size >= 2) {
      const text = texts[Math.floor(Math.random() * texts.length)];
      io.to('race').emit('startRace', text);
    }
  });
  socket.on('progress', progress => {
    socket.to('race').emit('opponentProgress', progress);
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
