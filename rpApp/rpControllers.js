'use strict';

/* Controllers */

var rpControllers = angular.module('rpControllers', []);

rpControllers.controller('rpIdentitySidenavCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$mdDialog',
	'rpAppIdentityService',
	'rpAppSettingsService',
	'rpAppIsMobileViewService',
	'rpAppLocationService',

	function(
		$scope,
		$rootScope,
		$timeout,
		$mdDialog,
		rpAppIdentityService,
		rpAppSettingsService,
		rpAppIsMobileViewService,
		rpAppLocationService

	) {

		$scope.loading = true;

		rpAppIdentityService.getIdentity(function(identity) {
			console.log('[rpIdentityCtrl] identity: ' + JSON.stringify(identity));
			$scope.identity = identity;
			$scope.loading = false;
			$timeout(angular.noop, 0);

		});


		$scope.$on('$destroy', function() {});
	}
]);

rpControllers.controller('rpLoginButtonCtrl', ['$scope', '$location', 'rpAppAuthService',
	function($scope, $location, rpAppAuthService) {
		console.log('[rpLoginCtrl] $scope.path: ' + $scope.path);

		$scope.isAuthenticated = rpAppAuthService.isAuthenticated;

		$scope.safePath = $scope.path ? encodeURIComponent($scope.path) : encodeURIComponent($location.path());

		var deregisterRouteUpdate = $scope.$on('$locationChangeSuccess', function() {
			$scope.safePath = encodeURIComponent($location.path());
			console.log('[rpLoginCtrl] onLocationChangeSuccess, $scope.safePath: ' + $scope.safePath);
		});

		$scope.$on('$destroy', function() {
			deregisterRouteUpdate();
		});

	}
]);

/*
	Sidenav Subreddits Controller
	Gets popular subreddits.
 */
rpControllers.controller('rpSubredditsSidenavCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$q',
	'$mdSidenav',
	'rpSubredditsUtilService',
	'rpAppLocationService',

	function(
		$scope,
		$rootScope,
		$timeout,
		$q,
		$mdSidenav,
		rpSubredditsUtilService,
		rpAppLocationService

	) {

		$scope.subs = [];
		$scope.isOpen = false;

		$scope.toggleOpen = function() {
			// $timeout(function() {
			//     $scope.isOpen = !$scope.isOpen;
			//
			// }, 150);
			$scope.isOpen = !$scope.isOpen;

		};

		$scope.pinnedSubs = [{
			name: 'frontpage',
			url: '/'
		}, {
			name: 'all',
			url: '/r/all/'
		}, {
			name: 'random',
			url: '/r/random/'
		}, {
			name: 'reddupco',
			url: '/r/reddupco'
		}];

		// rpSubredditsUtilService.updateSubreddits(function(err, data) {
		// 	if (err) {
		// 		console.log('[rpSubredditsCtrl] err');
		// 	} else {
		//
		// 	}
		// });

		var deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function() {
			$scope.subs = rpSubredditsUtilService.subs;
			$timeout(angular.noop, 0);
			// $scope.subs = {};
			// addSubsInBatches(rpSubredditsUtilService.subs, 10);
		});

		function addBatch(first, last, subs) {
			console.log('[rpSubredditsCtrl] addBatch(), first: ' + first + ', last: ' + last + ', $scope.subs.length: ' + $scope.subs.length);

			if ($scope.subs.length > 0) {
				$scope.subs = Array.prototype.concat.apply($scope.subs, subs.slice(first, last));
			} else {
				$scope.subs = subs.slice(first, last);
			}

			return; //$timeout(angular.noop, 0);
		}

		function addSubsInBatches(subs, batchSize) {
			console.log('[rpSubredditsCtrl] addSubsInBatches(), subs.length: ' + subs.length + ', batchSize: ' + batchSize);
			var addNextBatch;
			var addSubsAndRender = $q.when();

			for (var i = 0; i < subs.length; i += batchSize) {
				addNextBatch = angular.bind(null, addBatch, i, Math.min(i + batchSize, subs.length), subs);
				addSubsAndRender = addSubsAndRender.then(addNextBatch);

			}

			return addSubsAndRender;
		}

		$scope.openSubreddit = function(e, url) {
			console.log('[rpSubredditsCtrl] openSubreddit, url: ' + url);
			$timeout(function() {
				rpAppLocationService(e, url, '', true, false);

			}, 350);
		};

		$scope.$on('$destroy', function() {
			deregisterSubredditsUpdated();
		});
	}
]);

