'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);

rpUtilServices.factory('rpGoogleUrlUtilService', ['rpGoogleUrlResourceService',
	function(rpGoogleUrlResourceService) {
		return function(longUrl, callback) {
			console.log('[rpGoogleUrlUtilService] longUrl: ' + longUrl);
			rpGoogleUrlResourceService.save({
				longUrl: longUrl
			}, function(data) {

				if (typeof data === Error) {
					callback(data, null);
				} else {
					console.log('[rpGoogleUrlUtilService] data: ' + console.log(JSON.stringify(data)));
					callback(null, data);
				}

			});
		};
	}
]);

rpUtilServices.factory('rpSearchUtilService', ['$rootScope', 'rpSearchResourceService', 'rpLocationUtilService', 'rpToastUtilService',
	function($rootScope, rpSearchResourceService, rpLocationUtilService, rpToastUtilService) {

		var rpSearchUtilService = {};

		rpSearchUtilService.params = {
			q: "",
			sub: "all",
			type: "sr, link",
			sort: "relevance",
			t: "all",
			after: "",
			limit: 8
		};

		rpSearchUtilService.search = function(callback) {
			console.log('[rpSearchUtilService] search()');

			if (rpSearchUtilService.params.q) {

				rpSearchResourceService.get({
					sub: rpSearchUtilService.params.sub,
					q: rpSearchUtilService.params.q,
					restrict_sub: rpSearchUtilService.params.restrict_sub,
					sort: rpSearchUtilService.params.sort,
					type: rpSearchUtilService.params.type,
					t: rpSearchUtilService.params.t,
					after: rpSearchUtilService.params.after,
					limit: rpSearchUtilService.params.limit
				}, function(data) {

					if (data.responseError) {
						rpToastUtilService('Something went wrong with your search request :/');
						callback(data, null);
					} else {
						callback(null, data);
					}

				});

			} else {
				callback(null, null);
			}

		};

		return rpSearchUtilService;

	}
]);

rpUtilServices.factory('rpLocationUtilService', ['$location', '$window',
	function($location, $window) {
		return function(e, url, search, reload, replace) {

			if (e !== null && e.ctrlKey) {
				url = search ? url + '?' + search : url;

				console.log('[rpLocationUtilService] search: ' + search);
				console.log('[rpLocationUtilService] url: ' + url);

				$window.open(url);

			} else {

				console.log('[rpLocationUtilService] url: ' + url);
				console.log('[rpLocationUtilService] search: ' + search);
				console.log('[rpLocationUtilService] reload: ' + reload);
				console.log('[rpLocationUtilService] replace: ' + replace);

				$location.search(search);

				$location.path(url, reload);


				if (replace) {
					$location.replace();
				}

			}

		};
	}
]);

