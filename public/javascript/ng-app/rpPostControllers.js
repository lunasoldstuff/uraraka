'use strict';

var rpPostControllers = angular.module('rpPostControllers', []);

rpPostControllers.controller('rpPostsCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$log',
		'$window',
		'$filter',
		'$timeout',
		'rpPostsUtilService',
		'rpTitleChangeService',
		'$mdToast',
		'$mdDialog',
		'$mdBottomSheet',
		'rpPostsTabsUtilService',
		'rpUserFilterButtonUtilService',
		'rpUserSortButtonUtilService',
		'rpSubscribeButtonUtilService',
		'rpSettingsUtilService',
		'rpSubredditsUtilService',
		'rpLocationUtilService',
		'rpByIdUtilService',
		'rpSearchFormUtilService',
		'rpSearchFilterButtonUtilService',
		'rpSidebarButtonUtilService',
		'rpToolbarShadowUtilService',
		'rpAuthUtilService',
		'rpIdentityUtilService',


		function(
			$scope,
			$rootScope,
			$routeParams,
			$log,
			$window,
			$filter,
			$timeout,
			rpPostsUtilService,
			rpTitleChangeService,
			$mdToast,
			$mdDialog,
			$mdBottomSheet,
			rpPostsTabsUtilService,
			rpUserFilterButtonUtilService,
			rpUserSortButtonUtilService,
			rpSubscribeButtonUtilService,
			rpSettingsUtilService,
			rpSubredditsUtilService,
			rpLocationUtilService,
			rpByIdUtilService,
			rpSearchFormUtilService,
			rpSearchFilterButtonUtilService,
			rpSidebarButtonUtilService,
			rpToolbarShadowUtilService,
			rpAuthUtilService,
			rpIdentityUtilService
		) {

			console.log('[rpPostsCtrl] Loaded.');

			$scope.posts = {};

			rpUserFilterButtonUtilService.hide();
			rpUserSortButtonUtilService.hide();
			rpSearchFormUtilService.hide();
			rpSearchFilterButtonUtilService.hide();
			rpToolbarShadowUtilService.hide();

			var value = $window.innerWidth;

			if (value > 1550) {
				// $log.log("Changing to 3 columns, window size: " + value);
				$scope.columns = [1, 2, 3];
			} else if (value > 970) {
				// $log.log("Changing to 2 columns, window size: " + value);
				$scope.columns = [1, 2];
			} else {
				// $log.log("Changing to 1 column, window size: " + value);
				$scope.columns = [1];
			}

			var sub = $scope.subreddit = $routeParams.sub;
			console.log('[rpPostsCtrl] sub: ' + sub);

			$scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';
			console.log('[rpPostsCtrl] $scope.sort: ' + $scope.sort);

			var t = $routeParams.t ? $routeParams.t : '';
			var loadingMore = false;
			$scope.showSub = true;
			$scope.havePosts = false;
			$scope.noMorePosts = false;
			var limit = 24;

			rpPostsTabsUtilService.setTab($scope.sort);

			if (sub && sub !== 'all' && sub !== 'random') {
				$scope.showSub = false;
				rpTitleChangeService.prepTitleChange('r/' + sub);
				rpSubredditsUtilService.setSubreddit(sub);
				rpSubscribeButtonUtilService.show();
				rpSidebarButtonUtilService.show();
				console.log('[rpPostsCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
			}

			else {
				rpSubscribeButtonUtilService.hide();
				rpSidebarButtonUtilService.hide();
				$scope.showSub = true;
				rpTitleChangeService.prepTitleChange('the material frontpage of the internet');
				console.log('[rpPostsCtrl] (no sub)rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
			}

			/*
				Manage setting to open comments in a dialog or window.
			 */
			var commentsDialog = rpSettingsUtilService.settings.commentsDialog;

			var deregisterSettingsChanged = $rootScope.$on('settings_changed', function() {
				commentsDialog = rpSettingsUtilService.settings.commentsDialog;
			});

			if (rpAuthUtilService.isAuthenticated) {
				rpIdentityUtilService.getIdentity(function(identity) {
					$scope.identity = identity;
				});
			}

			/*
				Loading Posts
			 */

			$rootScope.$emit('progressLoading');

			rpPostsUtilService(sub, $scope.sort, '', t, limit, function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpPostsCtrl] err.status: ' + JSON.stringify(err.status));

				} else {

					$scope.posts = data.get.data.children;
					$scope.havePosts = true;

					console.log('[rpPostsCtrl] data.length: ' + data.get.data.children.length);

					if (data.get.data.children.length < limit) {
						$scope.noMorePosts = true;
					}

				}
			});

			/**
			 * EVENT HANDLERS
			 */

			var deregisterTClick = $rootScope.$on('t_click', function(e, time){
				$scope.posts = {};
				$scope.noMorePosts = false;

				t = time;

				if (sub) {
					rpLocationUtilService(null, '/r/' + sub + '/' + $scope.sort, 't=' + t, false, false);

				} else {
				}
					rpLocationUtilService(null, $scope.sort, 't=' + t, false, false);

				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;

				rpPostsUtilService(sub, $scope.sort, '', t, limit, function(err, data) {
					$rootScope.$emit('progressComplete');

					if (err) {
						console.log('[rpPostsCtrl] err');
					} else {
						console.log('[rpPostsCtrl] t_click(), data.length: ' + data.get.data.children.length);

						if (data.get.data.children.length < limit) {
							$scope.noMorePosts = true;
						}

						$scope.posts = data.get.data.children;
						$scope.havePosts = true;

					}

				});

			});

			var deregisterPostsTabClick = $rootScope.$on('posts_tab_click', function(e, tab){
				console.log('[rpPostsCtrl] posts_tab_click, $scope.subreddit: ' + $scope.subreddit);
				$scope.posts = {};
				$scope.noMorePosts = false;
				$scope.sort = tab;

				if (sub) {
					rpLocationUtilService(null, '/r/' + sub + '/' + $scope.sort, '', false, false);
				} else {
					rpLocationUtilService(null, $scope.sort, '', false, false);
				}

				$scope.havePosts = false;
				$rootScope.$emit('progressLoading');

				rpPostsUtilService(sub, $scope.sort, '', t, limit, function(err, data) {
					$rootScope.$emit('progressComplete');

					if (err) {
						console.log('[rpPostsCtrl] err');
					} else {
						console.log('[rpPostsCtrl] posts_tab_click(), data.length: ' + data.get.data.children.length);

						if (data.get.data.children.length < limit) {
							$scope.noMorePosts = true;
						}

						$scope.posts = data.get.data.children;
						$scope.havePosts = true;
					}
				});

			});

			/**
			 * CONTROLLER API
			 * */

			$scope.thisController = this;

			this.completeDeleting = function(id) {
				console.log('[rpPostCtrl] completeDeleting()');

				$scope.posts.forEach(function(postIterator, i) {
					if (postIterator.data.name === id) {
						$scope.posts.splice(i, 1);
					}

				});

			};

			/**
			 * SCOPE FUNCTIONS
			 * */

			/*
				Load more posts using the 'after' parameter.
			 */
			$scope.morePosts = function() {
				console.log('[rpPostsCtrl] morePosts() loadingMore: ' + loadingMore);

				if ($scope.posts && $scope.posts.length > 0) {
					var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
					if(lastPostName && !loadingMore) {
						loadingMore = true;
						$rootScope.$emit('progressLoading');

						rpPostsUtilService(sub, $scope.sort, lastPostName, t, limit, function(err, data) {
							$rootScope.$emit('progressComplete');

							if (err) {
								console.log('[rpPostsCtrl] err');
							} else {
								console.log('[rpPostsCtrl] morePosts(), data.length: ' + data.get.data.children.length);

								if (data.get.data.children.length < limit) {
									$scope.noMorePosts = true;
								}

								Array.prototype.push.apply($scope.posts, data.get.data.children);

								loadingMore = false;

							}
						});

					}
				}
			};

			$scope.showComments = function(e, post) {

				console.log('[rpPostsCtrl] showComments(), e.ctrlKey:' + e.ctrlKey);

				// console.log('[rpPostsCtrl] showComments(), $window.innerWidth: ' + $window.innerWidth);

				// var left = $window.innerWidth / 2;
				// var width = $window.innerWidth * 0.9;

				// console.log('[rpPostsCtrl] showComments(), left: ' + left);

				if (commentsDialog && !e.ctrlKey) {
					$mdDialog.show({
						controller: 'rpArticleDialogCtrl',
						templateUrl: 'partials/rpArticleDialog',
						targetEvent: e,
						locals: {
							post: post
						},
						clickOutsideToClose: true,
						openFrom: '#' + post.data.name,
						closeTo: '#' + post.data.name,
						escapeToClose: false

					});

				} else {
					rpLocationUtilService(e, '/r/' + post.data.subreddit + '/comments/' + post.data.id, '', true, false);
				}

			};

			$scope.showContext = function(e, post) {
				console.log('[rpPostsCtrl] showContext()');

				rpLocationUtilService(e, '/r/' + post.data.subreddit +
					'/comments/' +
					$filter('rp_name_to_id36')(post.data.link_id) +
					'/' + post.data.id + '/', 'context=8', true, false);
			};

			// $scope.triggerTabChangeEvent = function() {
			// 	rpPostsTabsUtilService.setTab('new');
			// 	// $rootScope.$emit('posts_tab_change');
			// };

			// $scope.openAuthor = function(e, post) {
			// 	rpLocationUtilService(e, '/u/' + post.data.author, '', true, false);
			// };


			$scope.$on('$destroy', function() {
				console.log('[rpPostsCtrl] $destroy, $scope.subreddit: ' + $scope.subreddit);
				deregisterSettingsChanged();
				deregisterPostsTabClick();
				deregisterTClick();
			});

		}
	]
);

