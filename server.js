const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up session middleware
app.use(session({
  secret: 'super-secret-key-railelectr',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Defined users
const USERS = {
  'PDG': 'pdg123',
  'dfc': 'dfc123',
  'dircom': 'dcom123',
  'dirreal': 'dreal123'
};

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.redirect('/login?error=1');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Protect the root route and static files
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'ERP Rail Electr Portefeuille Activité Globale.html'));
});

// Protect all static files (like if they try to access the HTML directly)
app.use(requireAuth, express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
