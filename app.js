var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mustacheExpress = require('mustache-express');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//var service = require('./routes/api/v1.0/services');
var userRouter = require('./routes/api/v1.0/user');

var app = express();

// view engine setup
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
//app.use('/api/v1.0/', service);
app.use('/api/v1.0', userRouter);

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
const port = 8000; 
app.listen(port, ()=>{   
  console.log("Running in"+port); 
});                 
module.exports = app;                                     