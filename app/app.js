let express = require('express');
let compression = require('compression');
let winston = require('winston');
let path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let errorhandler = require('errorhandler');
let session = require('express-session');
let mongoose = require('mongoose');
let MongoStore = require('connect-mongo')(session);
let bluebird = require('bluebird');
var connect_s4a = require('connect-s4a');
let dotenv = require('dotenv');

// load .env if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.load();
}

let router = require('./router.js');

let app = express();

// Redirect to https://www.reddup.co
app.get('*', function (req, res, next) {
  winston.log('debug', 'req.hostname: ' + req.hostname);
  if (
    (req.headers['x-forwarded-proto'] !== 'https' ||
      /herokuapp/.test(req.hostname)) &&
    process.env.NODE_ENV === 'production'
  ) {
    res.redirect(301, new URL(req.url, 'https://www.reddup.co'));
  } else next(); // Continue to other routes if we're not redirecting
});

// SEO 4 AJAX
// app.use(connect_s4a(process.env.S4A_TOKEN));

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/rp_db';
const CACHE_TIME = 86400000 * 366; // 366 days, how long to cache static resources.

// ENABLE COMPRESSION MIDDLEWARE
app.use(compression());

// CONNECT TO MONGO DATABASE
mongoose.Promise = bluebird;
// console.log('MONGO_URI: ' + MONGO_URI);
mongoose.connect(MONGO_URI);
mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:')
);
mongoose.connection.once('open', function (callback) {
  // console.log('[MONGOOSE connection open]');
});

// VIEW ENGINE
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'pug');

// PRERENDER.IO
app.use(require('prerender-node')
  .set('beforeRender', function (req, done) {
    winston.log(
      'info',
      'PRERENDER, user-agent: ' +
          req.headers['user-agent'] +
          ' url: ' +
          req.url
    );
    done();
  })
  .set('prerenderToken', process.env.PRERENDER_TOKEN));
// .set('protocol', 'https')
// .set('host', 'reddup.co')
// .whitelisted(['^/r/w+/?$', '^/r/w+/??_escaped_fragment_=$', '^/$', '^/??_escaped_fragment_=$']);

// favicon
app.use(favicon(path.join(__dirname, '/../public/icons/favicon.ico')));

// POST BODY PARSING
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// STATIC FILES
app.use(express.static(path.join(__dirname, '/../public'), {
  maxAge: CACHE_TIME
}));
app.use(
  '/bower_components',
  express.static(path.join(__dirname, '/../bower_components'))
);

// allow directly loading angular app for debugging purposes if in development environment
if (app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '/../rpApp/build'), {
    maxAge: CACHE_TIME
  }));
}

// COOKIE
app.use(cookieParser('chiefisacattheverybestcat'));
/*
  See https://github.com/expressjs/session for cookie settings.
 */
app.use(session({
  secret: 'chiefisacattheverybestcat',
  name: 'redditpluscookie',
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

winston.log('info', "[APP] app.get('env'): " + app.get('env'));

/*
  error handlers
 */
if (app.get('env') === 'development') {
  // development error handler
  app.use(function (err, req, res, next) {
    // console.log('[DEV ERROR HANDLER] req.path: ' + req.path);
    // console.error('err.message: ' + err.message);
    res.status(err.status || 500);
    res.format({
      html: function () {
        res.render('error', {
          message: err.message
        });
      },

      json: function () {
        res.status(err.status || 500).json({
          message: err.message,
          error: err
        });
      }
    });
  });
} else {
  // production error handler
  app.use(function (err, req, res, next) {
    winston.log('error', err);
    err.status = err.status ? err.status : 500;
    res.status(err.status);
    res.redirect('/error/' + err.status + '/' + err.message);
  });
}

process.on('error', function (err) {
  winston.log('error', err);
});

module.exports = app;