rpUtilServices.factory('rpSettingsUtilService', ['$rootScope', 'rpSettingsResourceService', 'rpToastUtilService',
	function($rootScope, rpSettingsResourceService, rpToastUtilService) {

		var rpSettingsUtilService = {};

		/*
			Initial Settings, define the default settings.
		 */
		rpSettingsUtilService.settings = {
			over18: true,
			composeDialog: true,
			commentsDialog: true,
			submitDialog: true,
			settingsDialog: true,
			theme: 'default',
		};

		/*
			Public Methods for App.
		 */
		rpSettingsUtilService.getSettings = function() {
			console.log('[rpSettingsUtilService] getSetting, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
			return rpSettingsUtilService.settings;
		};

		rpSettingsUtilService.setSettings = function(settings) {
			console.log('[rpSettingsUtilService] setSetting, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
			rpSettingsUtilService.settings = settings;
			rpSettingsUtilService.saveSettings();
		};

		/*
			Server Communication.
		 */
		rpSettingsUtilService.retrieveSettings = function() {
			rpSettingsResourceService.get(function(data) {
				console.log('[rpSettingsUtilService] retrieveSettings, data: ' + JSON.stringify(data));
				console.log('[rpSettingsUtilService] retrieveSettings, data.loadDefaults: ' + JSON.stringify(data));

				if (data.loadDefaults !== true) {
					console.log('[rpSettingsUtilService] retrieveSettings, using server settings');

					for (var setting in data) {
						rpSettingsUtilService.settings[setting] = data[setting];
					}
				}

				console.log('[rpSettingsUtilService] emit settings_changed');

				$rootScope.$emit('settings_changed');
			});
		};

		rpSettingsUtilService.saveSettings = function() {
			// console.log('[rpSettingsUtilService] saveSettings, attempting to save settings...');

			rpSettingsResourceService.save(rpSettingsUtilService.settings, function(data) {
				console.log('[rpSettingsUtilService] saveSettings, data: ' + JSON.stringify(data));
			});

			rpToastUtilService('Setting Saved :)!');
			$rootScope.$emit('settings_changed');


		};

		$rootScope.$on('authenticated', function() {
			rpSettingsUtilService.retrieveSettings();
		});

		return rpSettingsUtilService;

	}
]);

rpUtilServices.factory('rpSearchFormUtilService', ['$rootScope',
	function($rootScope) {

		var rpSearchFormUtilService = {};

		rpSearchFormUtilService.isVisible = false;

		rpSearchFormUtilService.show = function() {
			rpSearchFormUtilService.isVisible = true;
			$rootScope.$emit('search_form_visibility', true);
		};

		rpSearchFormUtilService.hide = function() {
			rpSearchFormUtilService.isVisible = false;
			$rootScope.$emit('search_form_visibility', false);
		};

		return rpSearchFormUtilService;

	}
]);

rpUtilServices.factory('rpSubscribeButtonUtilService', ['$rootScope', 'rpSubredditsUtilService',
	function($rootScope, rpSubredditsUtilService) {
		var rpSubscribeButtonUtilService = {};

		rpSubscribeButtonUtilService.isVisible = false;

		rpSubscribeButtonUtilService.show = function() {
			rpSubscribeButtonUtilService.isVisible = true;
			$rootScope.$emit('subscribe_visibility');
		};
		rpSubscribeButtonUtilService.hide = function() {
			console.log('[rpSubscribeButtonUtilService] hide(), rpSubredditsUtilService.resetSubreddit() called.');
			rpSubscribeButtonUtilService.isVisible = false;
			rpSubredditsUtilService.resetSubreddit();
			$rootScope.$emit('subscribe_visibility');
		};

		return rpSubscribeButtonUtilService;

	}
]);

rpUtilServices.factory('rpUserSortButtonUtilService', ['$rootScope',
	function($rootScope) {
		var rpUserSortButtonUtilService = {};

		rpUserSortButtonUtilService.isVisible = false;

		rpUserSortButtonUtilService.show = function() {
			rpUserSortButtonUtilService.isVisible = true;
			$rootScope.$emit('user_sort_button_visibility');
		};

		rpUserSortButtonUtilService.hide = function() {
			rpUserSortButtonUtilService.isVisible = false;
			$rootScope.$emit('user_sort_button_visibility');

		};

		return rpUserSortButtonUtilService;
	}
]);

rpUtilServices.factory('rpSidebarButtonUtilService', ['$rootScope',
	function($rootScope) {
		var rpSidebarButtonUtilService = {};

		rpSidebarButtonUtilService.isVisible = false;

		rpSidebarButtonUtilService.show = function() {
			rpSidebarButtonUtilService.isVisible = true;
			$rootScope.$emit('rules_button_visibility');
		};

		rpSidebarButtonUtilService.hide = function() {
			rpSidebarButtonUtilService.isVisible = false;
			$rootScope.$emit('rules_button_visibility');

		};

		return rpSidebarButtonUtilService;

	}
]);

rpUtilServices.factory('rpUserFilterButtonUtilService', ['$rootScope',
	function($rootScope) {
		var rpUserFilterButtonUtilService = {};

		rpUserFilterButtonUtilService.isVisible = false;

		rpUserFilterButtonUtilService.show = function() {
			rpUserFilterButtonUtilService.isVisible = true;
			$rootScope.$emit('user_filter_button_visibility');
		};

		rpUserFilterButtonUtilService.hide = function() {
			rpUserFilterButtonUtilService.isVisible = false;
			$rootScope.$emit('user_filter_button_visibility');

		};

		return rpUserFilterButtonUtilService;
	}
]);

rpUtilServices.factory('rpPostFilterButtonUtilService', ['$rootScope',
	function($rootScope) {
		var rpPostFilterButtonUtilService = {};

		rpPostFilterButtonUtilService.isVisible = false;

		rpPostFilterButtonUtilService.show = function() {
			rpPostFilterButtonUtilService.isVisible = true;
			$rootScope.$emit('post_filter_button_visibility');
		};

		rpPostFilterButtonUtilService.hide = function() {
			rpPostFilterButtonUtilService.isVisible = false;
			$rootScope.$emit('post_filter_button_visibility');

		};

		return rpPostFilterButtonUtilService;
	}
]);

rpUtilServices.factory('rpSearchFilterButtonUtilService', ['$rootScope',
	function($rootScope) {
		var rpSearchFilterButtonUtilService = {};

		rpSearchFilterButtonUtilService.isVisible = false;

		rpSearchFilterButtonUtilService.show = function() {
			rpSearchFilterButtonUtilService.isVisible = true;
			$rootScope.$emit('search_filter_button_visibility');
		};

		rpSearchFilterButtonUtilService.hide = function() {
			rpSearchFilterButtonUtilService.isVisible = false;
			$rootScope.$emit('search_filter_button_visibility');

		};

		return rpSearchFilterButtonUtilService;
	}
]);

rpUtilServices.factory('rpIdentityUtilService', ['rpIdentityResourceService', 'rpAuthUtilService',
	function(rpIdentityResourceService, rpAuthUtilService) {

		var rpIdentityUtilService = {};
		var callbacks = [];
		var gettingIdentity = false;

		rpIdentityUtilService.identity = null;

		rpIdentityUtilService.reloadIdentity = function(callback) {

			rpIdentityUtilService.identity = null;

			rpIdentityUtilService.getIdentity(callback);

		};

		rpIdentityUtilService.getIdentity = function(callback) {
			console.log('[rpIdentityUtilService] getIdentity()');

			if (rpAuthUtilService.isAuthenticated) {

				if (rpIdentityUtilService.identity !== null) {
					console.log('[rpIdentityUtilService] getIdentity(), have identity');
					callback(rpIdentityUtilService.identity);

				} else {

					callbacks.push(callback);

					if (gettingIdentity === false) {
						gettingIdentity = true;

						console.log('[rpIdentityUtilService] getIdentity(), requesting identity');

						rpIdentityResourceService.get(function(data) {

							rpIdentityUtilService.identity = data;
							gettingIdentity = false;

							for (var i = 0; i < callbacks.length; i++) {
								callbacks[i](rpIdentityUtilService.identity);
							}
							callbacks = [];

						});

					}

				}

			} else {
				callback(null);
			}
		};

		return rpIdentityUtilService;
	}

]);

rpUtilServices.factory('rpAuthUtilService', ['$rootScope', 'rpSettingsUtilService',
	function($rootScope, rpSettingsUtilService) {

		var rpAuthUtilService = {};

		rpAuthUtilService.isAuthenticated = false;

		// rpAuthUtilService.identity = {};

		rpAuthUtilService.setIdentity = function(identity) {
			rpAuthUtilService.identity = identity;
		};

		rpAuthUtilService.setAuthenticated = function(authenticated) {
			console.log('[rpAuthUtilService] setAuthenticated: ' + authenticated);
			rpAuthUtilService.isAuthenticated = authenticated;

			$rootScope.$emit('authenticated');

		};

		return rpAuthUtilService;

	}
]);

rpUtilServices.factory('rpToastUtilService', ['$mdToast',
	function($mdToast) {
		return function(message) {
			$mdToast.show({
				locals: {
					toastMessage: message
				},
				controller: 'rpToastCtrl',
				templateUrl: 'partials/rpToast',
				hideDelay: 2500,
				position: "top left",
			});
		};
	}
]);

rpUtilServices.factory('rpGildUtilService', ['rpGildResourceService', 'rpToastUtilService',
	function(rpGildResourceService, rpToastUtilService) {
		return function(fullname, callback) {

			rpGildResourceService.save({
				fullname: fullname

			}, function(data) {

				if (data.responseError) {
					var body = JSON.parse(data.body);
					console.log('[rpGildUtilService] body.reason: ' + body.reason);
					if (body.reason === 'INSUFFICIENT_CREDDITS') {
						rpToastUtilService("You aint got no creddits in your reddit account :/");
					} else {
						rpToastUtilService("Something went wrong trying to gild this post :/");
					}
					callback(data, null);
				} else {
					rpToastUtilService("gilded post is gilded :)");
					callback(null, data);
				}

			});
		};
	}
]);

rpUtilServices.factory('rpEditUtilService', ['rpEditResourceService', 'rpToastUtilService',
	function(rpEditResourceService, rpToastUtilService) {
		return function(text, thing_id, callback) {
			console.log('[rpEditUtilService]');

			rpEditResourceService.save({
				text: text,
				thing_id: thing_id
			}, function(data) {

				if (data.responseError) {
					rpToastUtilService("Something went wrong trying to edit your post :/");
					callback(data, null);
				} else {
					rpToastUtilService("Post Editted");
					callback(null, data);
				}
			});

		};
	}
]);

rpUtilServices.factory('rpDeleteUtilService', ['rpAuthUtilService', 'rpDeleteResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpDeleteResourceService, rpToastUtilService) {

		return function(name, callback) {
			console.log('[rpDeleteUtilService] name: ' + name);

			rpDeleteResourceService.save({
				id: name
			}, function(data) {
				if (data.responseError) {
					rpToastUtilService("Something went wrong trying to delete your post :/");
					callback(data, null);
				} else {
					rpToastUtilService("Post deleted");
					callback(null, data);

				}

			});

		};
	}
]);

rpUtilServices.factory('rpSaveUtilService', ['rpSaveResourceService', 'rpUnsaveResourceService',
	function(rpSaveResourceService, rpUnsaveResourceService) {

		return function(id, save, callback) {

			var resourceService = save ? rpSaveResourceService : rpUnsaveResourceService;

			resourceService.save({
				id: id
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});


		};

	}
]);

rpUtilServices.factory('rpVoteUtilService', ['rpAuthUtilService', 'rpToastUtilService', 'rpVoteResourceService',
	function(rpAuthUtilService, rpToastUtilService, rpVoteResourceService) {

		return function(id, dir, callback) {

			rpVoteResourceService.save({
				id: id,
				dir: dir
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};

	}
]);

rpUtilServices.factory('rpCommentUtilService', ['rpAuthUtilService', 'rpCommentResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpCommentResourceService, rpToastUtilService) {

		//to safegaurd against double tapping enter
		//and posting the comment twice
		var replying = false;

		return function(name, comment, callback) {
			console.log('[rpCommentUtilService]');

			if (rpAuthUtilService.isAuthenticated) {

				if (comment && !replying) {

					replying = true;

					rpCommentResourceService.save({
						parent_id: name,
						text: comment

					}, function(data) {
						replying = false;

						if (data.responseError) {
							console.log('[rpCommentUtilService] responseError: ' + JSON.stringify(data));

							var message = "Something went wrong trying to post you comment :/";

							if (data.body) {
								var body = JSON.parse(data.body);

								console.log('[rpCommentUtilService] responseError, data.body.json: ' + JSON.stringify(body.json));

								if (body.json.errors[0][0] === 'TOO_OLD') {
									// message = "That post is too old to comment on.";
									message = body.json.errors[0][1];
								}

							}

							rpToastUtilService(message);

							callback(data, null);
						} else {
							rpToastUtilService("Comment Posted :)");
							callback(null, data);

						}

					});
				}

			} else {
				rpToastUtilService("You've got to log in to post comments");
			}
		};
	}
]);

rpUtilServices.factory('rpMessageComposeUtilService', ['rpAuthUtilService', 'rpMessageComposeResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpMessageComposeResourceService, rpToastUtilService) {
		return function(subject, text, to, iden, captcha, callback) {
			if (rpAuthUtilService.isAuthenticated) {

				rpMessageComposeResourceService.save({
					subject: subject,
					text: text,
					to: to,
					iden: iden,
					captcha: captcha
				}, function(data) {

					if (data.responseError) {
						rpToastUtilService("Something went wrong trying to send your message :/");
						callback(data, null);
					} else {
						console.log('[rpMessageComposeUtilService] data: ' + JSON.stringify(data));
						callback(null, data);
					}

				});

			} else {
				rpToastUtilService("You've got to log in send messages.");
			}
		};
	}
]);

rpUtilServices.factory('rpSubmitUtilService', ['rpAuthUtilService', 'rpSubmitResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpSubmitResourceService, rpToastUtilService) {

		return function(kind, resubmit, sendreplies, sr, text, title, url, iden, captcha, callback) {
			if (rpAuthUtilService.isAuthenticated) {

				rpSubmitResourceService.save({
					kind: kind,
					sendreplies: sendreplies,
					sr: sr,
					text: text,
					title: title,
					url: url,
					resubmit: resubmit,
					iden: iden,
					captcha: captcha
				}, function(data) {

					/*
						Handle errors here instead of in controller.
					 */

					console.log('[rpSubmitUtilService] data.constructor.name: ' + data.constructor.name);
					console.log('[rpSubmitUtilService] data: ' + JSON.stringify(data));

					if (data.responseError) {
						callback(data, null);
					} else {
						console.log('[rpSubmitUtilService] data: ' + JSON.stringify(data));
						callback(null, data);
					}

				});

			} else {
				rpToastUtilService("You've got to log in to submit links.");
			}
		};


	}
]);

