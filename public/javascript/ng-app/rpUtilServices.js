'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);

rpUtilServices.factory('rpSearchUtilService', ['$rootScope', 'rpSearchService', 'rpLocationUtilService',
	function ($rootScope, rpSearchService, rpLocationUtilService) {	

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

				rpSearchService.get({
					sub: rpSearchUtilService.params.sub,
					q: rpSearchUtilService.params.q,
					restrict_sub: rpSearchUtilService.params.restrict_sub,
					sort: rpSearchUtilService.params.sort,
					type: rpSearchUtilService.params.type,
					t: rpSearchUtilService.params.t,
					after: rpSearchUtilService.params.after,
					limit: rpSearchUtilService.params.limit
				}, function(data) {
					callback(data);
				});

			} else {
				callback(null);
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
	function ($rootScope, rpSubredditsUtilService) {
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

rpUtilServices.factory('rpUserTabUtilService', ['$rootScope', 
	function($rootScope){
	
		var rpUserTabUtilService = {};
		rpUserTabUtilService.tab = "";

		rpUserTabUtilService.setTab = function(tab) {
			console.log('[rpUserTabUtilService] setTab(), tab: ' + tab);
			
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

rpUtilServices.factory('rpSearchTabsUtilService', ['$rootScope', 
	function($rootScope){
	
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


rpUtilServices.factory('rpIdentityUtilService', ['rpIdentityService', 'rpAuthUtilService',
	function(rpIdentityService, rpAuthUtilService) {

		var rpIdentityUtilService = {};

		rpIdentityUtilService.identity = null;

		rpIdentityUtilService.getIdentity = function(callback) {
			console.log('[rpIdentityService] getIdentity()');

			if (rpAuthUtilService.isAuthenticated) {

				if (rpIdentityUtilService.identity !== null) {
					console.log('[rpIdentityService] getIdentity(), have identity');
					callback(rpIdentityUtilService.identity);
				
				}
				
				else {
					
					console.log('[rpIdentityService] getIdentity(), requesting identity');

					rpIdentityService.query(function(data) {

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

rpUtilServices.factory('rpShareEmailUtilService', ['rpShareEmailService', 'rpToastUtilService',
	function (rpShareEmailService, rpToastUtilService) {

		return function(to, text, subject, callback) {

			rpShareEmailService.save({
				to: to,
				text: text,
				subject: subject
			}, function(data) {
				console.log('[rpShareEmailUtilService] data: ' + data);
				callback(data);
			});	

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

rpUtilServices.factory('rpSubredditsUtilService', ['$rootScope', 'rpSubredditsService', 'rpSubscribeService', 'rpAboutSubredditService', 'rpAuthUtilService', 'rpToastUtilService',
	function ($rootScope, rpSubredditsService, rpSubscribeService, rpAboutSubredditService, rpAuthUtilService, rpToastUtilService) {
	
		var rpSubredditsUtilService = {};

		rpSubredditsUtilService.subs = {};
		rpSubredditsUtilService.currentSub = "";
		rpSubredditsUtilService.subscribed = null;

		rpSubredditsUtilService.resetSubreddit = function() {
			rpSubredditsUtilService.currentSub = "";
			rpSubredditsUtilService.subscribed = null;
		};

		rpSubredditsUtilService.setSubreddit = function(sub) {
			console.log('[rpSubredditsUtilService] setSubreddit, sub: ' + sub);

			if (sub && rpSubredditsUtilService.currentSub !== sub) {

				rpSubredditsUtilService.currentSub = sub;
				updateSubscriptionStatus();

			}
		};

		rpSubredditsUtilService.updateSubreddits = function() {
			console.log('[rpSubredditsUtilService] updateSubreddits()');
			rpSubredditsService.query(function(data) {

				rpSubredditsUtilService.subs = data;
				$rootScope.$emit('subreddits_updated');
				updateSubscriptionStatus();

			});

		};

		rpSubredditsUtilService.subscribeCurrent = function() {
			console.log('[rpSubredditsUtilService] subscribeCurrent(), currentSub: ' + rpSubredditsUtilService.currentSub);

			var action = rpSubredditsUtilService.subscribed ? 'unsub' : 'sub';

			rpAboutSubredditService.query({sub: rpSubredditsUtilService.currentSub}, function(data) {
				console.log('[rpSubredditsUtilService] subscribeCurrent() about, data.data.name: ' + data.data.name);

				rpSubscribeService.save({action: action, sr: data.data.name}, function() {
					rpSubredditsUtilService.updateSubreddits();
				});

			});

		};

		rpSubredditsUtilService.subscribe = function(action, name, callback) {
			console.log('[rpSubredditsUtilService], subscribe(), action: ' + action + ", name: " + name);

			if (rpAuthUtilService.isAuthenticated) {
				rpSubscribeService.save({action: action, sr: name}, function() {
					rpSubredditsUtilService.updateSubreddits();
					callback();
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
					callback(data);
					
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

rpUtilServices.factory('rpToolbarShadowUtilService', [ '$rootScope',
	function ($rootScope) {
	
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

	function( $q, $rootScope ) {
		// I manage the preloading of image objects. Accepts an array of image URLs.
		function Preloader( imageLocations ) {
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
		Preloader.preloadImages = function( imageLocations ) {
			var preloader = new Preloader( imageLocations );
			return( preloader.load() );
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
				return( this.state !== this.states.PENDING );
			},
			// I determine if the preloader has failed to load all of the images.
			isRejected: function isRejected() {
				return( this.state === this.states.REJECTED );
			},
			// I determine if the preloader has successfully loaded all of the images.
			isResolved: function isResolved() {
				return( this.state === this.states.RESOLVED );
			},
			// I initiate the preload of the images. Returns a promise.
			load: function load() {
				// If the images are already loading, return the existing promise.
				if ( this.isInitiated() ) {
					return( this.promise );
				}
				this.state = this.states.LOADING;
				for ( var i = 0 ; i < this.imageCount ; i++ ) {
					this.loadImageLocation( this.imageLocations[ i ] );
				}
				// Return the deferred promise for the load event.
				return( this.promise );
			},
			// ---
			// PRIVATE METHODS.
			// ---
			// I handle the load-failure of the given image location.
			handleImageError: function handleImageError( imageLocation ) {
				this.errorCount++;
				// If the preload action has already failed, ignore further action.
				if ( this.isRejected() ) {
					return;
				}
				this.state = this.states.REJECTED;
				this.deferred.reject( imageLocation );
			},
			// I handle the load-success of the given image location.
			handleImageLoad: function handleImageLoad( imageLocation ) {
				this.loadCount++;
				// If the preload action has already failed, ignore further action.
				if ( this.isRejected() ) {
					return;
				}
				// Notify the progress of the overall deferred. This is different
				// than Resolving the deferred - you can call notify many times
				// before the ultimate resolution (or rejection) of the deferred.
				this.deferred.notify({
					percent: Math.ceil( this.loadCount / this.imageCount * 100 ),
					imageLocation: imageLocation
				});
				// If all of the images have loaded, we can resolve the deferred
				// value that we returned to the calling context.
				if ( this.loadCount === this.imageCount ) {
					this.state = this.states.RESOLVED;
					this.deferred.resolve( this.imageLocations );
				}
			},
			// I load the given image location and then wire the load / error
			// events back into the preloader instance.
			// --
			// NOTE: The load/error events trigger a $digest.
			loadImageLocation: function loadImageLocation( imageLocation ) {
				var preloader = this;
				// When it comes to creating the image object, it is critical that
				// we bind the event handlers BEFORE we actually set the image
				// source. Failure to do so will prevent the events from proper
				// triggering in some browsers.
				var image = $( new Image() )
					.load(
						function( event ) {
							// Since the load event is asynchronous, we have to
							// tell AngularJS that something changed.
							$rootScope.$apply(
								function() {
									preloader.handleImageLoad( event.target.src );
									// Clean up object reference to help with the
									// garbage collection in the closure.
									preloader = image = event = null;
								}
							);
						}
					)
					.error(
						function( event ) {
							// Since the load event is asynchronous, we have to
							// tell AngularJS that something changed.
							$rootScope.$apply(
								function() {
									preloader.handleImageError( event.target.src );
									// Clean up object reference to help with the
									// garbage collection in the closure.
									preloader = image = event = null;
								}
							);
						}
					)
					.prop( "src", imageLocation )
				;
			}
		};
		// Return the factory instance.
		return( Preloader );
	}
);