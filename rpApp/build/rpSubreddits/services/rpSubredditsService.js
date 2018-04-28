'use strict';

(function () {
	'use strict';

	angular.module('rpSubreddits').factory('rpSubredditsService', ['$rootScope', 'rpAppAuthService', 'rpToastService', 'rpAppRedditApiService', rpSubredditsService]);

	function rpSubredditsService($rootScope, rpAppAuthService, rpToastService, rpAppRedditApiService) {

		var rpSubredditsService = {};

		rpSubredditsService.subs = [];
		rpSubredditsService.currentSub = "";
		rpSubredditsService.about = {};
		rpSubredditsService.subscribed = null;

		var limit = 50;

		rpSubredditsService.updateSubreddits = function (callback) {

			if (rpAppAuthService.isAuthenticated) {
				loadUserSubreddits(callback);
			} else {
				loadDefaultSubreddits(callback);
			}
		};

		/*
  	Continously attempt loading subreddits if it fails to load.
  */
		function updateSubredditsErrorHandler(error, data) {
			if (error) {
				console.log('[rpSubredditsService] updateSubreddits, load subreddits failed');
				rpSubredditsService.updateSubreddits(updateSubredditsErrorHandler);
			} else {
				console.log('[rpSubredditsService] updateSubreddits, load subreddits success');
			}
		}

		rpSubredditsService.updateSubreddits(updateSubredditsErrorHandler);

		rpSubredditsService.resetSubreddit = function () {
			rpSubredditsService.currentSub = "";
			rpSubredditsService.subscribed = null;
			rpSubredditsService.about = {};
		};

		rpSubredditsService.setSubreddit = function (sub) {
			console.log('[rpSubredditsService] setSubreddit, sub: ' + sub);

			if (sub && rpSubredditsService.currentSub !== sub) {

				rpSubredditsService.currentSub = sub;
				updateSubscriptionStatus();
				loadSubredditAbout();
			}
		};

		function loadUserSubreddits(callback) {
			console.log('[rpSubredditsService] loadUserSubreddits()');

			rpAppRedditApiService.redditRequest('listing', '/subreddits/mine/$where', {
				$where: 'subscriber',
				limit: limit,
				after: ""

			}, function (data) {

				if (data.responseError) {
					console.log('[rpSubredditsService] loadUserSubreddits(), ResponseError');
					rpToastService("something went wrong updating your subreddits", "sentiment_dissatisfied");
					callback(data, null);
				} else {

					if (data.get.data.children.length > 0) {

						rpSubredditsService.subs = data.get.data.children;

						/*
      we have all the subreddits, no need to get more.
      */
						if (data.get.data.children.length < limit) {
							$rootScope.$emit('subreddits_updated');
							updateSubscriptionStatus();
							callback(null, data);
						} else {
							//dont have all the subreddits yet, get more.
							loadMoreUserSubreddits(data.get.data.children[data.get.data.children.length - 1].data.name, callback);
						}

						/*
      no subreddits returned. load deafult subs.
      */
					} else {
						//If the user has no subreddits load the default subs.
						loadDefaultSubreddits(callback);
					}
				}
			});
		}

		function loadMoreUserSubreddits(after, callback) {
			console.log('[rpSubredditsService] loadMoreUserSubreddits(), after: ' + after);

			rpAppRedditApiService.redditRequest('listing', '/subreddits/mine/$where', {
				$where: 'subscriber',
				after: after,
				limit: limit
			}, function (data) {
				if (data.responseError) {
					console.log('[rpSubredditsService] loadMoreUserSubreddits() ResponseError');
					rpToastService("something went wrong updating your subreddits", "sentiment_dissatisfied");
					callback(data, null);
				} else {

					/*
     	add the subreddits instead of replacing.
      */
					rpSubredditsService.subs = rpSubredditsService.subs.concat(data.get.data.children);

					/*
     	end case.
     	we have all the subreddit.
      */
					if (data.get.data.children.length < limit) {
						$rootScope.$emit('subreddits_updated');
						updateSubscriptionStatus();
						callback(null, data);
					} else {
						//dont have all the subreddits yet. recurse to get more.
						loadMoreUserSubreddits(data.get.data.children[data.get.data.children.length - 1].data.name, callback);
					}
				}
			});
		}

		function loadDefaultSubreddits(callback) {
			console.log('[rpSubredditsService] loadDefaultSubreddits()');

			rpAppRedditApiService.redditRequest('listing', '/subreddits/$where', {
				$where: 'default',
				limit: limit
			}, function (data) {
				if (data.responseError) {
					console.log('[rpSubredditsService] err');
					rpToastService("something went wrong updating your subreddits", "sentiment_dissatisfied");
					callback(data, null);
				} else {
					console.log('[rpSubredditsService] loadDefaultSubreddits(), data.get.data.children.length: ' + data.get.data.children.length);

					rpSubredditsService.subs = data.get.data.children;
					$rootScope.$emit('subreddits_updated');
					updateSubscriptionStatus();
					callback(null, data);
				}
			});
		}

		rpSubredditsService.subscribeCurrent = function (callback) {
			console.log('[rpSubredditsService] subscribeCurrent(), currentSub: ' + rpSubredditsService.currentSub);

			var action = rpSubredditsService.subscribed ? 'unsub' : 'sub';

			rpAppRedditApiService.redditRequest('post', '/api/subscribe', {
				action: action,
				sr: rpSubredditsService.about.data.name
			}, function (data) {

				if (data.responseError) {
					console.log('[rpSubredditsService] err');
					callback(data, null);
				} else {

					rpSubredditsService.updateSubreddits(function (err, data) {
						if (err) {
							console.log('[rpSubredditsService] err');
							callback(data, null);
						} else {
							callback(null, data);
						}
					});
				}
			});
		};

		/*
  	Called from search results,
  	where we need to subscribe to a subreddit that is not the current subreddit.
   */

		rpSubredditsService.subscribe = function (action, name, callback) {
			console.log('[rpSubredditsService], subscribe(), action: ' + action + ", name: " + name);

			if (rpAppAuthService.isAuthenticated) {

				rpAppRedditApiService.redditRequest('post', '/api/subscribe', {
					action: action,
					sr: name
				}, function (data) {

					if (data.responseError) {
						console.log('[rpSubredditsService] err');
						callback(data, null);
					} else {
						rpSubredditsService.updateSubreddits(function (err, data) {
							if (err) {
								console.log('[rpSubredditsService] err');
								callback(data, null);
							} else {
								callback(null, data);
							}
						});
					}
				});
			} else {
				rpToastService("you must log in to subscribe to subreddits", "sentiment_neutral");
			}
		};

		rpSubredditsService.isSubscribed = function (sub) {
			console.log('[rpSubredditsService] isSubscribed(), sub: ' + sub);
			return isSubscribed(sub);
		};

		function isSubscribed(sub) {

			if (typeof sub === 'undefined') {
				sub = rpSubredditsService.currentSub;
			}

			console.log('[rpSubredditsService] isSubscribed, rpSubredditsService.subs.length: ' + rpSubredditsService.subs.length);
			if (rpSubredditsService.subs.length > 0 && sub !== "") {

				for (var i = 0; i < rpSubredditsService.subs.length; i++) {

					if (rpSubredditsService.subs[i].data.display_name.toLowerCase() === sub.toLowerCase()) {
						console.log('[rpSubredditsService] isSubscribed(), true');
						return true;
					}
				}

				console.log('[rpSubredditsService] isSubscribed(), false');
				return false;
			} else {

				console.log('[rpSubredditsService] isSubscribed(), returning null, rpSubredditsService.subs.length: ' + rpSubredditsService.subs.length + ", sub: " + sub);

				return null;
			}
		}

		function updateSubscriptionStatus() {

			console.log('[rpSubredditsService] updateSubscriptionStatus(), ' + rpSubredditsService.subs.length + ", " + rpSubredditsService.currentSub);

			var prevSubStatus = rpSubredditsService.subscribed;
			rpSubredditsService.subscribed = isSubscribed();

			if (rpSubredditsService.subscribed !== prevSubStatus) {
				console.log('[rpSubredditsService] updateSubscriptionStatus(), rpSubredditsService.subscribed: ' + rpSubredditsService.subscribed);
				$rootScope.$emit('subscription_status_changed', rpSubredditsService.subscribed);
			}
		}

		rpSubredditsService.aboutSub = function (sub, callback) {
			console.log('[rpSubredditsService] aboutSub(), sub: ' + sub);
			callback(loadSubredditAbout(sub));
		};

		function loadSubredditAbout(sub) {
			// console.log('[rpSubredditsService] loadSubredditAbout()');

			sub = angular.isDefined(sub) ? sub : rpSubredditsService.currentSub;

			rpAppRedditApiService.redditRequest('get', '/r/$sub/about.json', {
				$sub: sub
			}, function (data) {

				if (data.responseError) {
					console.log('[rpSubredditsService] loadSubredditsAbout(), err');
				} else {
					console.log('[rpSubredditsService] loadSubredditsAbout, data.data.name: ' + data.data.name);
					// console.log('[rpSubredditsService] loadSubredditsAbout, data: ' + JSON.stringify(data));

					if (sub === rpSubredditsService.currentSub) {
						rpSubredditsService.about = data;
						$rootScope.$emit('subreddits_about_updated');
						$rootScope.$emit('rp_description_change', rpSubredditsService.about.data.public_description);
					}

					return data;
				}
			});
		}

		return rpSubredditsService;
	}
})();