rpControllers.controller('rpToastCtrl', ['$scope', '$rootScope', '$mdToast', 'toastMessage', 'toastIcon',
	function($scope, $rootScope, $mdToast, toastMessage, toastIcon) {
		$scope.toastMessage = toastMessage;
		$scope.toastIcon = toastIcon;

		$scope.closeToast = function() {
			$mdToast.close();
		};

	}
]);

// rpControllers.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
//   $scope.close = function() {
// 	$mdSidenav('left').close();
//   };
// });

/*
	Toolbar controller handles title change through titleService.
 */
rpControllers.controller('rpToolbarCtrl', [
	'$scope',
	'$rootScope',
	'$log',
	'$element',
	'$timeout',
	'rpAppLocationService',
	'rpPlusSubscriptionUtilService',

	function(
		$scope,
		$rootScope,
		$log,
		$element,
		$timeout,
		rpAppLocationService,
		rpPlusSubscriptionUtilService

	) {

		/*
			SEARCH TOOLBAR
		 */

		$scope.linkTitle = false;
		$scope.showToolbar = false;
		$scope.colorLoaded = false;
		$scope.count = 0;

		var subredditRe = /r\/[\w]+/;
		var userRe = /u\/[\w]+/;

		$timeout(function() {
			$scope.showToolbar = true;
		}, 0);

		var deregisterHandleTitleChange = $rootScope.$on('rp_title_change_toolbar', function(e, title) {
			console.log('[rpToolbarCtrl] handleTitleChange(), title: ' + title);

			$scope.toolbarTitle = title;
			$scope.linkTitle = subredditRe.test(title) || userRe.test(title);

			console.log('[rpToolbarCtrl] handleTitleChange(), $scope.linkTitle: ' + $scope.linkTitle);

		});

		$scope.brandLink = function(e) {
			// console.log('[rpToolbarCtrl] brandLink(), e.data("events"): ' + e.data("events"));
			rpAppLocationService(e, '/', '', true, true);
		};

		/*
			Button Handlers
		 */
		var deregisterHideAllButtons = $rootScope.$on('rp_hide_all_buttons', function() {
			$scope.showPostTime = false;
			$scope.showPostSort = false;
			$scope.showUserWhere = false;
			$scope.showUserTime = false;
			$scope.showUserSort = false;
			$scope.showSearchTime = false;
			$scope.showRules = false;
			$scope.showRefresh = false;
			$scope.showSearchSort = false;
			$scope.showArticleSort = false;
			$scope.showMessageWhere = false;
			$scope.showLayout = false;
			$scope.showSlideshow = false;
		});

		rpPlusSubscriptionUtilService.isSubscribed(function(isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		var deregisterShowButton = $rootScope.$on('rp_button_visibility', function(e, button, visibility) {
			console.log('[rpToolbarCtrl] rp_show_button, button: ' + button + ', visibility: ' + visibility);
			$scope[button] = visibility;
		});

		var deregisterRefreshButtonSpin = $rootScope.$on('rp_refresh_button_spin', function(e, spin) {
			$scope.spinRefresh = spin;
		});

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			$scope.colorLoaded = true;
			deregisterSettingsChanged();
		});

		$scope.$on('$destroy', function() {
			// deregisterShowToolbarShadowChange();
			deregisterHandleTitleChange();
			deregisterSettingsChanged();
			deregisterRefreshButtonSpin();
			deregisterPlusSubscriptionUpdate();
		});

	}
]);

