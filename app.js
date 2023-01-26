var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser')
const cors = require('cors');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

require('dotenv').config()
var db = require('./db.js');


var gameRouter = require('./routes/game');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  // TODO: change this to your own domain if you want to
  origin: ['http://localhost:3000', 'https://waso.paffnet.de', 'https://waso-frontend.paffnet.de'],
  credentials: true
}));

app.use(session({
  store: new SQLiteStore,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'strict', secure: false }, // 30 days
  resave: false,
  saveUninitialized: false,
}));

// Serve frontend from subfolder waso_frontend
const frontend_dir = "./waso_frontend/"
app.use(express.static(frontend_dir + 'dist'));

app.get('/', (req, res) => {
  res.sendFile(frontend_dir + 'dist/index.html')
})
app.get('/user', (req, res) => {
  res.sendFile(frontend_dir + 'dist/index.html')
})
app.get('/game', (req, res) => {
  res.sendFile(frontend_dir + 'dist/index.html')
})

const api_url = "/api/v1";

app.use(api_url + "/game", gameRouter);
app.use(api_url + "/login", loginRouter);
app.use(api_url + "/user", userRouter);


// Get API information
app.get(api_url, function (req, res, next) {
  res.json({ "code": 200, "message": "Welcome to WaSo API" });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return error message in json format
  res.status(err.status || 500);
  res.json({ "error": err.message, "code": err.status });
});

module.exports = app;
