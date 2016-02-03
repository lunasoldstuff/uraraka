'use strict';

var rpPostControllers = angular.module('rpPostControllers', []);

rpPostControllers.controller('rpPostsCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$window',
	'$filter',
	'$timeout',
	'$q',
	'rpPostsUtilService',
	'rpTitleChangeService',
	'rpUserFilterButtonUtilService',
	'rpUserSortButtonUtilService',
	'rpSubscribeButtonUtilService',
	'rpSettingsUtilService',
	'rpSubredditsUtilService',
	'rpLocationUtilService',
	'rpSearchFormUtilService',
	'rpSearchFilterButtonUtilService',
	'rpSidebarButtonUtilService',
	'rpToolbarShadowUtilService',
	'rpAuthUtilService',
	'rpIdentityUtilService',
	'rpPostFilterButtonUtilService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		$window,
		$filter,
		$timeout,
		$q,
		rpPostsUtilService,
		rpTitleChangeService,
		rpUserFilterButtonUtilService,
		rpUserSortButtonUtilService,
		rpSubscribeButtonUtilService,
		rpSettingsUtilService,
		rpSubredditsUtilService,
		rpLocationUtilService,
		rpSearchFormUtilService,
		rpSearchFilterButtonUtilService,
		rpSidebarButtonUtilService,
		rpToolbarShadowUtilService,
		rpAuthUtilService,
		rpIdentityUtilService,
		rpPostFilterButtonUtilService


	) {

		console.log('[rpPostsCtrl] Loaded.');

		var tabs = [{
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
		}];

		console.log('[rpPostCtrl] about to emit rp_tabs_changed, tabs: ' + tabs);

		$rootScope.$emit('rp_tabs_changed', tabs);
		$rootScope.$emit('rp_tabs_show');

		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpSearchFormUtilService.hide();
		rpSearchFilterButtonUtilService.hide();
		rpToolbarShadowUtilService.hide();

		var sub = $scope.subreddit = $routeParams.sub;
		console.log('[rpPostsCtrl] sub: ' + sub);

		$scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';
		console.log('[rpPostsCtrl] $scope.sort: ' + $scope.sort);

		var t = $routeParams.t ? $routeParams.t : 'week';
		var loadingMore = false;
		$scope.showSub = true;
		var limit = 24;

		for (var i = 0; i < tabs.length; i++) {
			if ($scope.sort === tabs[i].value) {
				$rootScope.$emit('rp_tabs_selected_index_changed', i);

				if (i === 3 || i === 4) {
					rpPostFilterButtonUtilService.show();
				} else {
					rpPostFilterButtonUtilService.hide();
				}

				break;
			}
		}

		if (sub && sub !== 'all' && sub !== 'random') {
			$scope.showSub = false;
			rpTitleChangeService.prepTitleChange('r/' + sub);
			rpSubredditsUtilService.setSubreddit(sub);
			rpSubscribeButtonUtilService.show();
			rpSidebarButtonUtilService.show();
			console.log('[rpPostsCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
		} else {
			rpSubscribeButtonUtilService.hide();
			rpSidebarButtonUtilService.hide();
			$scope.showSub = true;
			rpTitleChangeService.prepTitleChange('frontpage');
			console.log('[rpPostsCtrl] (no sub)rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
		}

		if (rpAuthUtilService.isAuthenticated) {
			rpIdentityUtilService.getIdentity(function(identity) {
				$scope.identity = identity;
			});
		}

		loadPosts();

		/**
		 * EVENT HANDLERS
		 */

		var deregisterTClick = $rootScope.$on('t_click', function(e, time) {
			t = time;

			if (sub) {
				rpLocationUtilService(null, '/r/' + sub + '/' + $scope.sort, 't=' + t, false, false);

			} else {
				rpLocationUtilService(null, $scope.sort, 't=' + t, false, false);
			}

			loadPosts();

		});

		/**
		 * CONTROLLER API
		 * */

		$scope.thisController = this;

		this.completeDeleting = function(id) {
			console.log('[rpPostCtrl] this.completeDeleting()');

			$scope.posts.forEach(function(postIterator, i) {
				if (postIterator.data.name === id) {
					$scope.posts.splice(i, 1);
				}

			});

		};

		var deregisterTabClick = $rootScope.$on('rp_tab_click', function(e, tab) {
			console.log('[rpPostsCtrl] onTabClick(), tab: ' + tab);

			// if (ignoredFirstTabClick) {
			$scope.posts = {};
			$scope.noMorePosts = false;
			$scope.sort = tab;

			if (sub) {
				rpLocationUtilService(null, '/r/' + sub + '/' + $scope.sort, '', false, false);
			} else {
				rpLocationUtilService(null, $scope.sort, '', false, false);
			}

			if (tab === 'top' || tab === 'controversial') {
				rpPostFilterButtonUtilService.show();
			} else {
				rpPostFilterButtonUtilService.hide();
			}

			loadPosts();


		});

		/**
		 * SCOPE FUNCTIONS
		 * */

		/*
			Load more posts using the 'after' parameter.
		 */
		$scope.morePosts = function() {
			console.log('[rpPostsCtrl] morePosts() loadingMore: ' + loadingMore);
			if ($scope.posts && $scope.posts.length > 0) {
				var lastPostName = $scope.posts[$scope.posts.length - 1].data.name;
				if (lastPostName && !loadingMore) {
					loadingMore = true;
					$rootScope.$emit('progressLoading');
					// $rootScope.$emit('rp_suspendable_suspend');

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
							// addPostsInBatches(data.get.data.children, 3);

							loadingMore = false;
							// $rootScope.$emit('rp_suspendable_resume');

						}
					});

				}
			}
		};

		$scope.showContext = function(e, post) {
			console.log('[rpPostsCtrl] showContext()');

			rpLocationUtilService(e, '/r/' + post.data.subreddit +
				'/comments/' +
				$filter('rp_name_to_id36')(post.data.link_id) +
				'/' + post.data.id + '/', 'context=8', true, false);
		};

		/*
			Load Posts
		 */
		function loadPosts() {
			$scope.posts = {};
			$scope.havePosts = false;
			$scope.noMorePosts = false;
			$rootScope.$emit('progressLoading');


			rpPostsUtilService(sub, $scope.sort, '', t, limit, function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpPostsCtrl] err.status: ' + JSON.stringify(err.status));

				} else {

					$scope.havePosts = true;

					console.log('[rpPostsCtrl] data.length: ' + data.get.data.children.length);
					/*
						detect end of subreddit.
					 */
					if (data.get.data.children.length < limit) {
						$scope.noMorePosts = true;
					}

					$scope.posts = data.get.data.children;
					// addPostsInBatches(data.get.data.children, 1);
				}
			});

		}


		function addBatch(first, last, posts) {
			console.log('[rpPostCtrl] addBatch(), first: ' + first + ', last: ' + last + ', $scope.posts.length: ' + $scope.posts.length);

			if ($scope.posts.length > 0) {
				$scope.posts = Array.prototype.concat.apply($scope.posts, posts.slice(first, last));
			} else {
				$scope.posts = posts.slice(first, last);
			}

			return $timeout(angular.noop, 0);
		}

		function addPostsInBatches(posts, batchSize) {
			console.log('[rpPostCtrl] addPostsInBatches(), posts.length: ' + posts.length + ', batchSize: ' + batchSize);
			var addNextBatch;
			var addPostsAndRender = $q.when();

			for (var i = 0; i < posts.length; i += batchSize) {
				addNextBatch = angular.bind(null, addBatch, i, Math.min(i + batchSize, posts.length), posts);
				addPostsAndRender = addPostsAndRender.then(addNextBatch);

			}

			return addPostsAndRender;
		}

		$scope.$on('$destroy', function() {
			console.log('[rpPostsCtrl] $destroy, $scope.subreddit: ' + $scope.subreddit);
			deregisterTClick();
			deregisterTabClick();
			$rootScope.$emit('rp_tabs_hide');
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

		$scope.newLink = function(e) {
			if (rpAuthUtilService.isAuthenticated) {

				if (rpSettingsUtilService.settings.submitDialog) {
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

				if (rpSettingsUtilService.settings.submitDialog) {
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

		$scope.$on('$destroy', function() {});

	}
]);