rpControllers.controller('rpSubscribeCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'rpSubredditsUtilService',

	function(
		$scope,
		$rootScope,
		$timeout,
		rpSubredditsUtilService

	) {
		console.log('[rpSubscribeCtrl] loaded');

		$scope.subscribed = rpSubredditsUtilService.subscribed;
		$scope.loadingSubscription = false;

		$scope.toggleSubscription = function() {
			console.log('[rpSubscribeCtrl] toggleSubscription');
			$scope.loadingSubscription = true;
			$timeout(angular.noop, 0);

			rpSubredditsUtilService.subscribeCurrent(function(err, data) {
				if (err) {
					console.log('[rpSubscribeCtrl] err');
				} else {

				}
			});

		};

		var deregisterHideAllButtons = $rootScope.$on('rp_hide_all_buttons', function() {
			$scope.showSubscribe = false;

		});

		var deregisterShowButton = $rootScope.$on('rp_button_visibility', function(e, button, visibility) {
			console.log('[rpSubscribeCtrl] rp_show_button, button: ' + button + ', visibility: ' + visibility);
			$scope.showSubscribe = visibility;
			if (!visibility) {
				rpSubredditsUtilService.resetSubreddit();
			}
		});


		var deregisterSubscriptionStatusChanged = $rootScope.$on('subscription_status_changed', function(e, subscribed) {
			console.log('[rpSubscribeCtrl] on subscription_status_changed, subscribed: ' + subscribed);

			if ($scope.loadingSubscription) {
				$scope.loadingSubscription = false;
				$timeout(angular.noop, 0);

			}

			$scope.subscribed = subscribed;

		});

		$scope.$on('$destroy', function() {
			deregisterSubscriptionStatusChanged();
			deregisterShowButton();
			deregisterHideAllButtons();
		});

	}
]);

rpControllers.controller('rpErrorCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'rpAppTitleChangeService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		rpAppTitleChangeService
	) {

		$rootScope.$emit('rp_progress_stop');
		$rootScope.$emit('rp_hide_all_buttons');
		rpAppTitleChangeService('oops', true, true);

		$scope.status = parseInt($routeParams.status) || 404;
		$scope.message = $routeParams.message;

		console.log('[rpErrorCtrl] $routeParams: ' + JSON.stringify($routeParams));
		console.log('[rpErrorCtrl] $routeParams.status: ' + $routeParams.status);
		console.log('[rpErrorCtrl] $scope.status: ' + $scope.status);

		if (!$scope.message) {
			if ($scope.status === 404) {
				$scope.message = "Did not find the page you're looking four-oh-four.";
			} else if ($scope.status === 403) {
				$scope.message = "Page is forbidden :/ Maybe you have to message the mods for permission.";
			} else {
				$scope.message = "Oops an error occurred.";
			}

		}

	}
]);

rpControllers.controller('rpSidebarCtrl', ['$scope', '$rootScope', 'rpSubredditsUtilService',
	function($scope, $rootScope, rpSubredditsUtilService) {

		$scope.about = rpSubredditsUtilService.about.data;

		var deregisterSubredditsAboutUpdated = $rootScope.$on('subreddits_about_updated', function() {
			console.log('[rpSidebarCtrl] subreddits_about_updated');
			$scope.about = rpSubredditsUtilService.about.data;

		});

		$scope.$on('$destroy', function() {
			deregisterSubredditsAboutUpdated();
		});

	}
]);

