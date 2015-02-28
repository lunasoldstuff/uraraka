var express = require('express');
var router = express.Router();
var RedditStrategy = require('passport-reddit').Strategy;
var crypto = require('crypto');
var RedditUser = require('../models/redditUser');
var REDDIT_CONSUMER_KEY = "Gpy69vUdPU_-MA";
var REDDIT_CONSUMER_SECRET = "zlcuxzzwfexoVKpYatn_1lfZslI";


module.exports = function(passport){
	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  RedditUser.findById(id, function(err, user){
	  	done(err, user);
	  });
	});

	// Use the RedditStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and Reddit
	//   profile), and invoke a callback with a user object.
	passport.use(
		new RedditStrategy({
			clientID: REDDIT_CONSUMER_KEY,
			clientSecret: REDDIT_CONSUMER_SECRET,
			callbackURL: "http://localhost:3000/auth/reddit/callback",
			type: 'explicit',
			duration: 'permanent',
			scope: [
			'identity', 'edit', 'flair', 'history', 'mysubreddits', 'privatemessages',
			'read', 'report', 'save', 'submit', 'subscribe', 'vote'
			]
		},
		function(accessToken, refreshToken, profile, done) {
			console.log('[AUTH VERIFY CALLBACK]');
			console.log('accessToken: ' + accessToken);
			console.log('refreshToken: ' + refreshToken);
			console.log('profile.id: ' + profile.id);

			// asynchronous verification, for effect...
			process.nextTick(function () {
			console.log('[AUTH FIND USER IN DATABASE]');

			RedditUser.findOne({'reddit.id': profile.id}, function(err, user){
				if (err) {
					console.log("[AUTH USER FINDONE ERROR]");
					return done(err);
				}
				if (user) {
					console.log("[AUTH USER FOUND]");
					return done(null, user);
				}
				else {
					console.log("[AUTH NEW USER]");
					var newUser = new RedditUser();
					newUser.reddit.id = profile.id;
					newUser.reddit.accessToken = accessToken;
					newUser.reddit.refreshToken = refreshToken;

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		})
		})
	);

	router.get('/reddit', function(req, res, next){
		console.log('[AUTH REDDIT]');
		req.session.state = crypto.randomBytes(32).toString('hex');
		passport.authenticate('reddit', {
			clientID: REDDIT_CONSUMER_KEY,
		    clientSecret: REDDIT_CONSUMER_SECRET,
		    callbackURL: "http://localhost:3000/auth/reddit/callback",
			type: 'explicit',
			duration: 'permanent',
		    scope: [
			    	'identity', 'edit', 'flair', 'history', 'mysubreddits', 'privatemessages',
			    	 'read', 'report', 'save', 'submit', 'subscribe', 'vote'
		    	  ],
			state: req.session.state
		})(req, res, next);
	});

	router.get('/reddit/callback', function(req, res, next){
	  // Check for origin via state token
		console.log('[AUTH REDDIT CALLBACK]');
		if (req.query.state == req.session.state){
		console.log('[STATE MATCHED, AUTHENTICATING...]');
		passport.authenticate('reddit', {
			successRedirect: '/',
		  	failureRedirect: '/'
		})(req, res, next);
		}
		else {
			next( new Error(403) );
		}
	});

	router.get('/', function(req, res, next) {
	   res.render('index', { title: 'logon redirect...' }); 
	});

	router.get('/profile', function(req, res, next) {
	   res.render('index', { title: 'profile' }); 
	});

	router.get('reddit/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	return router;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}	