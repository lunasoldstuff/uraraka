'use strict';

var rpUserControllers = angular.module('rpUserControllers', []);

rpUserControllers.controller('rpUserCtrl', [
	'$scope',
	'$rootScope',
	'$window',
	'$routeParams',
	'rpUserUtilService',
	'rpTitleChangeService',
	'rpSettingsUtilService',
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
	'rpUserSortButtonUtilService',

	function(
		$scope,
		$rootScope,
		$window,
		$routeParams,
		rpUserUtilService,
		rpTitleChangeService,
		rpSettingsUtilService,
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
		rpSidebarButtonUtilService,
		rpUserSortButtonUtilService

	) {

		console.log('[rpUserCtrl] loaded.');
		console.log('[rpUserCtrl] $routeParams: ' + JSON.stringify($routeParams));

		$scope.tabs = [{
			name: 'overview'
		}, {
			name: 'submitted'
		}, {
			name: 'comments'
		}, {
			name: 'gilded'
		}];

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

		if (rpAuthUtilService.isAuthenticated) {
			rpIdentityUtilService.getIdentity(function(identity) {

				$scope.isMe = (username === identity.name);

				if ($scope.isMe) {

					//If user is viewing their own User page add restricted tabs.
					$scope.tabs = $scope.tabs.concat([{
						name: 'upvoted'
					}, {
						name: 'downvoted'
					}, {
						name: 'hidden'
					}, {
						name: 'saved'
					}]);

				} else {

					//If User is not viewing their own User page
					//disallow them from accessing any tabs other than
					//the default.
					if (where === 'upvoted' || where === 'downvoted' || where === 'hidden' || where === 'saved') {
						where = 'overview';
						rpLocationUtilService(null, '/u/' + username + '/' + where, '', false, true);
					}

				}

				console.log('[rpUserCtrl] $scope.isMe: ' + $scope.isMe);
				console.log('[rpUserCtrl] where: ' + where);

				//with where set correctly set the selected tab.
				for (var i = 0; i < $scope.tabs.length; i++) {
					if (where === $scope.tabs[i].name) {
						$scope.selectedTab = i;
						console.log('[rpUserCtrl] selectedTab: ' + $scope.selectedTab);
						break;
					}
				}

				loadPosts();

			});
		} else { //not logged in

			console.log('[rpUserCtrl] where: ' + where);
			$scope.isMe = false;

			if (where === 'upvoted' || where === 'downvoted' || where === 'hidden' || where === 'saved') {
				where = 'overview';
				rpLocationUtilService(null, '/u/' + username + '/' + where, '', false, true);
			}

			for (var i = 0; i < $scope.tabs.length; i++) {
				if (where === $scope.tabs[i].name) {
					$scope.selectedTab = i;
					break;
				}
			}

			loadPosts();

		}

		/**
		 * Load Posts
		 */
		function loadPosts() {

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

		}

		/**
		 * EVENT HANDLERS
		 * */

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function(data) {
			$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;
		});

		var deregisterUserSortClick = $rootScope.$on('user_sort_click', function(e, s) {
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

		var deregisterUserTClick = $rootScope.$on('user_t_click', function(e, time) {
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

		var ignoredFirstTabClick = false;

		this.tabClick = function(tab) {
			console.log('[rpUserCtrl] this.tabClick(), tab: ' + tab);

			if (ignoredFirstTabClick) {
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
			} else {
				ignoredFirstTabClick = true;
			}


			if (tab === 'overview' || tab === 'submitted' || tab === 'comments') {
				rpUserSortButtonUtilService.show();
			} else {
				rpUserSortButtonUtilService.hide();
			}


		};


		/**
		 * SCOPE FUNCTIONS
		 * */

		$scope.morePosts = function() {
			console.log('[rpUserCtrl] morePosts()');

			if ($scope.posts && $scope.posts.length > 0) {

				var lastPostName = $scope.posts[$scope.posts.length - 1].data.name;

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

		$scope.$on('$destroy', function() {
			deregisterUserTClick();
			deregisterUserSortClick();
			deregisterUserTabClick();
			deregisterSettingsChanged();
		});

	}
]);
//
// rpUserControllers.controller('rpUserTabsCtrl', ['$scope', '$rootScope', 'rpUserTabsUtilService', 'rpUserSortButtonUtilService',
//
// 	function($scope, $rootScope, rpUserTabsUtilService, rpUserSortButtonUtilService) {
//
// 		selectTab();
// 		var firstLoadOver = false;
//
// 		$scope.tabClick = function(tab) {
// 			console.log('[rpUserTabsCtrl] tabClick(), tab: ' + tab);
//
// 			if (firstLoadOver) {
// 				console.log('[rpUserTabsCtrl] tabClick() firstloadOver.');
// 				$rootScope.$emit('user_tab_click', tab);
// 				rpUserTabsUtilService.setTab(tab);
//
// 			} else {
// 				console.log('[rpUserTabsCtrl] tabClick() firstload.');
// 				firstLoadOver = true;
// 			}
// 		};
//
// 		var deregisterUserTabChange = $rootScope.$on('user_tab_change', function(e, tab) {
// 			console.log('[rpUserTabsCtrl] user_tab_change');
//
// 			selectTab();
// 		});
//
// 		function selectTab() {
//
// 			var tab = rpUserTabsUtilService.tab;
// 			console.log('[rpUserTabsCtrl] selectTab(), tab: ' + tab);
//
// 			if (tab === 'overview' || tab === 'submitted' || tab === 'comments') {
// 				rpUserSortButtonUtilService.show();
// 			} else {
// 				rpUserSortButtonUtilService.hide();
// 			}
//
// 			switch (tab) {
//
// 				case 'overview':
// 					$scope.selectedIndex = 0;
// 					break;
// 				case 'submitted':
// 					$scope.selectedIndex = 1;
// 					break;
// 				case 'comments':
// 					$scope.selectedIndex = 2;
// 					break;
// 				case 'gilded':
// 					$scope.selectedIndex = 3;
// 					break;
//
// 				case 'upvoted':
// 					$scope.selectedIndex = 4;
// 					break;
// 				case 'downvoted':
// 					$scope.selectedIndex = 5;
// 					break;
// 				case 'hidden':
// 					$scope.selectedIndex = 6;
// 					break;
// 				case 'saved':
// 					$scope.selectedIndex = 7;
// 					break;
//
// 				default:
// 					$scope.selectedIndex = 0;
// 					break;
// 			}
// 		}
//
// 		$scope.$on('$destroy', function() {
// 			deregisterUserTabChange();
// 		});
// 	}
// ]);

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

		$scope.selectTime = function(value) {
			console.log('[rpUserTimeFilterCtrl] selectTime()');

			$rootScope.$emit('user_t_click', value);
		};

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});
	}
]);