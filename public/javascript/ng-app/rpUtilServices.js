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
			settingsDialog: true

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
			$rootScope.$emit('search_form_visibility');
		};

		rpSearchFormUtilService.hide = function() {
			rpSearchFormUtilService.isVisible = false;
			$rootScope.$emit('search_form_visibility');
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

rpUtilServices.factory('rpUserTabsUtilService', ['$rootScope',
	function($rootScope) {

		var rpUserTabsUtilService = {};
		rpUserTabsUtilService.tab = "";

		rpUserTabsUtilService.setTab = function(tab) {
			console.log('[rpUserTabsUtilService] setTab(), tab: ' + tab);

			rpUserTabsUtilService.tab = tab;
			$rootScope.$emit('user_tab_change');

		};

		return rpUserTabsUtilService;

	}
]);

rpUtilServices.factory('rpArticleTabsUtilService', ['$rootScope',
	function($rootScope) {

		var rpArticleTabsUtilService = {};
		rpArticleTabsUtilService.tab = "";

		rpArticleTabsUtilService.setTab = function(tab) {

			rpArticleTabsUtilService.tab = tab;
			$rootScope.$emit('article_tab_change');

		};

		return rpArticleTabsUtilService;

	}
]);

rpUtilServices.factory('rpPostsTabsUtilService', ['$rootScope',
	function($rootScope) {

		var rpPostsTabsUtilService = {};
		rpPostsTabsUtilService.tab = "";

		rpPostsTabsUtilService.setTab = function(tab) {
			console.log('[rpPostsTasbUtilService] setTab() tab: ' + tab);

			rpPostsTabsUtilService.tab = tab;
			$rootScope.$emit('posts_tab_change');

		};

		return rpPostsTabsUtilService;

	}
]);

rpUtilServices.factory('rpSearchTabsUtilService', ['$rootScope',
	function($rootScope) {

		var rpSearchTabsUtilService = {};
		rpSearchTabsUtilService.tab = "";

		rpSearchTabsUtilService.setTab = function(tab) {
			console.log('[rpSearchTasbUtilService] setTab() tab: ' + tab);

			rpSearchTabsUtilService.tab = tab;
			$rootScope.$emit('search_tab_change');

		};

		return rpSearchTabsUtilService;

	}
]);

rpUtilServices.factory('rpMessageTabsUtilService', ['$rootScope',
	function($rootScope) {

		var rpMessageTabsUtilService = {};
		rpMessageTabsUtilService.tab = "";

		rpMessageTabsUtilService.setTab = function(tab) {
			console.log('[rpMessageTabsUtilService] tab: ' + tab);

			rpMessageTabsUtilService.tab = tab;
			$rootScope.$emit('message_tab_change');
		};

		return rpMessageTabsUtilService;

	}
]);


rpUtilServices.factory('rpIdentityUtilService', ['rpIdentityResourceService', 'rpAuthUtilService',
	function(rpIdentityResourceService, rpAuthUtilService) {

		var rpIdentityUtilService = {};

		rpIdentityUtilService.identity = null;

		rpIdentityUtilService.reloadIdentity = function(callback) {

			rpIdentityUtilService.identity = null;

			rpIdentityUtilService.getIdentity(callback);

		};

		rpIdentityUtilService.getIdentity = function(callback) {
			console.log('[rpIdentityResourceService] getIdentity()');

			if (rpAuthUtilService.isAuthenticated) {

				if (rpIdentityUtilService.identity !== null) {
					console.log('[rpIdentityResourceService] getIdentity(), have identity');
					callback(rpIdentityUtilService.identity);

				} else {

					console.log('[rpIdentityResourceService] getIdentity(), requesting identity');

					rpIdentityResourceService.get(function(data) {

						rpIdentityUtilService.identity = data;
						callback(rpIdentityUtilService.identity);

					});

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
				hideDelay: 2000,
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

rpUtilServices.factory('rpEditUtilService', ['rpAuthUtilService', 'rpEditResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpEditResourceService, rpToastUtilService) {
		return function(text, thing_id, callback) {
			console.log('[rpEditUtilService]');

			if (rpAuthUtilService.isAuthenticated) {
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
			}

		};
	}
]);

rpUtilServices.factory('rpDeleteUtilService', ['rpAuthUtilService', 'rpDeleteResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpDeleteResourceService, rpToastUtilService) {

		return function(name, callback) {
			console.log('[rpDeleteUtilService] name: ' + name);

			if (rpAuthUtilService.isAuthenticated) {
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
			}
		};

	}
]);

rpUtilServices.factory('rpSaveUtilService', ['rpAuthUtilService', 'rpSaveResourceService', 'rpUnsaveResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpSaveResourceService, rpUnsaveResourceService, rpToastUtilService) {

		return function(post, callback) {

			if (rpAuthUtilService.isAuthenticated) {
				if (post.data.saved) {
					post.data.saved = false;
					rpUnsaveResourceService.save({
						id: post.data.name
					}, function(data) {

						if (data.responseError) {
							callback(data, null);
						} else {
							callback(null, data);
						}

					});
				} else {
					post.data.saved = true;
					rpSaveResourceService.save({
						id: post.data.name
					}, function(data) {

						if (data.responseError) {
							callback(data, null);
						} else {
							callback(null, data);
						}

					});
				}
			} else {
				rpToastUtilService("You've got to log in to save posts");
			}

		};

	}
]);

rpUtilServices.factory('rpUpvoteUtilService', ['rpAuthUtilService', 'rpVoteResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpVoteResourceService, rpToastUtilService) {

		return function(post, callback) {
			if (rpAuthUtilService.isAuthenticated) {
				var dir = post.data.likes ? 0 : 1;
				var origLikes = post.data.likes;
				var origScore = post.data.score;

				if (post.data.likes === false) {
					post.data.score = post.data.score + 2;
				} else if (post.data.likes === true) {
					post.data.score = post.data.score - 1;
				} else {
					post.data.score = post.data.score + 1;
				}

				if (dir == 1) {
					post.data.likes = true;
				} else {
					post.data.likes = null;
				}

				rpVoteResourceService.save({
					id: post.data.name,
					dir: dir
				}, function(data) {

					if (data.responseError) {
						callback(data, null);

						post.data.score = origScore;
						post.data.likes = origLikes;


					} else {
						callback(null, data);
					}

				});
			} else {
				rpToastUtilService("You've got to log in to vote");
			}
		};

	}
]);

rpUtilServices.factory('rpDownvoteUtilService', ['rpAuthUtilService', 'rpVoteResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpVoteResourceService, rpToastUtilService) {

		return function(post, callback) {

			if (rpAuthUtilService.isAuthenticated) {

				var dir;
				var origLikes = post.data.likes;
				var origScore = post.data.score;

				if (post.data.likes === false) {
					dir = 0;
					post.data.score = post.data.score + 1;
				} else if (post.data.likes === true) {
					post.data.score = post.data.score - 2;
					dir = -1;
				} else {
					dir = -1;
					post.data.score = post.data.score - 1;
				}

				if (dir == -1) {
					post.data.likes = false;
				} else {
					post.data.likes = null;
				}

				rpVoteResourceService.save({
					id: post.data.name,
					dir: dir
				}, function(data) {

					if (data.responseError) {
						callback(data, null);
						post.data.score = origScore;
						post.data.likes = origLikes;

					} else {
						callback(null, data);
					}

				});

			} else {

				rpToastUtilService("You've got to log in to vote");

			}
		};

	}
]);

rpUtilServices.factory('rpCommentUtilService', ['rpAuthUtilService', 'rpCommentResourceService', 'rpToastUtilService',
	function(rpAuthUtilService, rpCommentResourceService, rpToastUtilService) {

		//to safegaurd against double tapping enter 
		//and posting the comment twice
		var replying = false;

		//Use replyingName to reset raplying to false
		//if we are replying to a new comment,
		//(if attempt to reply does not return from server replying stays false;)
		var replyingName;

		return function(name, comment, callback) {
			console.log('[rpCommentUtilService]');

			if (replyingName === "") {
				replyingName = name;
			} else if (replyingName !== name) {
				replyingName = name;
				replying = false;
			}

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
	
	function(
		$rootScope,
		rpSubredditsResourceService,
		rpSubredditsMineResourceService,
		rpSubbscribeResourceService,
		rpSubredditAboutResourceService,
		rpAuthUtilService,
		rpToastUtilService

	) {

		var rpSubredditsUtilService = {};

		rpSubredditsUtilService.subs = {};
		rpSubredditsUtilService.currentSub = "";
		rpSubredditsUtilService.about = {};
		rpSubredditsUtilService.subscribed = null;

		var limit = 100;

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

		rpSubredditsUtilService.updateSubreddits = function(callback) {
			console.log('[rpSubredditsUtilService] updateSubreddits(), rpAuthUtilService.isAuthenticated: ' + rpAuthUtilService.isAuthenticated);

			if (rpAuthUtilService.isAuthenticated) {
				loadUserSubreddits(callback);
			} else {
				loadDefaultSubreddits(callback);
			}

		};

		function loadUserSubreddits(callback) {
			console.log('[rpSubredditsUtilService] loadUserSubreddits()');

			rpSubredditsMineResourceService.get({
				limit: limit,
			}, function(data) {

				if (data.responseError) {
					rpToastUtilService("Something went wrong updating your subreddits.");
					callback(data, null);

				} else {
					console.log('[rpSubredditsUtilService] loadUserSubreddits(), data.get.data.children.length: ' + data.get.data.children.length);
					console.log('[rpSubredditsUtilService] loadUserSubreddits(), data.allChildren.length: ' + data.allChildren.length);

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

		function loadMoreUserSubreddits(after, callback) {
			console.log('[rpSubredditsUtilService] loadMoreUserSubreddits(), after: ' + after);

			rpSubredditsMineResourceService.get({
				limit: limit,
				after: after

			}, function(data) {
				if (data.responseError) {
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

		function loadDefaultSubreddits(callback) {
			console.log('[rpSubredditsUtilService] loadDefaultSubreddits()');

			rpSubredditsResourceService.get({
				limit: limit
			}, function(data) {
				console.log('[rpSubredditsUtilService] loadDefaultSubreddits(), data.get.data.children.length: ' + data.get.data.children.length);

				if (data.responseError) {
					rpToastUtilService("Something went wrong updating your subreddits.");
					callback(data, null);
				} else {
					rpSubredditsUtilService.subs = data.get.data.children;
					$rootScope.$emit('subreddits_updated');
					updateSubscriptionStatus();
					callback(null, data);
				}
			});

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
			console.log('[rpSubredditsUtilService] loadSubredditAbout()');

			rpSubredditAboutResourceService.get({
				sub: rpSubredditsUtilService.currentSub
			}, function(data) {

				if (data.responseError) {
					console.log('[rpSubredditsUtilService] loadSubredditsAbout(), err');

				} else {
					console.log('[rpSubredditsUtilService] loadSubredditsAbout, data.data.name: ' + data.data.name);
					console.log('[rpSubredditsUtilService] loadSubredditsAbout, data: ' + JSON.stringify(data));
					rpSubredditsUtilService.about = data;
					$rootScope.$emit('subreddits_about_updated');
				}
			
			});
			
		}

		return rpSubredditsUtilService;

	}

]);

rpUtilServices.factory('rpPostsUtilService', ['$rootScope', 'rpPostsResourceService', 'rpFrontpageResourceService', 'rpToastUtilService', 'rpLocationUtilService',
	function($rootScope, rpPostsResourceService, rpFrontpageResourceService, rpToastUtilService, rpLocationUtilService) {

		return function(sub, sort, after, t, limit, callback) {

			console.log('[rpPostsUtilService] request posts.');

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
							// callback(data, null);	
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

						// callback(data, null);

					} else {
						callback(null, data);

					}
				});

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

rpUtilServices.factory('rpReadAllMessagesUtilService', ['rpReadAllMessagesResourceService',
	function(rpReadAllMessagesResourceService) {
		return function(callback) {
			rpReadAllMessagesResourceService.save({}, function(data) {
				if (data.responseError) {
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

// Utility service for preloading image objects.
rpUtilServices.factory("rpImgurPreloaderUtilService",

	function($q, $rootScope) {
		// I manage the preloading of image objects. Accepts an array of image URLs.
		function Preloader(imageLocations) {
			// I am the image SRC values to preload.
			this.imageLocations = imageLocations;
			// As the images load, we'll need to keep track of the load/error
			// counts when announing the progress on the loading.
			this.imageCount = this.imageLocations.length;
			this.loadCount = 0;
			this.errorCount = 0;
			// I am the possible states that the preloader can be in.
			this.states = {
				PENDING: 1,
				LOADING: 2,
				RESOLVED: 3,
				REJECTED: 4
			};
			// I keep track of the current state of the preloader.
			this.state = this.states.PENDING;
			// When loading the images, a promise will be returned to indicate
			// when the loading has completed (and / or progressed).
			this.deferred = $q.defer();
			this.promise = this.deferred.promise;
		}
		// ---
		// STATIC METHODS.
		// ---
		// I reload the given images [Array] and return a promise. The promise
		// will be resolved with the array of image locations.
		Preloader.preloadImages = function(imageLocations) {
			var preloader = new Preloader(imageLocations);
			return (preloader.load());
		};
		// ---
		// INSTANCE METHODS.
		// ---
		Preloader.prototype = {
			// Best practice for "instnceof" operator.
			constructor: Preloader,
			// ---
			// PUBLIC METHODS.
			// ---
			// I determine if the preloader has started loading images yet.
			isInitiated: function isInitiated() {
				return (this.state !== this.states.PENDING);
			},
			// I determine if the preloader has failed to load all of the images.
			isRejected: function isRejected() {
				return (this.state === this.states.REJECTED);
			},
			// I determine if the preloader has successfully loaded all of the images.
			isResolved: function isResolved() {
				return (this.state === this.states.RESOLVED);
			},
			// I initiate the preload of the images. Returns a promise.
			load: function load() {
				// If the images are already loading, return the existing promise.
				if (this.isInitiated()) {
					return (this.promise);
				}
				this.state = this.states.LOADING;
				for (var i = 0; i < this.imageCount; i++) {
					this.loadImageLocation(this.imageLocations[i]);
				}
				// Return the deferred promise for the load event.
				return (this.promise);
			},
			// ---
			// PRIVATE METHODS.
			// ---
			// I handle the load-failure of the given image location.
			handleImageError: function handleImageError(imageLocation) {
				this.errorCount++;
				// If the preload action has already failed, ignore further action.
				if (this.isRejected()) {
					return;
				}
				this.state = this.states.REJECTED;
				this.deferred.reject(imageLocation);
			},
			// I handle the load-success of the given image location.
			handleImageLoad: function handleImageLoad(imageLocation) {
				this.loadCount++;
				// If the preload action has already failed, ignore further action.
				if (this.isRejected()) {
					return;
				}
				// Notify the progress of the overall deferred. This is different
				// than Resolving the deferred - you can call notify many times
				// before the ultimate resolution (or rejection) of the deferred.
				this.deferred.notify({
					percent: Math.ceil(this.loadCount / this.imageCount * 100),
					imageLocation: imageLocation
				});
				// If all of the images have loaded, we can resolve the deferred
				// value that we returned to the calling context.
				if (this.loadCount === this.imageCount) {
					this.state = this.states.RESOLVED;
					this.deferred.resolve(this.imageLocations);
				}
			},
			// I load the given image location and then wire the load / error
			// events back into the preloader instance.
			// --
			// NOTE: The load/error events trigger a $digest.
			loadImageLocation: function loadImageLocation(imageLocation) {
				var preloader = this;
				// When it comes to creating the image object, it is critical that
				// we bind the event handlers BEFORE we actually set the image
				// source. Failure to do so will prevent the events from proper
				// triggering in some browsers.
				var image = $(new Image())
					.load(
						function(event) {
							// Since the load event is asynchronous, we have to
							// tell AngularJS that something changed.
							$rootScope.$apply(
								function() {
									preloader.handleImageLoad(event.target.src);
									// Clean up object reference to help with the
									// garbage collection in the closure.
									preloader = image = event = null;
								}
							);
						}
					)
					.error(
						function(event) {
							// Since the load event is asynchronous, we have to
							// tell AngularJS that something changed.
							$rootScope.$apply(
								function() {
									preloader.handleImageError(event.target.src);
									// Clean up object reference to help with the
									// garbage collection in the closure.
									preloader = image = event = null;
								}
							);
						}
					)
					.prop("src", imageLocation);
			}
		};
		// Return the factory instance.
		return (Preloader);
	}
);
