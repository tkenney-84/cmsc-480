var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');

var app = express();

global.database = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  port     : process.env.DATABASE_PORT,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE_NAME,
  sslmode  : 'REQUIRED',
});

console.log("DATABASE", global.database);

global.database.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit();
  }
});

var cors = require('cors');
var corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(process.env.PORT);

process.on('SIGINT', function() {
  global.database.end(function(err) {
    if (err) {
      console.error('Failed to close MySQL connection:', err);
    } else {
      console.log('MySQL connection closed.');
    }
    process.exit();
  });
});

global.database.on('error', function(err) {
  console.error('Database error:', err);

  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    global.database = mysql.createConnection(global.database.config);
  } else {
    throw err;
  }
});

module.exports = app;
