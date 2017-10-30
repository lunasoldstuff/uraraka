var express = require('express');
var compression = require('compression');
var winston = require('winston');
var path = require('path');
var favicon = require('serve-favicon');
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

// ENABLE COMPRESSION MIDDLEWARE
app.use(compression());





//CONNECT TO MONGO DATABASE
mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/rp_db';
//console.log('mongoUri: ' + mongoUri);
mongoose.connect(mongoUri);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function (callback) {
	//console.log('[MONGOOSE connection open]');
});

// VIEW ENGINE
app.set('views', path.join(__dirname, '/../views'));
//TODO enable view cache
// app.set('view cache', true);
app.set('view engine', 'pug');

// FORCE SSL
// app.get('*', function (req, res, next) {
// 	if (req.headers['x-forwarded-proto'] != 'https' && process.env.NODE_ENV === 'production')
// 		res.redirect('https://' + req.hostname + req.url)
// 	else
// 		next() /* Continue to other routes if we're not redirecting */
// });

// PRERENDER.IO
// app.use(
// 	require('prerender-node')
// 		.set('prerenderToken', 'ySORarpSlhdHWxklLGVX')
// 		.set('host', 'reddup.co')
// 		.whitelisted(['^/r/\w+/?_escaped_fragment_=$', '^/$', '^/?_escaped_fragment_=$'])

// );


//SEO4AJAX
var connect_s4a = require('connect-s4a');
// app.use(connect_s4a(process.env.S4A_TOKEN));

// favicon
app.use(favicon(__dirname + '/../public/icons/favicon.ico'));

//POST BODY PARSING
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

//STATIC FILES
var cacheTime = 86400000 * 366; //366 days, how long to cache static resources.
app.use(express.static(path.join(__dirname, '/../public'), {
	maxAge: cacheTime
}));

app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));



//COOKIE
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

app.use('/nsfw', function (req, res) {
	res.sendFile(path.join(__dirname, '/../public/images/nsfw.jpg'));
});

app.use('/self', function (req, res) {
	res.sendFile(path.join(__dirname, '/../public/images/self.jpg'));
});

app.use('/default', function (req, res) {
	res.sendFile(path.join(__dirname, '/../public/images/self.jpg'));
});

app.use('/auth', redditAuthRouter);
app.use('/api', redditApiRouter);
app.use('/twitter', twitterApiRouter);
app.use('/', rpRouter);

winston.log('info', "[APP] app.get('env'): " + app.get('env'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

	app.use(function (err, req, res, next) {
		console.log('[DEV ERROR HANDLER] req.path: ' + req.path);
		console.error('err.message: ' + err.message);
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
	// no stacktraces leaked to user
	app.use(function (err, req, res, next) {
		winston.log('error', err);
		err.status = err.status ? err.status : 500;
		res.status(err.status);
		// res.format({
		// 	html: function () {
		// res.render('error', {
		// 	message: err.message
		// });

		// res.locals = {
		// 	error: err.message
		// };


		// res.status(500).send({ error: 'something blew up' });

		// },
		// json: function () {
		// 	res.json({
		// 		message: err.message,
		// 		error: {}
		// 	});
		// }
		// });

		res.redirect('/error/' + err.status + '/' + err.message);

		// res.render('index', {
		// 	title: 'reddup',
		// 	authenticated: false,
		// 	userAgent: req.headers['user-agent'],
		// 	error: err.message
		// });

	});
}

process.on('error', function (err) {
	//console.log('[PROCESS ERROR]: ' + error.message);
	// console.error(error);
	winston.log('error', err);
});

module.exports = app;
