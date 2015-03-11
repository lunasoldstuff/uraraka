var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var redditApiRouter = require('./reddit/redditApiRouter');
var redditAuthRouter = require('./reddit/redditAuthRouter');
var twitterApiRouter = require('./twitter/twitterApiRouter');

var app = express();
mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost/rp_db';

mongoose.connect(mongoUri);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.once('open', function (callback) {
    console.log('[MONGOOSE connection open]');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'chiefisacattheverybestcat',
    name: 'redditpluscookie',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

app.use('/nsfw', function(req, res) {
    res.sendFile(__dirname + '/public/images/nsfw.jpg');
});
app.use('/self', function(req, res) {
    res.sendFile(__dirname + '/public/images/self.jpg');
});
app.use('/default', function(req, res) {
    res.sendFile(__dirname + '/public/images/self.jpg');
});

app.use('/auth', redditAuthRouter);
app.use('/api', redditApiRouter);
app.use('/twitter', twitterApiRouter);
app.use('/', routes);

console.log("[APP] Env: " + app.get('env'));

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
        console.log('ERRORZ :(');
        console.log("req.path: " + req.path);
        console.error(err);
        res.status(err.status || 500);
        res.format({
            html: function() {
                res.render('error', {
                    message: err.message,
                    error: err
                });                        
            },
            json: function() {
                res.json({
                    message: err.message,
                    error: err
                });
            }
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.res.format({
            html: function() {
                res.render('error', {
                    message: err.message,
                    error: {}
                });                        
            },
            json: function() {
                res.json({
                    message: err.message,
                    error: {}
                });
            }
        });
    });
}

module.exports = app;