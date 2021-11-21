var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

require('dotenv').config()
var db = require('./db.js');

var gameRouter = require('./routes/gameRouter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const api_url = "/api/v1";

app.use(api_url+"/game", gameRouter);


// Get API information
app.get(api_url, function(req, res, next) {
  res.json({"code":200, "message":"Welcome to WaSo API"});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return error message in json format
  res.status(err.status || 500);
  res.json({"error": err.message, "code": err.status});
});

module.exports = app;
