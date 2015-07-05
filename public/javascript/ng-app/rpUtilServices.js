'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);

rpUtilServices.factory('rpLocationUtilService', ['$location', '$window', 
	function($location, $window) {
		return function(e, url, search, reload, replace) {

			if (e.ctrlKey) {
				$window.open(url);

			} else {

				$location.path(url, reload).search(search);

				if (replace) {
					$location.replace();
				}

			}

		};
	}
]);

rpUtilServices.factory('rpSettingsUtilService', ['$rootScope', 'rpSettingsService', 'rpToastUtilService',
	function($rootScope, rpSettingsService, rpToastUtilService) {

		var rpSettingsUtilService = {};
		
		/*
			Initial Settings, define the default settings.
		 */

		rpSettingsUtilService.settings = {
			over18: true,
			composeDialog: true,
			commentsDialog: true
			
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
			rpSettingsService.get({}, function(data) {
				console.log('[rpSettingsUtilService] retrieveSettings, data: ' + JSON.stringify(data));
				console.log('[rpSettingsUtilService] retrieveSettings, data.loadDefaults: ' + JSON.stringify(data));
				
				if (data.loadDefaults !== true) {
					console.log('[rpSettingsUtilService] retrieveSettings, using server settings');

					for (var setting in data) {
						rpSettingsUtilService.settings[setting] = data[setting];
					}
				}

				$rootScope.$emit('settings_changed');
			});
		};

		rpSettingsUtilService.saveSettings = function() {
			// console.log('[rpSettingsUtilService] saveSettings, attempting to save settings...');

			rpSettingsService.save(rpSettingsUtilService.settings, function(data) {
				console.log('[rpSettingsUtilService] saveSettings, data: ' + JSON.stringify(data));
			});

			rpToastUtilService('Setting Saved :)!');
			$rootScope.$emit('settings_changed');

		};

		return rpSettingsUtilService;

	}
]);