rpPostControllers.controller('rpPostsTabsCtrl', ['$scope', '$rootScope', 'rpPostsTabsUtilService',
 'rpPostFilterButtonUtilService',
	function($scope, $rootScope, rpPostsTabsUtilService, rpPostFilterButtonUtilService) {

		selectTab();

		/*
			A Hack to stop the tab bar reloading content and switching tabs when it loads the first time.
			Because tabClick gets fired the first time it loads.
		 */
		var firstLoadOver = false;

		$scope.tabClick = function(tab) {

			console.log('[rpPostsTabsCtrl] tabClick(), tab: ' + tab);

			if (firstLoadOver) {
				console.log('[rpPostsTabsCtrl] tabClick(), firstLoadOver: ' + tab);
				$rootScope.$emit('posts_tab_click', tab);
				rpPostsTabsUtilService.setTab(tab);

			} else {
				console.log('[rpPostsTabsCtrl] tabClick(), firstLoad: ' + tab);
				firstLoadOver = true;
			}

		};

		var deregisterPostsTabChange = $rootScope.$on('posts_tab_change', function(e, tab){
			console.log('[rpPostsTabsCtrl] posts_tab_change');
			selectTab();
		});

		/*
			Triggers tabClick when the tab changes.
		 */

		function selectTab() {
			var tab = rpPostsTabsUtilService.tab;
			console.log('[rpPostsTabsCtrl] selectTab() tab: ' + tab);

			if (tab === 'top' || tab === 'controversial') {
				rpPostFilterButtonUtilService.show();
			} else {
				rpPostFilterButtonUtilService.hide();
			}

			switch(tab) {
				case 'hot':
					$scope.selectedIndex = 0;
					break;
				case 'new':
					$scope.selectedIndex = 1;
					break;
				case 'rising':
					$scope.selectedIndex = 2;
					break;
				case 'controversial':
					$scope.selectedIndex = 3;
					break;
				case 'top':
					$scope.selectedIndex = 4;
					break;
				case 'gilded':
					$scope.selectedIndex = 5;
					break;
				default:
					$scope.selectedIndex = 0;
					break;
			}
		}

		$scope.$on('$destroy', function() {
			console.log('[rpPostsTabsCtrl] destroy()');
			deregisterPostsTabChange();
		});
	}
]);

