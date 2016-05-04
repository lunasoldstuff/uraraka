var express = require('express');
var compression = require('compression');
var winston = require('winston');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var redditApiRouter = require('../reddit/redditApiRouter');
var redditAuthRouter = require('../reddit/redditAuthRouter');
var twitterApiRouter = require('../twitter/twitterApiRouter');
var rpRouter = require('./rpRouter.js');


var app = express();

app.use(compression());

var cacheTime = 86400000 * 366; //366 days, how long to cache static resources.


mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/rp_db';
//console.log('mongoUri: ' + mongoUri);

mongoose.connect(mongoUri);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

mongoose.connection.once('open', function(callback) {
    //console.log('[MONGOOSE connection open]');
});

// view engine setup
app.set('views', path.join(__dirname, '/../views'));
app.set('view cache', true);
app.set('view engine', 'jade');

// set up prerender
app.use(require('prerender-node').set('prerenderToken', 'ySORarpSlhdHWxklLGVX'));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/../public/icons/favicon.ico'));

// app.use(logger('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, '/../public'), {
    maxAge: cacheTime
}));

app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));

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

app.use('/nsfw', function(req, res) {
    res.sendFile(path.join(__dirname, '/../public/images/nsfw.jpg'));
});

app.use('/self', function(req, res) {
    res.sendFile(path.join(__dirname, '/../public/images/self.jpg'));
});

app.use('/default', function(req, res) {
    res.sendFile(path.join(__dirname, '/../public/images/self.jpg'));
});

app.use('/auth', redditAuthRouter);
app.use('/api', redditApiRouter);
app.use('/twitter', twitterApiRouter);
app.use('/', rpRouter);

winston.log('info', "[APP] app.get('env'): " + app.get('env'));
winston.log('info', "process.env.NODE_ENV: " + process.env.NODE_ENV);


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
        //console.log('[DEV ERROR HANDLER] req.path: ' + req.path);
        console.error(err);
        var status = err.status || 500;
        res.status(status);
        res.format({

            // html: function() {
            // 	res.render('index', {
            // 		message: err.message,
            // 		error: err
            // 	});
            // },

            html: function() {
                // res.redirect('/error/' + status);

                //console.log('[DEV ERROR HANDLER] err.message: ' + err.message);

                res.render('error', {
                    status: status,
                    message: err.message
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
        res.format({
            html: function() {
                res.render('error', {
                    status: status,
                    message: err.message
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

process.on('error', function(err) {
    //console.log('[PROCESS ERROR]: ' + error.message);
    // console.error(error);
    winston.log('error', error);
});

module.exports = app;