rpControllers.controller('rpSpeedDialCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'rpAppAuthService',
	'rpAppToastService',
	'rpAppSettingsService',
	'rpAppLocationService',
	'rpAppIsMobileViewService',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		rpAppAuthService,
		rpAppToastService,
		rpAppSettingsService,
		rpAppLocationService,
		rpAppIsMobileViewService

	) {

		console.log('[rpSpeedDialCtrl] load, $scope.subreddit: ' + $scope.subreddit);

		var sub = $scope.subreddit !== 'all' ? $scope.subreddit : "";
		console.log('[rpSpeedDialCtrl] load, sub: ' + sub);

		$scope.isOpen = false;
		$scope.direction = "up";

		$scope.open = function() {
			if ($scope.isOpen === false) {
				$scope.isOpen = true;
			}
		};

		$scope.collapse = function() {
			if ($scope.isOpen === true) {
				$scope.isOpen = false;
			}
		};

		var search = "";

		$scope.newLink = function(e) {
			if (rpAppAuthService.isAuthenticated) {

				if ((rpAppSettingsService.settings.submitDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
					$mdDialog.show({
						controller: 'rpSubmitDialogCtrl',
						templateUrl: 'rpSubmitLinkDialog.html',
						targetEvent: e,
						locals: {
							subreddit: sub
						},
						clickOutsideToClose: false,
						escapeToClose: false

					});

				} else {
					if (sub) {
						search = 'sub=' + sub;
					}
					console.log('[rpPostFabCtrl] submit link page, search: ' + search);
					rpAppLocationService(e, '/submitLink', search, true, false);
				}


				$scope.fabState = 'closed';

			} else {
				$scope.fabState = 'closed';
				rpAppToastService("you must log in to submit a link", "sentiment_neutral");
			}
		};

		$scope.newText = function(e) {

			console.log('[rpSpeedDialCtrl] newText() e.ctrlKey: ' + e.ctrlKey);

			if (rpAppAuthService.isAuthenticated) {

				if ((rpAppSettingsService.settings.submitDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
					$mdDialog.show({
						controller: 'rpSubmitDialogCtrl',
						templateUrl: 'rpSubmitTextDialog.html',
						targetEvent: e,
						locals: {
							subreddit: sub
						},
						clickOutsideToClose: false,
						escapeToClose: false

					});

				} else {
					if (sub) {
						search = 'sub=' + sub;
					}
					console.log('[rpPostFabCtrl] submit text page, search: ' + search);
					rpAppLocationService(e, '/submitText', search, true, false);

				}

				$scope.fabState = 'closed';

			} else {
				$scope.fabState = 'closed';
				rpAppToastService("you must log in to submit a self post", "sentiment_neutral");
			}
		};

		$scope.$on('$destroy', function() {});


	}
]);


rpControllers.controller('rpRefreshButtonCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		console.log('[rpRefreshButtonCtrl] load');
		$scope.refresh = function() {
			console.log('[rpRefreshButtonCtrl] refresh()');
			$rootScope.$emit('rp_refresh');
		};
	}
]);

rpControllers.controller('rpSlideshowButtonCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		console.log('[rpSlideshowButtonCtrl] load');
		$scope.startSlideshow = function() {
			console.log('[rpSlideshowButtonCtrl] startSlideshow()');
			$rootScope.$emit('rp_slideshow_start');
		};
	}
]);

rpControllers.controller('rpLayoutButtonCtrl', ['$scope', '$rootScope', 'rpAppSettingsService',
	function($scope, $rootScope, rpAppSettingsService) {
		console.log('[rpLayoutButtonCtrl] load');

		$scope.singleColumnLayout = rpAppSettingsService.settings.singleColumnLayout;

		$scope.toggleLayout = function() {
			$scope.singleColumnLayout = !$scope.singleColumnLayout;
			rpAppSettingsService.setSetting('singleColumnLayout', $scope.singleColumnLayout);
		};

	}
]);

rpControllers.controller('rpDialogCloseButtonCtrl', [
	'$scope',
	'$mdDialog',
	'$mdBottomSheet',
	function(
		$scope,
		$mdDialog,
		$mdBottomSheet
	) {
		console.log('[rpDialogCloseButtonCtrl] load');
		$scope.closeDialog = function(e) {
			console.log('[rpDialogCloseButtonCtrl] closeDialog()');

			$mdDialog.hide();
			$mdBottomSheet.hide();

		};
	}
]);

