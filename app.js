var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({ path: __dirname + '/.env' })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const compression = require('compression');
const helmet = require('helmet');

var app = express();
app.use(helmet());

// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect jQuery JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect Bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/bs-custom-file-input/dist')); // redirect Bootstrap Custom File Input JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect Bootstrap CSS

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