rpUtilServices.factory('rpShareEmailUtilService', ['rpShareEmailResourceService', 'rpToastUtilService',
	function(rpShareEmailResourceService, rpToastUtilService) {

		return function(to, text, subject, callback) {

			rpShareEmailResourceService.save({
				to: to,
				text: text,
				subject: subject
			}, function(data) {
				if (data.responseError) {
					rpToastUtilService("Something went wrong trying to send your email :/");
					callback(data, null);
				} else {
					console.log('[rpShareEmailUtilService] data: ' + data);
					rpToastUtilService("Email Sent :)");
					callback(null, data);
				}
			});

		};

	}
]);

rpUtilServices.factory('rpCaptchaUtilService', ['rpAuthUtilService', 'rpToastUtilService',
	'rpNeedsCaptchaResourceService', 'rpNewCaptchaResourceService', 'rpCaptchaResourceService',
	function(rpAuthUtilService, rpToastUtilService, rpNeedsCaptchaResourceService, rpNewCaptchaResourceService, rpCaptchaResourceService) {

		var rpCaptchaUtilService = {};

		rpCaptchaUtilService.needsCaptcha = function(callback) {

			rpNeedsCaptchaResourceService.get(function(data) {
				console.log('[rpCaptchaUtilService] needsCaptcha, data: ' + JSON.stringify(data));
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};

		rpCaptchaUtilService.newCaptcha = function(callback) {

			rpNewCaptchaResourceService.save(function(data) {
				console.log('[rpCaptchaUtilService] newCaptcha, data: ' + JSON.stringify(data));
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};

		/* This is not used anywhere */
		rpCaptchaUtilService.captcha = function(iden, callback) {

			rpCaptchaResourceService.get({
				iden: iden
			}, function(data) {
				// console.log('[rpCaptchaUtilService] captcha, data: ' + JSON.stringify(data));

				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}

			});

		};

		return rpCaptchaUtilService;

	}
]);

rpUtilServices.factory('rpSubredditsUtilService', [
	'$rootScope',
	'rpSubredditsResourceService',
	'rpSubredditsMineResourceService',
	'rpSubbscribeResourceService',
	'rpSubredditAboutResourceService',
	'rpAuthUtilService',
	'rpToastUtilService',
	'rpSnoocoreService',

	function(
		$rootScope,
		rpSubredditsResourceService,
		rpSubredditsMineResourceService,
		rpSubbscribeResourceService,
		rpSubredditAboutResourceService,
		rpAuthUtilService,
		rpToastUtilService,
		rpSnoocoreService

	) {

		var rpSubredditsUtilService = {};

		rpSubredditsUtilService.subs = [];
		rpSubredditsUtilService.currentSub = "";
		rpSubredditsUtilService.about = {};
		rpSubredditsUtilService.subscribed = null;

		var limit = 100;

		rpSubredditsUtilService.updateSubreddits = function(callback) {
			console.log('[rpSubredditsUtilService] updateSubreddits(), rpAuthUtilService.isAuthenticated: ' + rpAuthUtilService.isAuthenticated);

			if (rpAuthUtilService.isAuthenticated) {
				loadUserSubreddits(callback);
			} else {
				loadDefaultSubreddits(callback);
			}

		};

		rpSubredditsUtilService.updateSubreddits(function() {
			//subscribe user to r/reddupco
			if (rpAuthUtilService.isAuthenticated) {

				var subbed = false;
				var reddupcoName = 't5_3cawe';

				for (var i = 0; i < rpSubredditsUtilService.subs.length; i++) {
					if (rpSubredditsUtilService.subs[i].data.name === reddupcoName) {
						subbed = true;
					}

				}

				if (!subbed) {
					rpSubredditsUtilService.subscribe('sub', reddupcoName, function() {
						console.log('[rpSubredditsUtilService] subscribed user to r/reddupco');
					});
				}
			}


		});

		rpSubredditsUtilService.resetSubreddit = function() {
			rpSubredditsUtilService.currentSub = "";
			rpSubredditsUtilService.subscribed = null;
			rpSubredditsUtilService.about = {};
		};

		rpSubredditsUtilService.setSubreddit = function(sub) {
			console.log('[rpSubredditsUtilService] setSubreddit, sub: ' + sub);

			if (sub && rpSubredditsUtilService.currentSub !== sub) {

				rpSubredditsUtilService.currentSub = sub;
				updateSubscriptionStatus();
				loadSubredditAbout();

			}
		};


		function loadUserSubreddits(callback) {
			console.log('[rpSubredditsUtilService] loadUserSubreddits()');

			loadUserSubredditsClientRequest(function(err, data) {
				if (err) {
					console.log('[rpSubredditsUtilService] loadUserSubreddits(), client request unsuccessful');
					loadUserSubredditsServerRequest(function(err, data) {
						if (err) {
							console.log('[rpSubredditsUtilService] loadUserSubreddits(), server request unsuccessful');
							callback(err, null);
						} else {
							console.log('[rpSubredditsUtilService] loadUserSubreddits(), server request successful');
							callback(data);
						}
					});
				} else {
					console.log('[rpSubredditsUtilService] loadUserSubreddits(), client request successful');
					callback(data);
				}
			});

			function loadUserSubredditsClientRequest(callback) {
				console.log('[rpSubredditsUtilService] loadUserSubredditsClientRequest()');

				rpSnoocoreService.redditRequest('listing', '/subreddits/mine/$where', {
					$where: 'subscriber',
					limit: limit,
					after: ""

				}, function(data) {

					if (data.responseError) {
						console.log('[rpSubredditsUtilService] loadUserSubredditsClientRequest(), ResponseError');
						rpToastUtilService("Something went wrong updating your subreddits.");
						callback(data, null);

					} else {
						console.log('[rpSubredditsUtilService] loadUserSubredditsClientRequest(), client request, data.get.data.children.length: ' + data.get.data.children.length);
						console.log('[rpSubredditsUtilService] loadUserSubredditsClientRequest(), client request, data.allChildren.length: ' + data.allChildren.length);

						if (data.get.data.children.length > 0) {

							rpSubredditsUtilService.subs = data.get.data.children;

							/*
							we have all the subreddits, no need to get more.
							*/
							if (data.get.data.children.length < limit) {
								$rootScope.$emit('subreddits_updated');
								updateSubscriptionStatus();
								callback(null, data);

							} else { //dont have all the subreddits yet, get more.
								loadMoreUserSubreddits(data.get.data.children[data.get.data.children.length - 1].data.name, callback);

							}

							/*
							no subreddits returned. load deafult subs.
							*/
						} else { //If the user has no subreddits load the default subs.
							loadDefaultSubreddits(callback);
						}

					}

				});
			}

			function loadUserSubredditsServerRequest(callback) {
				console.log('[rpSubredditsUtilService] loadUserSubredditsServerRequest()');
				rpSubredditsMineResourceService.get({
					limit: limit,
				}, function(data) {

					if (data.responseError) {
						console.log('[rpSubredditsUtilService] loadUserSubredditsServerRequest(), ResponseError');
						rpToastUtilService("Something went wrong updating your subreddits.");
						callback(data, null);

					} else {
						console.log('[rpSubredditsUtilService] loadUserSubredditsServerRequest(), data.get.data.children.length: ' + data.get.data.children.length);
						// console.log('[rpSubredditsUtilService] loadUserSubredditsServerRequest(), data.allChildren.length: ' + data.allChildren.length);

						if (data.get.data.children.length > 0) {
							rpSubredditsUtilService.subs = data.get.data.children;

							/*
							we have all the subreddits, no need to get more.
							*/
							if (data.get.data.children.length < limit) {
								$rootScope.$emit('subreddits_updated');
								updateSubscriptionStatus();
								callback(null, data);

							} else { //dont have all the subreddits yet, get more.
								loadMoreUserSubreddits(data.get.data.children[data.get.data.children.length - 1].data.name, callback);

							}

							/*
							no subreddits returned. load deafult subs.
							*/
						} else { //If the user has no subreddits load the default subs.
							loadDefaultSubreddits(callback);
						}

					}

				});
			}
		}

		function loadMoreUserSubreddits(after, callback) {
			console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), after: ' + after);

			loadMoreUserSubredditsClientRequest(function(err, data) {
				if (err) {
					console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), client request unsuccessful');
					loadMoreUserSubredditsServerRequest(function(err, data) {
						if (err) {
							console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), server request unsuccessful');
							callback(err, null);
						} else {
							console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), server request successful');
							callback(null, data);
						}
					});
				} else {
					console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), client request successful');
					callback(null, data);
				}
			});

			function loadMoreUserSubredditsClientRequest(callback) {
				console.log('[rpSubredditsUtilService] loadMoreUserSubredditsClientRequest(), after: ' + after);

				rpSnoocoreService.redditRequest('listing', '/subreddits/mine/$where', {
					$where: 'subscriber',
					after: after,
					limit: limit
				}, function(data) {
					if (data.responseError) {
						console.log('[rpSubredditsUtilService] loadMoreUserSubredditsClientRequest() ResponseError');
						rpToastUtilService("Something went wrong updating your subreddits.");
						callback(data, null);

					} else {
						console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), data.get.data.children.length: ' + data.get.data.children.length);

						/*
							add the subreddits instead of replacing.
						 */
						rpSubredditsUtilService.subs = rpSubredditsUtilService.subs.concat(data.get.data.children);

						/*
							end case.
							we have all the subreddit.
						 */
						if (data.get.data.children.length < limit) {
							$rootScope.$emit('subreddits_updated');
							updateSubscriptionStatus();
							callback(null, data);

						} else { //dont have all the subreddits yet. recurse to get more.
							loadMoreUserSubreddits(data.get.data.children[data.get.data.children.length - 1].data.name, callback);

						}

					}
				});
			}

			function loadMoreUserSubredditsServerRequest(callback) {
				console.log('[rpSubredditsUtilService] loadMoreUserSubredditsServerRequest(), after: ' + after);
				rpSubredditsMineResourceService.get({
					limit: limit,
					after: after

				}, function(data) {
					if (data.responseError) {
						console.log('[rpSubredditsUtilService] loadMoreUserSubredditsServerRequest() ResponseError');
						rpToastUtilService("Something went wrong updating your subreddits.");
						callback(data, null);

					} else {
						console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), data.get.data.children.length: ' + data.get.data.children.length + ', limit: ' + limit);

						/*
						add the subreddits instead of replacing.
						*/
						rpSubredditsUtilService.subs = rpSubredditsUtilService.subs.concat(data.get.data.children);
						// rpSubredditsUtilService.subs = rpSubredditsUtilService.subs.push(data.get.data.children);

						/*
						end case.
						we have all the subreddit.
						*/
						if (data.get.data.children.length < limit) {
							$rootScope.$emit('subreddits_updated');
							updateSubscriptionStatus();
							callback(null, data);

						} else { //dont have all the subreddits yet. recurse to get more.
							console.log('[rpSubredditsUtilService] loadMoreUserSubreddits() calling loadMoreUserSubreddits');
							loadMoreUserSubreddits(data.get.data.children[data.get.data.children.length - 1].data.name, callback);


						}

					}
				});

			}
		}


		function loadDefaultSubreddits(callback) {
			console.log('[rpSubredditsUtilService] loadDefaultSubreddits()');

			loadDefaultSubredditsClientRequest(function(err, data) {
				if (err) {
					console.log('[rpSubredditsUtilService]] loadDefaultSubreddits() client request unsuccessful');
					loadDefaultSubredditsServerRequest(function(err, data) {
						if (err) {
							console.log('[rpSubredditsUtilService]] loadDefaultSubreddits() server request unsuccessful');

						} else {
							console.log('[rpSubredditsUtilService]] loadDefaultSubreddits() server request successful');
							callback(null, data);
						}
					});

				} else {
					console.log('[rpSubredditsUtilService]] loadDefaultSubreddits() client request successful');
					callback(null, data);
				}
			});


			function loadDefaultSubredditsClientRequest(callback) {
				console.log('[rpSubredditsUtilService] loadDefaultSubredditsClientRequest()');
				rpSnoocoreService.redditRequest('listing', '/subreddits/$where', {
					$where: 'default',
					limit: limit
				}, function(data) {
					if (data.responseError) {
						console.log('[rpSubredditsUtilService] err');
						rpToastUtilService("Something went wrong updating your subreddits.");
						callback(data, null);
					} else {
						console.log('[rpSubredditsUtilService] loadDefaultSubreddits(), data.get.data.children.length: ' +
							data.get.data.children.length);

						rpSubredditsUtilService.subs = data.get.data.children;
						$rootScope.$emit('subreddits_updated');
						updateSubscriptionStatus();
						callback(null, data);
					}

				});

			}

			function loadDefaultSubredditsServerRequest(callback) {
				console.log('[rpSubredditsUtilService] loadDefaultSubredditsServerRequest()');
				rpSubredditsResourceService.get({
					limit: limit
				}, function(data) {

					if (data.responseError) {
						rpToastUtilService("Something went wrong updating your subreddits.");
						callback(data, null);
					} else {

						console.log('[rpSubredditsUtilService] loadDefaultSubreddits(), data.get.data.children.length: ' +
							data.get.data.children.length);

						rpSubredditsUtilService.subs = data.get.data.children;
						$rootScope.$emit('subreddits_updated');
						updateSubscriptionStatus();
						callback(null, data);
					}
				});

			}


		}

		rpSubredditsUtilService.subscribeCurrent = function(callback) {
			console.log('[rpSubredditsUtilService] subscribeCurrent(), currentSub: ' + rpSubredditsUtilService.currentSub);

			var action = rpSubredditsUtilService.subscribed ? 'unsub' : 'sub';

			rpSubbscribeResourceService.save({
				action: action,
				sr: rpSubredditsUtilService.about.data.name
			}, function(data) {

				if (data.responseError) {
					console.log('[rpSubredditsUtilService] err');
					callback(data, null);
				} else {

					rpSubredditsUtilService.updateSubreddits(function(err, data) {
						if (err) {
							console.log('[rpSubredditsUtilService] err');
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

		rpSubredditsUtilService.subscribe = function(action, name, callback) {
			console.log('[rpSubredditsUtilService], subscribe(), action: ' + action + ", name: " + name);

			if (rpAuthUtilService.isAuthenticated) {

				rpSubbscribeResourceService.save({
					action: action,
					sr: name
				}, function(data) {

					if (data.responseError) {
						console.log('[rpSubredditsUtilService] err');

					} else {
						rpSubredditsUtilService.updateSubreddits(function(err, data) {
							if (err) {
								console.log('[rpSubredditsUtilService] err');
								callback(data, null);
							} else {
								callback(null, data);
							}
						});

					}

				});

			} else {
				rpToastUtilService("You've got to log in to subscribed to subreddits");

			}

		};

		rpSubredditsUtilService.isSubscribed = function(sub) {
			console.log('[rpSubredditsUtilService] isSubscribed(), sub: ' + sub);
			return isSubscribed(sub);
		};

		function isSubscribed(sub) {

			if (typeof sub === 'undefined') {
				sub = rpSubredditsUtilService.currentSub;
			}

			console.log('[rpSubredditsUtilService] isSubscribed, rpSubredditsUtilService.subs.length: ' + rpSubredditsUtilService.subs.length);
			if (rpSubredditsUtilService.subs.length > 0 && sub !== "") {

				for (var i = 0; i < rpSubredditsUtilService.subs.length; i++) {

					if (rpSubredditsUtilService.subs[i].data.display_name.toLowerCase() === sub.toLowerCase()) {
						console.log('[rpSubredditsUtilService] isSubscribed(), true');
						return true;
					}
				}

				console.log('[rpSubredditsUtilService] isSubscribed(), false');
				return false;

			} else {

				console.log('[rpSubredditsUtilService] isSubscribed(), returning null, rpSubredditsUtilService.subs.length: ' +
					rpSubredditsUtilService.subs.length + ", sub: " + sub);

				return null;

			}
		}

		function updateSubscriptionStatus() {

			console.log('[rpSubredditsUtilService] updateSubscriptionStatus(), ' + rpSubredditsUtilService.subs.length + ", " + rpSubredditsUtilService.currentSub);

			var prevSubStatus = rpSubredditsUtilService.subscribed;
			rpSubredditsUtilService.subscribed = isSubscribed();


			if (rpSubredditsUtilService.subscribed !== prevSubStatus) {
				console.log('[rpSubredditsUtilService] updateSubscriptionStatus(), subscription status changed, emit subscription_status_changed, rpSubredditsUtilService.subscribed: ' + rpSubredditsUtilService.subscribed);
				$rootScope.$emit('subscription_status_changed', rpSubredditsUtilService.subscribed);
			}

		}

		function loadSubredditAbout() {
			// console.log('[rpSubredditsUtilService] loadSubredditAbout()');

			rpSubredditAboutResourceService.get({
				sub: rpSubredditsUtilService.currentSub
			}, function(data) {

				if (data.responseError) {
					// console.log('[rpSubredditsUtilService] loadSubredditsAbout(), err');

				} else {
					// console.log('[rpSubredditsUtilService] loadSubredditsAbout, data.data.name: ' + data.data.name);
					rpSubredditsUtilService.about = data;
					$rootScope.$emit('subreddits_about_updated');
				}

			});

		}

		return rpSubredditsUtilService;

	}

]);

rpUtilServices.factory('rpPostsUtilService', [
	'$rootScope',
	'rpPostsResourceService',
	'rpFrontpageResourceService',
	'rpToastUtilService',
	'rpLocationUtilService',
	'rpSnoocoreService',

	function(
		$rootScope,
		rpPostsResourceService,
		rpFrontpageResourceService,
		rpToastUtilService,
		rpLocationUtilService,
		rpSnoocoreService

	) {

		return function(sub, sort, after, t, limit, callback) {

			clientRequest(function(err, data) {
				if (err) {
					console.log('[rpPostsUtilService] error performing client request.');
					serverRequest(function(err, data) {
						if (err) {
							console.log('[rpPostsUtilService] error performing server request');
							callback(err);
						} else {
							console.log('[rpPostsUtilService] sucessfully performed server request');
							callback(null, data);
						}
					});
				} else {
					console.log('[rpPostsUtilService] sucessfully performed client request');
					callback(null, data);
				}
			});


			function clientRequest(callback) {
				console.log('[rpPostsUtilService] client request posts.');

				if (sub) {

					rpSnoocoreService.redditRequest('listing', 'r/$subreddit/$sort', {
						$subreddit: sub,
						t: t,
						limit: limit,
						after: after,
						$sort: sort
					}, function(data) {

						console.log('[rpPostsUtilService] data: ' + data);

						if (data.responseError) {

							/*
								Random.
								Redirect to new sub
							 */

							console.log('[rpPostsUtilService] error data: ' + JSON.stringify(data));

							if (data.status === 302) {

								var randomSubRe = /https:\/\/oauth\.reddit\.com\/r\/([\w]+)*/i;
								var groups = randomSubRe.exec(data.body);

								if (groups[1]) {
									rpLocationUtilService(null, '/r/' + groups[1], '', true, true);

								}

							} else {
								rpToastUtilService("Something went wrong retrieving posts :/");
								rpLocationUtilService(null, '/error/' + data.status, '', true, true);
								callback(data, null);
							}

						} else {
							callback(null, data);

						}

					});

				} else {

					rpSnoocoreService.redditRequest('listing', '/$sort', {
						$sort: sort,
						after: after,
						limit: limit,
						t: t
					}, function(data) {

						if (data.responseError) {
							rpToastUtilService("Something went wrong retrieving posts :/");
							rpLocationUtilService(null, '/error/' + data.status, '', true, true);

							callback(data, null);

						} else {
							callback(null, data);

						}
					});

				}
			}


			function serverRequest(callback) {
				console.log('[rpPostsUtilService] server request posts.');

				if (sub) {

					rpPostsResourceService.get({
						sub: sub,
						sort: sort,
						after: after,
						t: t,
						limit: limit
					}, function(data) {

						console.log('[rpPostsUtilService] data: ' + data);

						if (data.responseError) {

							/*
							Random.
							Redirect to new sub
							*/

							console.log('[rpPostsUtilService] error data: ' + JSON.stringify(data));

							if (data.status === 302) {

								var randomSubRe = /https:\/\/oauth\.reddit\.com\/r\/([\w]+)*/i;
								var groups = randomSubRe.exec(data.body);

								if (groups[1]) {
									rpLocationUtilService(null, '/r/' + groups[1], '', true, true);

								}

							} else {
								rpToastUtilService("Something went wrong retrieving posts :/");
								rpLocationUtilService(null, '/error/' + data.status, '', true, true);
								callback(data, null);
							}

						} else {
							callback(null, data);

						}

					});

				} else {

					rpFrontpageResourceService.get({
						sort: sort,
						after: after,
						t: t,
						limit: limit
					}, function(data) {

						if (data.responseError) {
							rpToastUtilService("Something went wrong retrieving posts :/");
							rpLocationUtilService(null, '/error/' + data.status, '', true, true);

							callback(data, null);

						} else {
							callback(null, data);

						}
					});

				}

			}


		};

	}
]);

rpUtilServices.factory('rpMessageUtilService', ['rpMessageResourceService', 'rpToastUtilService',
	function(rpMessageResourceService, rpToastUtilService) {

		return function(where, after, limit, callback) {
			console.log('[rpMessageUtilService] request messages.');

			rpMessageResourceService.get({

				where: where,
				after: after,
				limit: limit

			}, function(data) {

				if (data.responseError) {
					rpToastUtilService("Something went wrong retrieving your messages :/");
					callback(data, null);
				} else {
					callback(null, data);
				}

			});

		};
	}
]);

rpUtilServices.factory('rpCommentsUtilService', ['rpCommentsResourceService',
	function(rpCommentsResourceService) {
		return function(subreddit, article, sort, comment, context, callback) {
			console.log('[rpCommentsUtilService] request comments');

			rpCommentsResourceService.get({
				subreddit: subreddit,
				article: article,
				sort: sort,
				comment: comment,
				context: context
			}, function(data) {

				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}

			});

		};
	}
]);

rpUtilServices.factory('rpMoreChildrenUtilService', ['rpMoreChildrenResourceService',
	function(rpMoreChildrenResourceService) {
		return function(sort, link_id, children, callback) {
			console.log('[rpMoreChildrenUtilService] request more children');

			rpMoreChildrenResourceService.get({
				sort: sort,
				link_id: link_id,
				children: children
			}, function(data) {

				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}

			});

		};
	}
]);



rpUtilServices.factory('rpUserUtilService', ['rpUserResourceService', 'rpToastUtilService',
	function(rpUserResourceService, rpToastUtilService) {
		return function(username, where, sort, after, t, limit, callback) {
			console.log('[rpUserUtilService] request user');

			rpUserResourceService.get({
				username: username,
				where: where,
				sort: sort,
				after: after,
				t: t,
				limit: limit

			}, function(data) {
				if (data.responseError) {
					rpToastUtilService("Something went wrong retrieving the user's posts :/");
					callback(data, null);
				} else {
					callback(null, data);
				}
			});

		};
	}
]);

rpUtilServices.factory('rpByIdUtilService', ['rpByIdResourceService',
	function(rpByIdResourceService) {
		return function(name, callback) {
			rpByIdResourceService.get({
				name: name
			}, function(data) {
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};
	}
]);

rpUtilServices.factory('rpReadAllMessagesUtilService', ['$timeout', 'rpReadAllMessagesResourceService',
	function($timeout, rpReadAllMessagesResourceService) {
		return function(callback) {

			var retryAttempts = 9;
			var wait = 2000;

			attemptReadAllMessages();

			function attemptReadAllMessages() {

				if (retryAttempts > 0) {

					$timeout(rpReadAllMessagesResourceService.save({}, function(data) {
						if (data.responseError) {
							retryAttempts -= 1;
							attemptReadAllMessages();
							callback(data, null);
						} else {
							retryAttempts = 3;
							callback(null, data);
						}
					}), wait * 10 - retryAttempts);


				}


			}

		};
	}
]);

rpUtilServices.factory('rpReadMessageUtilService', ['rpReadMessageResourceService',
	function(rpReadMessageResourceService) {
		return function(message, callback) {

			rpReadMessageResourceService.save({
				message: message
			}, function(data) {
				if (data.responseError) {
					console.log('[rpReadMessageUtilService] err');
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};

	}
]);

rpUtilServices.factory('rpToolbarShadowUtilService', ['$rootScope',
	function($rootScope) {

		var rpToolbarShadowUtilService = {};

		rpToolbarShadowUtilService.showToolbarShadow = false;

		rpToolbarShadowUtilService.show = function() {
			console.log('[rpToolbarShadowUtilService] show()');
			rpToolbarShadowUtilService.showToolbarShadow = true;
			$rootScope.$broadcast('show_toolbar_shadow_change');
		};

		rpToolbarShadowUtilService.hide = function() {
			console.log('[rpToolbarShadowUtilService] hide()');
			rpToolbarShadowUtilService.showToolbarShadow = false;
			$rootScope.$broadcast('show_toolbar_shadow_change');
		};

		return rpToolbarShadowUtilService;
	}

]);