rpControllers.controller('rpToolbarSelectCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'rpAppAuthService',
	'rpAppIdentityService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		rpAppAuthService,
		rpAppIdentityService

	) {

		console.log('[rpToolbarSelectCtrl] $scope.type: ' + $scope.type);

		var configurations = {
			postSort: {
				event: 'rp_post_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: 0,
				options: [{
					label: 'hot',
					value: 'hot'
				}, {
					label: 'new',
					value: 'new'
				}, {
					label: 'rising',
					value: 'rising'
				}, {
					label: 'controversial',
					value: 'controversial'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'gilded',
					value: 'gilded'
				}]

			},
			postTime: {
				event: 'rp_post_time_click',
				routeParam: 't',
				ariaLabel: 'time',
				defaultOption: 2,
				options: [{
					label: 'this hour',
					value: 'hour'
				}, {
					label: 'today',
					value: 'day'
				}, {
					label: 'this week',
					value: 'week'
				}, {
					label: 'this month',
					value: 'month'
				}, {
					label: 'this year',
					value: 'year'
				}, {
					label: 'all time',
					value: 'all'
				}]
			},
			articleSort: {
				event: 'rp_article_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: '0',
				options: [{
					label: 'best',
					value: 'confidence'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'new',
					value: 'new'
				}, {
					label: 'hot',
					value: 'hot'
				}, {
					label: 'controversial',
					value: 'controversial'
				}, {
					label: 'old',
					value: 'old'
				}, {
					label: 'q&a',
					value: 'qa'
				}]
			},
			userWhere: {
				event: 'rp_user_where_click',
				routeParam: 'where',
				ariaLabel: 'where',
				defaultOption: 0,
				options: [{
					label: 'overview',
					value: 'overview'
				}, {
					label: 'submitted',
					value: 'submitted'
				}, {
					label: 'comments',
					value: 'comments'
				}, {
					label: 'gilded',
					value: 'gilded'
				}]
			},
			userSort: {
				event: 'rp_user_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: 0,
				options: [{
					label: 'new',
					value: 'new'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'hot',
					value: 'hot'
				}, {
					label: 'controversial',
					value: 'controversial'
				}]
			},
			userTime: {
				event: 'rp_user_time_click',
				routeParam: 't',
				ariaLabel: 'time',
				defaultOption: 1,
				options: [{
					label: 'this hour',
					value: 'hour'
				}, {
					label: 'today',
					value: 'day'
				}, {
					label: 'this week',
					value: 'week'
				}, {
					label: 'this month',
					value: 'month'
				}, {
					label: 'this year',
					value: 'year'
				}, {
					label: 'all time',
					value: 'all'
				}]
			},
			searchSort: {
				event: 'rp_search_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: '0',
				options: [{
					label: 'relevance',
					value: 'relevance'
				}, {
					label: 'hot',
					value: 'hot'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'new',
					value: 'new'
				}, {
					label: 'comments',
					value: 'comments'
				}]
			},
			searchTime: {
				event: 'rp_search_time_click',
				routeParam: 't',
				ariaLabel: 'time',
				defaultOption: 1,
				options: [{
					label: 'this hour',
					value: 'hour'
				}, {
					label: 'today',
					value: 'day'
				}, {
					label: 'this week',
					value: 'week'
				}, {
					label: 'this month',
					value: 'month'
				}, {
					label: 'this year',
					value: 'year'
				}, {
					label: 'all time',
					value: 'all'
				}]
			},
			messageWhere: {
				event: 'rp_message_where_click',
				routeParam: 'where',
				ariaLabel: 'where',
				defaultOption: 0,
				options: [{
					label: 'all',
					value: 'inbox'
				}, {
					label: 'unread',
					value: 'unread'
				}, {
					label: 'messages',
					value: 'messages'
				}, {
					label: 'comment replies',
					value: 'comments'
				}, {
					label: 'post replies',
					value: 'selfreply'
				}, {
					label: 'username mentions',
					value: 'mentions'
				}]
			}
		};

		var config = configurations[$scope.type];
		$scope.ariaLabel = config.ariaLabel;
		// console.log('[rpToolbarSelectCtrl] config: ' + JSON.stringify(config));

		$scope.options = config.options;

		initSelect();

		$scope.select = function() {
			$rootScope.$emit(config.event, $scope.selection.value);
		};

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
			console.log('[rpToolbarSelectCtrl] onRouteChange');
			initSelect();
		});

		var deregisterSearchFormSubmitted = $rootScope.$on('rp_init_select', function() {
			initSelect();
		});

		function initSelect() {
			console.log('[rpToolbarSelectCtrl] initSelect(), config.routeParam: ' + config.routeParam);
			console.log('[rpToolbarSelectCtrl] initSelect(), $routeParams[config.routeParam]: ' + $routeParams[config.routeParam]);
			console.log('[rpToolbarSelectCtrl] initSelect(), $scope.type: ' + $scope.type);

			var selection;

			var routeParam = $routeParams[config.routeParam];

			if (rpAppAuthService.isAuthenticated && $scope.type === 'userWhere') {

				rpAppIdentityService.getIdentity(function(identity) {
					console.log('[rpToolbarSelectCtrl] initSelect(), foo');

					if ($routeParams.username === identity.name) {
						$scope.options = $scope.options.concat([{
							label: 'upvoted',
							value: 'upvoted'
						}, {
							label: 'downvoted',
							value: 'downvoted'
						}, {
							label: 'hidden',
							value: 'hidden'
						}, {
							label: 'saved',
							value: 'saved'
						}]);
					} else { //make sure they are removed
						//in case you are going from your profile to someone elses
						$scope.options = config.options;
					}

					setSelection();

				});


			} else {
				setSelection();
			}

			function setSelection() {
				if (angular.isDefined(routeParam)) {
					console.log('[rpToolbarSelectCtrl] initSelect(), bar, $scope.options.length: ' + $scope.options.length);
					for (var i = 0; i < $scope.options.length; i++) {
						if ($scope.options[i].value === routeParam) {
							selection = $scope.options[i];
							break;
						}
					}
				}

				if (angular.isUndefined(selection)) {
					selection = config.options[config.defaultOption];
				}

				$scope.selection = selection;
			}



		}

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});

	}
]);

