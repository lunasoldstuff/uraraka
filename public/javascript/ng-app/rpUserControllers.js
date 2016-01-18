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



		var tabs = [{
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
		}];

		$rootScope.$emit('rp_tabs_changed', tabs);

		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpSearchFormUtilService.hide();
		rpSearchFilterButtonUtilService.hide();
		rpToolbarShadowUtilService.hide();
		rpSidebarButtonUtilService.hide();

		var loadingMore = false;
		var limit = 24;

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
					tabs = tabs.concat([{
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

					$rootScope.$emit('rp_tabs_changed', tabs);

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
				for (var i = 0; i < tabs.length; i++) {
					if (where === tabs[i].value) {
						$rootScope.$emit('rp_tabs_selected_index_changed', i);
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

			for (var i = 0; i < tabs.length; i++) {
				if (where === tabs[i].value) {
					$rootScope.$emit('rp_tabs_selected_index_changed', i);
					break;
				}
			}

			loadPosts();


		}

		/**
		 * EVENT HANDLERS
		 * */

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function(data) {
			$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;
		});

		var deregisterUserSortClick = $rootScope.$on('user_sort_click', function(e, s) {
			console.log('[rpUserCtrl] user_sort_click');
			sort = s;

			rpLocationUtilService(null, '/u/' + username + '/' + where, 'sort=' + sort, false, false);

			if (sort === 'top' || sort === 'controversial') {
				rpUserFilterButtonUtilService.show();
			} else {
				rpUserFilterButtonUtilService.hide();
			}

			loadPosts();

		});

		var deregisterUserTClick = $rootScope.$on('user_t_click', function(e, time) {
			console.log('[rpUserCtrl] user_t_click');
			t = time;

			rpLocationUtilService(null, '/u/' + username + '/' + where, 'sort=' + sort + '&t=' + t, false, false);

			loadPosts();

		});

		var deregisterTabClick = $rootScope.$on('rp_tab_click', function(e, tab) {
			console.log('[rpUserCtrl] this.tabClick(), tab: ' + tab);

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

			if (tab === 'overview' || tab === 'submitted' || tab === 'comments') {
				rpUserSortButtonUtilService.show();
			} else {
				rpUserSortButtonUtilService.hide();
			}


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

		/**
		 * Load Posts
		 */
		function loadPosts() {

			console.log('[rpUserCtrl] loadPosts()');

			$scope.posts = {};
			$scope.havePosts = false;
			$scope.noMorePosts = false;

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

		$scope.$on('$destroy', function() {
			deregisterUserTClick();
			deregisterUserSortClick();
			deregisterSettingsChanged();
			deregisterTabClick();
			$rootScope.$emit('rp_tabs_hide');
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

		$scope.selectTime = function(value) {
			console.log('[rpUserTimeFilterCtrl] selectTime()');

			$rootScope.$emit('user_t_click', value);
		};

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});
	}
]);