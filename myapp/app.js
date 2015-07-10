var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var account = require('./routes/account');

mongoose.connect('mongodb://booklog3:123456@ds047622.mongolab.com:47622/booklog3');
mongoose.connection.on('error', function(){
  console.log('MongoDB: connect error.');
});
mongoose.connection.on('open', function(){
  console.log('MongoDB: connected.');
});

var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: { type: String },
  content: { type: String },
  createdTime: { type: Date, default: Date.now },
});

var Post = mongoose.model('post', postSchema);

var app = express();

app.db = {
  model: {
    Post: Post
  }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'booklog3' }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

passport.use(new FacebookStrategy({
  clientID: '410866279063864',
  clientSecret: '3887b8914b81d0e778d3b9af10775fb6',
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done){
    return done(null, profile);
  }
));

app.use('/', routes);
app.use('/', posts);
app.use('/users', users);
app.use('/account', account);

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res){
    res.redirect('/account/profile');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