rpPostControllers.controller('rpPostsTimeFilterCtrl', ['$scope', '$rootScope', '$routeParams',
	function($scope, $rootScope, $routeParams) {

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
			console.log('[rpPostsTimeFilterCtrl] onRouteChangeSuccess, $routeParams: ' + JSON.stringify($routeParams));
			$scope.postTime = $routeParams.t || 'week';

		});

		console.log('[rpPostsTimeFilterCtrl] $scope.postTime: ' + $scope.postTime);

		$scope.selectTime = function(value) {
			$rootScope.$emit('t_click', value);
		};

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});
	}
]);

rpPostControllers.controller('rpPostFabCtrl', ['$scope', '$rootScope', '$mdDialog', 'rpAuthUtilService',
	'rpToastUtilService', 'rpSettingsUtilService', 'rpLocationUtilService',
	function($scope, $rootScope, $mdDialog, rpAuthUtilService, rpToastUtilService, rpSettingsUtilService,
		rpLocationUtilService) {
		console.log('[rpPostFabCtrl] $scope.subreddit: ' + $scope.subreddit);

		$scope.fabState = 'closed';

		var submitDialog = rpSettingsUtilService.settings.submitDialog;

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function() {
			console.log('[rpPostFabCtrl] settings_changed');
			$scope.submitDialog = rpSettingsUtilService.settings.submitDialog;

		});

		$scope.newLink = function(e) {
			if (rpAuthUtilService.isAuthenticated) {

				if (submitDialog) {
					$mdDialog.show({
						controller: 'rpSubmitDialogCtrl',
						templateUrl: 'partials/rpSubmitLinkDialog',
						targetEvent: e,
						locals: {
							subreddit: $scope.subreddit
						},
						clickOutsideToClose: true,
						escapeToClose: false

					});

				} else {
					console.log('[rpPostFabCtrl] submit link page');
					rpLocationUtilService(null, '/submitLink', '', true, false);
				}


				$scope.fabState = 'closed';

			} else {
				$scope.fabState = 'closed';
				rpToastUtilService("You've got to log in to submit a link");
			}
		};

		$scope.newText = function(e) {

			if (rpAuthUtilService.isAuthenticated) {

				if (submitDialog) {
					$mdDialog.show({
						controller: 'rpSubmitDialogCtrl',
						templateUrl: 'partials/rpSubmitTextDialog',
						targetEvent: e,
						locals: {
							subreddit: $scope.subreddit
						},
						clickOutsideToClose: true,
						escapeToClose: false

					});

				} else {
					console.log('[rpPostFabCtrl] submit text page');
					rpLocationUtilService(null, '/submitText', '', true, false);

				}

				$scope.fabState = 'closed';

			} else {
				$scope.fabState = 'closed';
				rpToastUtilService("You've got to log in to submit a self post");
			}
		};

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
		});

	}
]);