rpUtilServices.factory('rpSubscribeButtonUtilService', ['$rootScope', 
	function ($rootScope) {
		var rpSubscribeButtonUtilService = {};

		rpSubscribeButtonUtilService.isVisible = false;

		rpSubscribeButtonUtilService.show = function() {
			rpSubscribeButtonUtilService.isVisible = true;
			$rootScope.$emit('subscribe_visibility');
		};
		rpSubscribeButtonUtilService.hide = function() {
			rpSubscribeButtonUtilService.isVisible = false;
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

rpUtilServices.factory('rpUserTabUtilService', ['$rootScope', 
	function($rootScope){
	
		var rpUserTabUtilService = {};
		rpUserTabUtilService.tab = "";

		rpUserTabUtilService.setTab = function(tab) {

			rpUserTabUtilService.tab = tab;
			$rootScope.$emit('user_tab_change');
			
		};

		return rpUserTabUtilService;

	}
]);

rpUtilServices.factory('rpCommentsTabUtilService', ['$rootScope', 
	function($rootScope){
	
		var rpCommentsTabUtilService = {};
		rpCommentsTabUtilService.tab = "";

		rpCommentsTabUtilService.setTab = function(tab) {

			rpCommentsTabUtilService.tab = tab;
			$rootScope.$emit('comments_tab_change');
			
		};

		return rpCommentsTabUtilService;

	}
]);

rpUtilServices.factory('rpPostsTabsUtilService', ['$rootScope', 
	function($rootScope){
	
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

rpUtilServices.factory('rpMessageTabUtilService', ['$rootScope', 
	function($rootScope){
	
		var rpMessageTabUtilService = {};
		rpMessageTabUtilService.tab = "";

		rpMessageTabUtilService.setTab = function(tab) {
			console.log('[rpMessageTabUtilService] tab: ' + tab);

			rpMessageTabUtilService.tab = tab;
			$rootScope.$emit('message_tab_change');
		};

		return rpMessageTabUtilService;

	}
]);


rpUtilServices.factory('rpIdentityUtilService', ['rpIdentityService', 
	function(rpIdentityService) {

		var identity;

		return function(callback) {

			if (identity) {

				callback(identity);

			}

			else {


				rpIdentityService.query(function(data) {

					identity = data;
					callback(identity);

				});
			}
		};
	}
]);

rpUtilServices.factory('rpAuthUtilService', ['rpSettingsUtilService', 
	function(rpSettingsUtilService) {

		var rpAuthUtilService = {};
		
		rpAuthUtilService.isAuthenticated = false;

		// rpAuthUtilService.identity = {};

		rpAuthUtilService.setIdentity = function(identity) {
			rpAuthUtilService.identity = identity;
		};
		
		rpAuthUtilService.setAuthenticated = function(authenticated) {
			rpAuthUtilService.isAuthenticated = authenticated;
			rpSettingsUtilService.retrieveSettings();
		};

		return rpAuthUtilService;

	}
]);

rpUtilServices.factory('rpToastUtilService', ['$mdToast', 
	function($mdToast) {
		return function(message) {
			$mdToast.show({
				locals: {toastMessage: message},
				controller: 'rpToastCtrl',
				templateUrl: 'partials/rpToast',
				hideDelay: 2000,
				position: "top left",
			});
		};
	}
]);

rpUtilServices.factory('rpSaveUtilService', ['rpAuthUtilService', 'rpSaveService', 'rpUnsaveService', 'rpToastUtilService',
	function(rpAuthUtilService, rpSaveService, rpUnsaveService, rpToastUtilService) {
		
		return function(post) {

			if (rpAuthUtilService.isAuthenticated) {
				if (post.data.saved) {
					
					post.data.saved = false;
					rpUnsaveService.save({id: post.data.name}, function(data) { });
				} 
				else {
					post.data.saved = true;
					rpSaveService.save({id: post.data.name}, function(data) { });
				}
			} else {
				rpToastUtilService("You've got to log in to save posts");
			}			

		};

	}
]);

rpUtilServices.factory('rpUpvoteUtilService', ['rpAuthUtilService', 'rpVoteService', 'rpToastUtilService',
	function(rpAuthUtilService, rpVoteService, rpToastUtilService) {

		return function(post) {
			if (rpAuthUtilService.isAuthenticated) {
				var dir = post.data.likes ? 0 : 1;
				
				if (post.data.likes === false) {
					post.data.score = post.data.score + 2;
				} else if (post.data.likes === true) {
					post.data.score = post.data.score - 1;
				} else {
					post.data.score = post.data.score + 1;
				}

				if (dir == 1) {
					post.data.likes = true;
				}
				else {
					post.data.likes = null;
				}

				rpVoteService.save({id: post.data.name, dir: dir}, function(data) { });
			} else {
				rpToastUtilService("You've got to log in to vote");
			}
		};

	}
]);

rpUtilServices.factory('rpDownvoteUtilService', ['rpAuthUtilService', 'rpVoteService', 'rpToastUtilService',
	function(rpAuthUtilService, rpVoteService, rpToastUtilService) {

		return function(post) {
			
			if (rpAuthUtilService.isAuthenticated) {
				
				var dir;

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
				}
				else {
					post.data.likes = null;
				}
				
				rpVoteService.save({id: post.data.name, dir: dir}, function(data) { });

			} else {

				rpToastUtilService("You've got to log in to vote");

			}
		};

	}
]);

rpUtilServices.factory('rpPostCommentUtilService', ['rpAuthUtilService', 'rpCommentService', 'rpToastUtilService', 
	function(rpAuthUtilService, rpCommentService, rpToastUtilService) {
		
		var replying = false;

		return function(name, comment, callback) {
			if (rpAuthUtilService.isAuthenticated) {

				if (comment && !replying) {
					
					replying = true;

					rpCommentService.save({
						parent_id: name,
						text: comment

					}, function(data) {

						rpToastUtilService("Comment Posted :)");

						replying = false;

						callback(data);
					});
				}

			} else {
				rpToastUtilService("You've got to log in to post comments");
			}			
		};
	}	
]);

rpUtilServices.factory('rpMessageComposeUtilService', ['rpAuthUtilService', 'rpMessageComposeService', 'rpToastUtilService', 
	function(rpAuthUtilService, rpMessageComposeService, rpToastUtilService) {
		return function(subject, text, to, iden, captcha, callback) {
			if (rpAuthUtilService.isAuthenticated) {

				rpMessageComposeService.save({
					subject: subject,
					text: text,
					to: to,
					iden: iden,
					captcha: captcha
				}, function(data) {

					console.log('[rpMessageComposeUtilService] data: ' + JSON.stringify(data));

					// rpToastUtilService("Message Sent :)");
					callback(data);
				});

			} else {
				rpToastUtilService("You've got to log in send messages.");
			}
		};
	}
]);

rpUtilServices.factory('rpSubmitUtilService', ['rpAuthUtilService', 'rpSubmitService', 'rpToastUtilService',
	function(rpAuthUtilService, rpSubmitService, rpToastUtilService) {

		return function(kind, resubmit, sendreplies, sr, text, title, url, iden, captcha, callback) {
			if (rpAuthUtilService.isAuthenticated) {

				rpSubmitService.save({
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
					console.log('[rpSubmitUtilService] data: ' + JSON.stringify(data));
					callback(data);
				});

			}  else {
				rpToastUtilService("You've got to log in to submit links.");
			}
		};


	}
]);

rpUtilServices.factory('rpCaptchaUtilService', ['rpAuthUtilService', 'rpToastUtilService', 
	'rpNeedsCaptchaService', 'rpNewCaptchaService', 'rpCaptchaService', 
	function(rpAuthUtilService, rpToastUtilService, rpNeedsCaptchaService, rpNewCaptchaService, rpCaptchaService) {

		var rpCaptchaUtilService = {};

		rpCaptchaUtilService.needsCaptcha = function(callback) {

			rpNeedsCaptchaService.get({}, function(data) {
				console.log('[rpCaptchaUtilService] needsCaptcha, data: ' + JSON.stringify(data));
				callback(data);
			});

		};

		rpCaptchaUtilService.newCaptcha = function(callback) {

			rpNewCaptchaService.get(function(data) {
				console.log('[rpCaptchaUtilService] newCaptcha, data: ' + JSON.stringify(data));
				callback(data);
			});

		};

		rpCaptchaUtilService.captcha = function(iden, callback) {

			rpCaptchaService.get({iden: iden}, function(data) {
				// console.log('[rpCaptchaUtilService] captcha, data: ' + JSON.stringify(data));
				callback(data);
			});

		};

		return rpCaptchaUtilService;

	}
]);

rpUtilServices.factory('rpSubredditsUtilService', ['$rootScope', 'rpSubredditsService', 'rpSubscribeService', 'rpAboutSubredditService',
	function ($rootScope, rpSubredditsService, rpSubscribeService, rpAboutSubredditService) {
	
		var rpSubredditsUtilService = {};

		rpSubredditsUtilService.subs = {};
		rpSubredditsUtilService.currentSub = "";
		rpSubredditsUtilService.isSubscribed = null;

		rpSubredditsUtilService.setSubreddit = function(sub) {
			console.log('[rpSubredditsUtilService] setSubreddit, sub: ' + sub);

			if (sub && rpSubredditsUtilService.currentSub !== sub) {

				rpSubredditsUtilService.currentSub = sub;
				updateSubscriptionStatus();

			}
		};

		rpSubredditsUtilService.updateSubreddits = function() {

			rpSubredditsService.query(function(data) {

				rpSubredditsUtilService.subs = data;
				$rootScope.$emit('subreddits_updated');
				updateSubscriptionStatus();

			});

		};

		rpSubredditsUtilService.subscribe = function() {
			console.log('[rpSubredditsUtilService] subscribe, currentSub: ' + rpSubredditsUtilService.currentSub);

			var action = rpSubredditsUtilService.isSubscribed ? 'unsub' : 'sub';

			rpAboutSubredditService.query({sub: rpSubredditsUtilService.currentSub}, function(data) {
				console.log('[rpSubredditsUtilService] subscribe about, data.data.name: ' + data.data.name);

				rpSubscribeService.save({action: action, sr: data.data.name}, function() {
					rpSubredditsUtilService.updateSubreddits();
				});

			});

		};

		function updateSubscriptionStatus() {
			
			console.log('[rpSubredditsUtilService] updateSubscriptionStatus(), ' + rpSubredditsUtilService.subs.length + ", " + rpSubredditsUtilService.currentSub);
			
			var prevSubStatus = rpSubredditsUtilService.isSubscribed;
				
			rpSubredditsUtilService.isSubscribed = isSubscribed();
			
			if (rpSubredditsUtilService.isSubscribed !== prevSubStatus) {
				console.log('[rpSubredditsUtilService] updateSubscriptionStatus(), emit subscription_status_changed');
				$rootScope.$emit('subscription_status_changed', rpSubredditsUtilService.isSubscribed);
			}

		}

		function isSubscribed() {
			if (rpSubredditsUtilService.subs.length > 0 && rpSubredditsUtilService.currentSub !== "") {

				for (var i = 0; i < rpSubredditsUtilService.subs.length; i++) {

					if (rpSubredditsUtilService.subs[i].data.display_name.toLowerCase() === rpSubredditsUtilService.currentSub.toLowerCase()) {
						console.log('[rpSubredditsUtilService] isSubscribed(), true');
						return true;
					}
				}

				console.log('[rpSubredditsUtilService] isSubscribed(), false');
				return false;
				
			} else {
				return null;
			}
		}

		return rpSubredditsUtilService;
	}
]);

rpUtilServices.factory('rpPostsUtilService', ['$location', 'rpPostsService', 'rpFrontpageService', 
	function ($location, rpPostsService, rpFrontpageService) {
		
		return function(sub, sort, after, t, callback) {

			console.log('[rpPostsUtilService] request posts.');

			if (sub) {

				rpPostsService.query({
					sub: sub,
					sort: sort,
					after: after,
					t: t
				}, function(data) {
					
					if (data[0] === 'redirect') {
						console.log('[rpPostsUtilService] redirect: ' + data[1]);
						$location.path('/r/' + data[1], true).search('');

					} else {
						callback(data);
					}
				});

			} else {

				rpFrontpageService.query({
					sort: sort,
					after: after,
					t: t
				}, function(data) {
					callback(data);
				});

			}

		};

	}
]);

rpUtilServices.factory('rpMessageUtilService', ['rpMessageService', function (rpMessageService) {
	

	return function(where, after, callback) {
		console.log('[rpMessageUtilService] request messages.');

		rpMessageService.query({

			where: where, 
			after: after

		}, function(data) {

			callback(data);

		});


	};
}]);

rpUtilServices.factory('rpCommentsUtilService', ['rpCommentsService', 
	function (rpCommentsService) {
		return function(subreddit, article, sort, comment, context, callback) {
			console.log('[rpCommentsUtilService] request comments');

			rpCommentsService.query({
				subreddit: subreddit,
				article: article,
				sort: sort,
				comment: comment,
				context: context
			}, function(data) {
				callback(data);
			});

		};
	}
]);

rpUtilServices.factory('rpUserUtilService', ['rpUserService',
	function (rpUserService) {
		return function(username, where, sort, after, t, callback) {
			console.log('[rpUserUtilService] request user');

			rpUserService.query({
				username: username,
				where: where,
				sort: sort,
				after: after,
				t: t
			}, function(data) {
				callback(data);
			});

		};
	}
]);

rpUtilServices.factory('rpByIdUtilService', ['rpByIdService', function (rpByIdService) {
	return function(name, callback) {
		rpByIdService.query({name: name}, function(data) {
			callback(data);
		});
	};
}]);