rpControllers.controller('rpGotoSubredditsCtrl', [
	'$scope',
	function($scope) {
		console.log('[rpGotoSubredditsCtrl] load');
		$scope.isOpen = false;

		$scope.toggleOpen = function(e) {
			$scope.isOpen = !$scope.isOpen;
		};

	}
]);

rpControllers.controller('rpGotoSubredditFormCtrl', [
	'$scope',
	'rpAppLocationService',
	function(
		$scope,
		rpAppLocationService
	) {
		console.log('[rpGotoSubredditFormCtrl] load');

		var subredditRe = /(?:r\/)?(\w+)/i;
		var sub;
		var search;

		$scope.GotoSubredditFormSubmit = function(e) {
			console.log('[rpGotoSubredditFormCtrl] $scope.search: ' + $scope.s);
			var groups;

			groups = $scope.s.match(subredditRe);

			if (groups) {
				sub = groups[1];
			}


			if (sub) {
				rpAppLocationService(e, '/r/' + sub, '', true, false);
			}
		};
	}
]);

rpControllers.controller('rpPlusSidenavAdCtrl', [
	'$scope',
	'$mdDialog',
	'rpAppSettingsService',
	'rpAppIsMobileViewService',
	'rpAppLocationService',
	function(
		$scope,
		$mdDialog,
		rpAppSettingsService,
		rpAppIsMobileViewService,
		rpAppLocationService
	) {
		console.log('[rpPlusSidenavCtrl]');
		$scope.showPlus = function(e) {

			console.log('[rpPlusSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpPlusSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpAppSettingsService.settings.settingsDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
				$mdDialog.show({
					controller: 'rpSettingsDialogCtrl',
					templateUrl: 'rpSettings/views/rpSettingsDialog.html',
					clickOutsideToClose: true,
					escapeToClose: true,
					locals: {
						animations: $scope.animations,
						theme: $scope.theme,
						tab: 1
					}
				});

			} else {
				rpAppLocationService(e, '/settings', '', true, false);
			}

		};

	}
]);