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
	'rpTitleChangeUtilService',
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
	'rpRefreshButtonUtilService',
	'rpPostSortButtonUtilService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		$window,
		$filter,
		$timeout,
		$q,
		rpPostsUtilService,
		rpTitleChangeUtilService,
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
		rpPostFilterButtonUtilService,
		rpRefreshButtonUtilService,
		rpPostSortButtonUtilService

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

		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpSearchFormUtilService.hide();
		rpSearchFilterButtonUtilService.hide();
		rpToolbarShadowUtilService.hide();
		rpRefreshButtonUtilService.hide();
		rpPostSortButtonUtilService.show();

		$scope.subreddit = $routeParams.sub;
		console.log('[rpPostsCtrl] $scope.subreddit: ' + $scope.subreddit);

		$scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';
		console.log('[rpPostsCtrl] $scope.sort: ' + $scope.sort);

		var t = $routeParams.t ? $routeParams.t : 'week';
		var loadingMore = false;
		$scope.showSub = true;

		var loadLimit = 18;
		// var loadLimit = 96;

		var moreLimit = 18;

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

		if (angular.isUndefined($scope.subreddit)) {
			rpTitleChangeUtilService('frontpage', true, true);

		} else if ($scope.subreddit === 'all') {
			rpTitleChangeUtilService('r/all', true, true);

		}

		if (angular.isUndefined($scope.subreddit) || $scope.subreddit === 'all') {
			rpSubscribeButtonUtilService.hide();
			$scope.showSub = true;
			rpSidebarButtonUtilService.hide();

		}

		if (!angular.isUndefined($scope.subreddit) && $scope.subreddit !== 'all') {
			$scope.showSub = false;
			rpTitleChangeUtilService('r/' + $scope.subreddit, true, true);
			rpSubredditsUtilService.setSubreddit($scope.subreddit);
			rpSubscribeButtonUtilService.show();
			rpSidebarButtonUtilService.show();

		}

		console.log('[rpPostsCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);

		if (rpAuthUtilService.isAuthenticated) {
			rpIdentityUtilService.getIdentity(function(identity) {
				$scope.identity = identity;
			});
		}

		//used to only add posts for the current load opertaion.
		//needs to be set before loadPosts is called.
		var currentLoad = 0;

		loadPosts();

		/**
		 * EVENT HANDLERS
		 */

		var deregisterTClick = $rootScope.$on('t_click', function(e, time) {
			t = time;

			if ($scope.subreddit) {
				rpLocationUtilService(null, '/r/' + $scope.subreddit + '/' + $scope.sort, 't=' + t, false, false);

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

		var deregisterTabClick = $rootScope.$on('rp_post_sort_click', function(e, sort) {
			console.log('[rpPostsCtrl] onTabClick(), tab: ' + sort);

			$scope.posts = {};
			$scope.noMorePosts = false;
			$scope.sort = sort;

			if ($scope.subreddit) {
				rpLocationUtilService(null, '/r/' + $scope.subreddit + '/' + $scope.sort, '', false, false);
			} else {
				rpLocationUtilService(null, $scope.sort, '', false, false);
			}

			if (sort === 'top' || sort === 'controversial') {
				rpPostFilterButtonUtilService.show();
			} else {
				rpPostFilterButtonUtilService.hide();
			}

			loadPosts();

		});

		var deregisterRefresh = $rootScope.$on('rp_refresh', function() {
			console.log('[rpPostsCtrl] rp_refresh');
			rpRefreshButtonUtilService.startSpinning();
			loadPosts();
		});

		/**
		 * SCOPE FUNCTIONS
		 * */

		/*
			Load more posts using the 'after' parameter.
		 */

		$scope.cardClick = function() {
			console.log('[rpPostsCtrl] cardClick()');
		};

		$scope.showContext = function(e, post) {
			console.log('[rpPostsCtrl] showContext()');

			rpLocationUtilService(e, '/r/' + post.data.subreddit +
				'/comments/' +
				$filter('rp_name_to_id36')(post.data.link_id) +
				'/' + post.data.id + '/', 'context=8', true, false);
		};

		var afterPost = 1;

		$scope.morePosts = function(after) {
			console.log('[rpPostsCtrl] morePosts(), loadingMore: ' + loadingMore);

			if ($scope.posts && $scope.posts.length > 0) {

				// calculating the last post to use as after in posts request

				//use if there are ads in the page
				// var lastPost;
				//
				// for (var i = $scope.posts.length - 1; i > 0; i--) {
				//     if (!$scope.posts[i].isAd) {
				//         lastPost = $scope.posts[i];
				//         break;
				//     }
				// }
				//
				// var lastPostName = lastPost.data.name;

				//use if there are no ads
				var lastPostName = $scope.posts[$scope.posts.length - afterPost].data.name;

				console.log('[rpPostsCtrl] morePosts(), 1, lastPostName: ' + lastPostName + ', loadingMore: ' + loadingMore);
				if (lastPostName && !loadingMore) {
					console.log('[rpPostsCtrl] morePosts(), 2');
					loadingMore = true;
					$rootScope.$emit('rp_progress_start');
					// $rootScope.$emit('rp_suspendable_suspend');

					var thisLoad = ++currentLoad;

					rpPostsUtilService($scope.subreddit, $scope.sort, lastPostName, t, moreLimit, function(err, data) {

						console.log('[rpPostsCtrl] load-tracking morePosts(), thisLoad: ' + thisLoad + ', currentLoad: ' + currentLoad);

						if (thisLoad === currentLoad) {
							console.log('[rpPostsCtrl] morePosts(), 3');

							$rootScope.$emit('rp_progress_stop');

							if (err) {
								console.log('[rpPostsCtrl] err');
							} else {
								console.log('[rpPostsCtrl] morePosts(), data.length: ' + data.get.data.children.length);

								if (data.get.data.children.length < moreLimit) {
									$scope.noMorePosts = true;
								} else {
									$scope.noMorePosts = false;
								}

								if (data.get.data.children.length > 0) {

									// // insert ads
									// for (var i = 1; i < data.get.data.children.length; i++) {
									//     if (i % 5 === 0) {
									//         data.get.data.children.splice(i, 0, {
									//             isAd: true
									//         });
									//     } else {
									//         data.get.data.children[i].isAd = false;
									//     }
									// }

									afterPost = 1;
									addPosts(data.get.data.children, true);
								} else {
									console.log('[rpPostsCtrl] morePosts(), no more posts error, data: ' + JSON.stringify(data));
									loadingMore = false;
									afterPost++;
									$scope.morePosts();
								}

								// Array.prototype.push.apply($scope.posts, data.get.data.children);
								// addPostsInBatches(data.get.data.children, 6);

								// $rootScope.$emit('rp_suspendable_resume');

							}

						}

						loadingMore = false;

					});

				} else if (loadingMore === true) {
					$rootScope.$emit('rp_progress_start');
				}
			}
		};


		/*
			Load Posts
		 */


		function loadPosts() {

			var thisLoad = ++currentLoad;

			$scope.posts = [];
			$scope.havePosts = false;
			$scope.noMorePosts = false;
			$rootScope.$emit('rp_progress_start');
			// rpRefreshButtonUtilService.hide();

			rpPostsUtilService($scope.subreddit, $scope.sort, '', t, loadLimit, function(err, data) {

				console.log('[rpPostsCtrl] load-tracking loadPosts(), currentLoad: ' + currentLoad + ', thisLoad: ' + thisLoad);

				if (thisLoad === currentLoad) {
					$rootScope.$emit('rp_progress_stop');

					if (err) {
						console.log('[rpPostsCtrl] err.status: ' + JSON.stringify(err.status));

					} else {

						$scope.havePosts = true;
						rpRefreshButtonUtilService.show();
						rpRefreshButtonUtilService.stopSpinning();


						console.log('[rpPostsCtrl] data.length: ' + data.get.data.children.length);
						/*
						detect end of subreddit.
						*/
						if (data.get.data.children.length < loadLimit) {
							$scope.noMorePosts = true;
						}

						if (data.get.data.children.length > 0) {

							if ($scope.subreddit === 'random') {
								console.log('[rpPostCtrl] loadPosts() random, subreddit: ' + $scope.subreddit);
								$scope.subreddit = data.get.data.children[0].data.subreddit;
								console.log('[rpPostCtrl] loadPosts() random, subreddit: ' + $scope.subreddit);
								rpTitleChangeUtilService('r/' + $scope.subreddit, true, true);
								rpLocationUtilService(null, '/r/' + $scope.subreddit, '', false, true);
							}

							// insert an ads.
							// for (var i = 1; i < data.get.data.children.length; i++) {
							//     if (i % 5 === 0) {
							//         data.get.data.children.splice(i, 0, {
							//             isAd: true
							//         });
							//     } else {
							//         data.get.data.children[i].isAd = false;
							//     }
							// }

							addPosts(data.get.data.children, false);

							$timeout(function() {
								$window.prerenderReady = true;

							}, 30000);

						}

						// for (var i = 0; i < data.get.data.children.length; i++) {
						//
						//
						//
						// 	var shortestColumn = getShortestColumn();
						// 	console.log('[rpPostsCtrl] adding post ' + i + ' to column ' + shortestColumn);
						// 	data.get.data.children[i].column = getShortestColumn();
						// 	// Array.prototype.push.apply($scope.posts, data.get.data.children[i]);
						// 	// $scope.posts.push(data.get.data.children[i]);
						//
						// 	$timeout(addPost(data.get.data.children[i]));
						//
						// 	// $scope.$digest();
						//
						//
						//
						// }




						// Array.prototype.push.apply($scope.posts, data.get.data.children);
						// $scope.posts = data.get.data.children;
						// addPostsInBatches(data.get.data.children, 1);
					}

				}

			});

		}

		function addPosts(posts, putInShortest) {
			var duplicate = false;

			for (var i = 0; i < $scope.posts.length; i++) {
				// if ($scope.posts[i].isAd === false && post.isAd === false) {
				//     if ($scope.posts[i].data.id === post.data.id) {
				if ($scope.posts[i].data.id === posts[0].data.id) {
					console.log('[rpPostsCtrl] addPosts, duplicate post detected, $scope.posts[i].data.id: ' + $scope.posts[i].data.id);
					duplicate = true;
					break;
				}
				// }
			}

			var post = posts.shift();

			if (!duplicate) {
				post.column = getColumn(putInShortest);
				$scope.posts.push(post);

			}

			$timeout(function() {
				if (posts.length > 0) {
					addPosts(posts, putInShortest);
				}

			}, 200);

		}

		function getColumn(putInShortest) {

			// console.time('getShortestColumn');

			// var columns = angular.element('.rp-posts-col');
			var columns = angular.element('.rp-col-wrapper');

			var shortestColumn;
			var shortestHeight;

			if (putInShortest) {
				columns.each(function(i) {
					var thisHeight = jQuery(this).height();
					if (angular.isUndefined(shortestColumn) || thisHeight < shortestHeight) {
						shortestHeight = thisHeight;
						shortestColumn = i;
					}
				});

				return shortestColumn;

			} else {
				return $scope.posts.length % columns.length;
			}

			// console.log('[rpPostsCtrl] getShortestColumn(), shortestColumn: ' + shortestColumn + ', shortestHeight: ' + shortestHeight);

			// console.timeEnd('getShortestColumn');

		}

		var deregisterWindowResize = $rootScope.$on('rp_window_resize', function(e, to) {

			if (!angular.isUndefined($scope.posts)) {
				for (var i = 0; i < $scope.posts.length; i++) {
					$scope.posts[i].column = i % to;
				}

			}


			// var posts = $scope.posts;
			// $scope.posts = [];
			// addPosts(posts);

		});


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
			deregisterWindowResize();
			deregisterRefresh();
			// $rootScope.$emit('rp_tabs_hide');
		});

	}
]);

rpPostControllers.controller('rpPostsTimeFilterCtrl', ['$scope', '$rootScope', '$routeParams',
	function($scope, $rootScope, $routeParams) {

		$scope.postTime = $routeParams.t || 'week';

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

rpPostControllers.controller('rpPostSortCtrl', ['$scope', '$rootScope', '$routeParams', 'rpPostFilterButtonUtilService',
	function($scope, $rootScope, $routeParams, rpPostFilterButtonUtilService) {

		$scope.postSort = $routeParams.sort || 'hot';

		console.log('[rpPostSortCtrl] $scope.postSort: ' + $scope.postSort);

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
			console.log('[rpPostSortCtrl] onRouteChangeSuccess, $routeParams: ' + JSON.stringify($routeParams));
			$scope.postSort = $routeParams.sort || 'hot';

		});

		$scope.selectSort = function(sort) {
			console.log('[rpPostSortCtrl] selectSort()');
			$rootScope.$emit('rp_post_sort_click', sort);
		};

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});

	}
]);
