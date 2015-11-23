'use strict';

var rpUserControllers = angular.module('rpUserControllers', []);

rpUserControllers.controller('rpUserCtrl',
	[
		'$scope',
		'$rootScope',
		'$window',
		'$routeParams',
		'$filter',
		'$mdDialog',
		'$mdBottomSheet',
		'rpUserUtilService',
		'rpTitleChangeService',
		'rpSettingsUtilService',
		'rpByIdUtilService',
		'rpUserTabsUtilService',
		'rpUserFilterButtonUtilService',
		'rpPostFilterButtonUtilService',
		'rpSubscribeButtonUtilService',
		'rpLocationUtilService',
		'rpIdentityUtilService',
		'rpSearchFormUtilService',
		'rpSearchFilterButtonUtilService',
		'rpToolbarShadowUtilService',
		'rpAuthUtilService',
		'rpSidebarButtonUtilService',

	function(
		$scope,
		$rootScope,
		$window,
		$routeParams,
		$filter,
		$mdDialog,
		$mdBottomSheet,
		rpUserUtilService,
		rpTitleChangeService,
		rpSettingsUtilService,
		rpByIdUtilService,
		rpUserTabsUtilService,
		rpUserFilterButtonUtilService,
		rpPostFilterButtonUtilService,
		rpSubscribeButtonUtilService,
		rpLocationUtilService,
		rpIdentityUtilService,
		rpSearchFormUtilService,
		rpSearchFilterButtonUtilService,
		rpToolbarShadowUtilService,
		rpAuthUtilService,
		rpSidebarButtonUtilService
	) {

		console.log('[rpUserCtrl] loaded.');
		console.log('[rpUserCtrl] $routeParams: ' + JSON.stringify($routeParams));

		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpSearchFormUtilService.hide();
		rpSearchFilterButtonUtilService.hide();
		rpToolbarShadowUtilService.hide();
		rpSidebarButtonUtilService.hide();

		var loadingMore = false;
		$scope.havePosts = false;
		$scope.noMorePosts = false;
		var limit = 24;

		var value = $window.innerWidth;
		if (value > 1550) $scope.columns = [1, 2, 3];
		else if (value > 970) $scope.columns = [1, 2];
		else $scope.columns = [1];

		var username = $routeParams.username;
		var where = $routeParams.where || 'overview';
		var sort = $routeParams.sort || 'new';
		var t = $routeParams.t || 'none';

		if (rpAuthUtilService.isAuthenticated) {

			rpIdentityUtilService.getIdentity(function(identity) {
				$scope.isMe = (username.toLowerCase() === identity.name.toLowerCase());
				$scope.identity = identity;

				console.log('[rpUserCtrl] isMe: ' + $scope.isMe);
				rpUserTabsUtilService.setTab(where);
				console.log('[rpUserCtrl] where: ' + where);
			});

		} else {
			$scope.isMe = false;
			console.log('[rpUserCtrl] not authenticated, $scope.isMe: ' + $scope.isMe);

			if (where != 'overview' || where != 'submitted' || where != 'comments' || where != 'gilded') {
				where = 'overview';
				rpLocationUtilService(null, '/u/' + username + '/' + where, '', false, true);
			}

			rpUserTabsUtilService.setTab(where);
			console.log('[rpUserCtrl] where: ' + where);
		}

		if (sort === 'top' || sort === 'controversial') {
			rpUserFilterButtonUtilService.show();
		} else {
			rpUserFilterButtonUtilService.hide();
		}

		rpTitleChangeService.prepTitleChange('u/' + username);

		/*
			Manage setting to open comments in a dialog or window.
		*/
		$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;

		/**
		 * Load Posts
		 */

		$rootScope.$emit('progressLoading');

		rpUserUtilService(username, where, sort, '', t, limit, function(err, data) {
			$rootScope.$emit('progressComplete');

			if (err) {
				console.log('[rpUserCtrl] err');
			} else {
				console.log('[rpUserCtrl] data.length: ' + data.get.data.children.length);

				if (data.get.data.children.length < limit) {
					$scope.noMorePosts = true;
				}

				$scope.posts = data.get.data.children;
				$scope.havePosts = true;

			}


		});

		/**
		 * EVENT HANDLERS
		 * */

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function(data) {
 			$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;
 		});

		var deregisterUserSortClick = $rootScope.$on('user_sort_click', function(e, s){
			console.log('[rpUserCtrl] user_sort_click');
			$scope.posts = {};
			$scope.noMorePosts = false;

			sort = s;

			rpLocationUtilService(null, '/u/' + username + '/' + where, 'sort=' + sort, false, false);

			if (sort === 'top' || sort === 'controversial') {
				rpUserFilterButtonUtilService.show();
			} else {
				rpUserFilterButtonUtilService.hide();
			}

			$scope.havePosts = false;

			$rootScope.$emit('progressLoading');


			rpUserUtilService(username, where, sort, '', t, limit, function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpUserCtrl] err');
				} else {


					if (data.get.data.children.length < limit) {
						$scope.noMorePosts = true;
					}

					$scope.posts = data.get.data.children;
					$scope.havePosts = true;
				}
			});

		});

		var deregisterUserTClick = $rootScope.$on('user_t_click', function(e, time){
			console.log('[rpUserCtrl] user_t_click');
			$scope.posts = {};
			$scope.noMorePosts = false;

			t = time;

			rpLocationUtilService(null, '/u/' + username + '/' + where, 'sort=' + sort + '&t=' + t, false, false);

			$scope.havePosts = false;

			$rootScope.$emit('progressLoading');

			rpUserUtilService(username, where, sort, '', t, limit, function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpUserCtrl] err');
				} else {

					if (data.get.data.children.length < limit) {
						$scope.noMorePosts = true;
					}

					$scope.posts = data.get.data.children;
					$scope.havePosts = true;

				}

			});

		});

		var deregisterUserTabClick = $rootScope.$on('user_tab_click', function(e, tab) {
			console.log('[rpUserCtrl] user_tab_click');
			$scope.posts = {};
			$scope.noMorePosts = false;

			where = tab;

			rpLocationUtilService(null, '/u/' + username + '/' + where, '', false, false);

			$scope.havePosts = false;
			$rootScope.$emit('progressLoading');

			rpUserUtilService(username, where, sort, '', t, limit, function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpUserCtrl] err');
				} else {

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
			console.log('[rpUserCtrl] completeDeleting()');

			$scope.posts.forEach(function(postIterator, i) {
				if (postIterator.data.name === id) {
					$scope.posts.splice(i, 1);
				}

			});

		};


		/**
		 * SCOPE FUNCTIONS
		 * */

		$scope.morePosts = function() {
			console.log('[rpUserCtrl] morePosts()');

			if ($scope.posts && $scope.posts.length > 0) {

				var lastPostName = $scope.posts[$scope.posts.length-1].data.name;

				if (lastPostName && !loadingMore) {

					loadingMore = true;

					$rootScope.$emit('progressLoading');

					rpUserUtilService(username, where, sort, lastPostName, t, limit, function(err, data) {
						$rootScope.$emit('progressComplete');

						if (err) {
							console.log('[rpUserCtrl] err');

						} else {
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

		$scope.showCommentsUser = function(e, post) {
			var id = post.data.link_id || post.data.name;
			rpByIdUtilService(id, function(err, data) {

				if (err) {
					console.log('[rpUserCtrl] shwoComemntsUser, err');
				} else {

					console.log('[rpUserCtrl] showCommentsUser, data: ' + JSON.stringify(data));
					console.log('[rpUserCtrl] showCommentsUser, data.data.children[0].data.subreddit: ' + data.data.children[0].data.subreddit);
					console.log('[rpUserCtrl] showCommentsUser, data.data.children[0].data.id: ' + data.data.children[0].data.id);


					if (commentsDialog && !e.ctrlKey) {
						$mdDialog.show({
							controller: 'rpArticleDialogCtrl',
							templateUrl: 'partials/rpArticleDialog',
							targetEvent: e,
							// parent: angular.element('#rp-content'),
							locals: {
								post: data.data.children[0]
							},
							clickOutsideToClose: true,
							escapeToClose: false

						});

					} else {
						rpLocationUtilService(e, '/r/' + data.data.children[0].data.subreddit + '/comments/' + data.data.children[0].data.id, '', true, false);
					}
				}
			});
		};

		// $scope.showContext = function(e, post) {
		// 	console.log('[rpUserCtrl] showContext()');
		//
		// 	if (commentsDialog && !e.ctrlKey) {
		//
		// 		var id = post.data.link_id || post.data.name;
		//
		// 		rpByIdUtilService(id, function(err, data) {
		//
		// 			if (err) {
		// 				console.log('[rpUserCtrl] err');
		// 			} else {
		// 				data.comment = post.data.id;
		// 				data.context = 8;
		// 				$mdDialog.show({
		// 					controller: 'rpArticleDialogCtrl',
		// 					templateUrl: 'partials/rpCommentsDialog',
		// 					targetEvent: e,
		// 					locals: {
		// 						post: data.data.children[0]
		// 					},
		// 					clickOutsideToClose: true,
		// 					escapeToClose: false
		//
		// 				});
		//
		// 			}
		//
		// 		});
		//
		// 	} else {
		//
		// 		rpLocationUtilService(e, '/r/' + post.data.subreddit +
		// 			'/comments/' +
		// 			$filter('rp_name_to_id36')(post.data.link_id) +
		// 			'/' + post.data.id + '/', 'context=8', true, false);
		// 	}
		// };

		$scope.$on('$destroy', function() {
			deregisterUserTClick();
			deregisterUserSortClick();
			deregisterUserTabClick();
			deregisterSettingsChanged();
		});

	}
]);

rpUserControllers.controller('rpUserTabsCtrl', ['$scope', '$rootScope', 'rpUserTabsUtilService', 'rpUserSortButtonUtilService',

	function($scope, $rootScope, rpUserTabsUtilService, rpUserSortButtonUtilService) {

		selectTab();
		var firstLoadOver = false;

		$scope.tabClick = function(tab) {
			console.log('[rpUserTabsCtrl] tabClick(), tab: ' + tab);

			if (firstLoadOver) {
				console.log('[rpUserTabsCtrl] tabClick() firstloadOver.');
				$rootScope.$emit('user_tab_click', tab);
				rpUserTabsUtilService.setTab(tab);

			} else {
				console.log('[rpUserTabsCtrl] tabClick() firstload.');
				firstLoadOver = true;
			}
		};

		var deregisterUserTabChange = $rootScope.$on('user_tab_change', function(e, tab){
			console.log('[rpUserTabsCtrl] user_tab_change');

			selectTab();
		});

		function selectTab() {

			var tab = rpUserTabsUtilService.tab;
			console.log('[rpUserTabsCtrl] selectTab(), tab: ' + tab);

			if (tab === 'overview' || tab === 'submitted' || tab === 'comments') {
				rpUserSortButtonUtilService.show();
			} else {
				rpUserSortButtonUtilService.hide();
			}

			switch(tab) {

				case 'overview':
					$scope.selectedIndex = 0;
					break;
				case 'submitted':
					$scope.selectedIndex = 1;
					break;
				case 'comments':
					$scope.selectedIndex = 2;
					break;
				case 'gilded':
					$scope.selectedIndex = 3;
					break;

				case 'upvoted':
					$scope.selectedIndex = 4;
					break;
				case 'downvoted':
					$scope.selectedIndex = 5;
					break;
				case 'hidden':
					$scope.selectedIndex = 6;
					break;
				case 'saved':
					$scope.selectedIndex = 7;
					break;

				default:
					$scope.selectedIndex = 0;
					break;
			}
		}

		$scope.$on('$destroy', function() {
			deregisterUserTabChange();
		});
	}
]);

rpUserControllers.controller('rpUserSortCtrl', ['$scope', '$rootScope', '$routeParams', 'rpUserFilterButtonUtilService',
	function($scope, $rootScope, $routeParams, rpUserFilterButtonUtilService) {

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
			console.log('[rpUserSortCtrl] onRouteChangeSuccess, $routeParams: ' + JSON.stringify($routeParams));
			$scope.userSort = $routeParams.sort || 'new';

		});

		$scope.selectSort = function(value) {
			console.log('[rpUserSortCtrl] selectSort()');

			if (value === 'top' || value === 'controversial') {
				rpUserFilterButtonUtilService.show();
			} else {
				rpUserFilterButtonUtilService.hide();
			}

			$rootScope.$emit('user_sort_click', value);
		};

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});

	}
]);

rpUserControllers.controller('rpUserTimeFilterCtrl', ['$scope', '$rootScope', '$routeParams',
	function($scope, $rootScope, $routeParams) {

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
			console.log('[rpUserTimeFilterCtrl] onRouteChangeSuccess, $routeParams: ' + JSON.stringify($routeParams));
			$scope.userTime = $routeParams.t || 'all';
		});

		$scope.selectTime = function(value){
			console.log('[rpUserTimeFilterCtrl] selectTime()');

			$rootScope.$emit('user_t_click', value);
		};

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});
	}
]);
