(function() {
	'use strict';
	angular.module('rpPost').controller('rpPostCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		'$window',
		'$filter',
		'$timeout',
		'$q',
		'$location',
		'rpPostService',
		'rpAppTitleChangeService',
		'rpSettingsService',
		'rpSubredditsService',
		'rpAppLocationService',
		'rpAppAuthService',
		'rpIdentityService',
		rpPostCtrl
	]);

	function rpPostCtrl(
		$scope,
		$rootScope,
		$routeParams,
		$window,
		$filter,
		$timeout,
		$q,
		$location,
		rpPostService,
		rpAppTitleChangeService,
		rpSettingsService,
		rpSubredditsService,
		rpAppLocationService,
		rpAppAuthService,
		rpIdentityService

	) {

		console.log('[rpPostCtrl]');



		$rootScope.$emit('rp_hide_all_buttons');
		$rootScope.$emit('rp_button_visibility', 'showPostSort', true);
		$rootScope.$emit('rp_button_visibility', 'showLayout', true);
		$rootScope.$emit('rp_button_visibility', 'showSlideshow', true);


		$scope.subreddit = $routeParams.sub;
		console.log('[rpPostCtrl] $scope.subreddit: ' + $scope.subreddit);



		// console.log('[rpPostCtrl] $routeParams: ' + JSON.stringify($routeParams));
		// console.log('[rpPostCtrl] $location.path(): ' + $location.path());

		// var sortRe = /^\/(new|hot)$/;

		// var groups = sortRe.exec($location.path());

		// console.log('[rpPostCtrl] sortRe, groups: ' + groups);
		// // console.log('[rpPostCtrl] sortRe, groups[1]: ' + groups[1]);
		// // console.log('[rpPostCtrl] sortRe.exec($location.path())[1]: ' + sortRe.exec($location.path())[1]);

		// // if (angular.isDefined(groups)) {
		// if (groups !== null) {
		//     $scope.sort = groups[1];

		// } else {
		//     $scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';

		// }

		$scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';
		console.log('[rpPostCtrl] $scope.sort: ' + $scope.sort);

		//Check if sort is valid,
		// var sorts = ['hot', 'new', 'controversial', 'rising', 'top', 'gilded'];

		// console.log('[rpPostCtrl] scope.sort in sorts: ' + $scope.sort in sorts);

		// if (!$scope.sort in sorts) {
		//     $location.path('/error/404');
		// } else {

		// }



		// $scope.layout = rpSettingsService.settings.layout;
		// console.log('[rpPostControllers] $scope.layout: ' + $scope.layout);

		var t = $routeParams.t ? $routeParams.t : 'week';
		var loadingMore = false;
		$scope.showSub = true;

		// var loadLimit = 12;
		// var loadLimit = 24;
		var loadLimit = 48;
		var moreLimit = 24;
		var adFrequency = 15;
		var adCount = 0;

		if ($scope.sort === 'top' || $scope.sort === 'controversial') {
			$rootScope.$emit('rp_button_visibility', 'showPostTime', true);
		}

		if (angular.isUndefined($scope.subreddit)) {
			rpAppTitleChangeService('frontpage', true, true);

		} else if ($scope.subreddit === 'all') {
			rpAppTitleChangeService('r/all', true, true);

		}

		if (angular.isUndefined($scope.subreddit) || $scope.subreddit === 'all') {
			$rootScope.$emit('rp_button_visibility', 'showSubscribe', false);
			$scope.showSub = true;
			$rootScope.$emit('rp_button_visibility', 'showRules', false);
		}

		if (!angular.isUndefined($scope.subreddit) && $scope.subreddit !== 'all') {
			$scope.showSub = false;
			rpAppTitleChangeService('r/' + $scope.subreddit, true, true);
			rpSubredditsService.setSubreddit($scope.subreddit);
			$rootScope.$emit('rp_button_visibility', 'showSubscribe', true);
			$rootScope.$emit('rp_button_visibility', 'showRules', true);

		}

		console.log('[rpPostCtrl] rpSubredditsService.currentSub: ' + rpSubredditsService.currentSub);

		if (rpAppAuthService.isAuthenticated) {
			rpIdentityService.getIdentity(function(identity) {
				$scope.identity = identity;
			});
		}

		//used to only add posts for the current load opertaion.
		//needs to be set before loadPosts is called.
		var currentLoad = 0;

		$scope.layout = rpSettingsService.settings.layout;

		loadPosts();
		/**
		 * EVENT HANDLERS
		 */

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			console.log('[rpPostCtrl] rp_settings_changed');

			if ($scope.layout !== rpSettingsService.settings.layout) {
				$scope.layout = rpSettingsService.settings.layout;
				loadPosts();
			}

		});

		var deregisterPostTimeClick = $rootScope.$on('rp_post_time_click', function(e, time) {
			t = time;

			if ($scope.subreddit) {
				rpAppLocationService(null, '/r/' + $scope.subreddit + '/' + $scope.sort, 't=' + t, false, false);

			} else {
				rpAppLocationService(null, $scope.sort, 't=' + t, false, false);
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

		var deregisterHidePost = $scope.$on('rp_hide_post', function(e, id) {
			console.log('[rpPostCtrl] on rp_hide_post, id: ' + id);

			for (var i = 0; i < $scope.posts.length; i++) {
				if ($scope.posts[i].data.name === id) {
					console.log('[rpPostCtrl] on rp_hide_post, post to hide found, i: ' + i);
					console.log('[rpPostCtrl] before splice: ' + $scope.posts.length);
					var spliceResult = $scope.posts.splice(i, 1);
					console.log('[rpPostCtrl] after splice: ' + $scope.posts.length);
					console.log('[rpPostCtrl] splice result: ' + spliceResult);
				}
			}

			// $scope.posts.forEach(function(postIterator, i) {
			// 	if (postIterator.data.name === id) {
			// 		console.log('[rpPostCtrl] on rp_hide_post, post to hide found!');
			// 		// $timeout(angular.noop, 0);
			// 		$timeout(function() {
			// 			var spliceResult = $scope.posts.splice(i, 1);
			// 			console.log('[rpPostCtrl] splice result: ' + spliceResult);
			//
			// 		}, 0);
			// 	}
			//
			// });

		});

		var deregisterPostSortClick = $rootScope.$on('rp_post_sort_click', function(e, sort) {
			console.log('[rpPostCtrl] onTabClick(), tab: ' + sort);

			$scope.posts = {};
			$scope.noMorePosts = false;
			$scope.sort = sort;

			if ($scope.subreddit) {
				rpAppLocationService(null, '/r/' + $scope.subreddit + '/' + $scope.sort, '', false, false);
			} else {
				rpAppLocationService(null, $scope.sort, '', false, false);
			}

			if (sort === 'top' || sort === 'controversial') {
				$rootScope.$emit('rp_button_visibility', 'showPostTime', true);
			} else {
				$rootScope.$emit('rp_button_visibility', 'showPostTime', false);
			}

			loadPosts();

		});

		var deregisterRefresh = $rootScope.$on('rp_refresh', function() {
			console.log('[rpPostCtrl] rp_refresh');
			$rootScope.$emit('rp_refresh_button_spin', true);
			loadPosts();
		});

		/**
		 * SCOPE FUNCTIONS
		 * */

		/*
		    Load more posts using the 'after' parameter.
		 */

		$scope.cardClick = function() {
			console.log('[rpPostCtrl] cardClick()');
		};

		$scope.showContext = function(e, post) {
			console.log('[rpPostCtrl] showContext()');

			rpAppLocationService(e, '/r/' + post.data.subreddit +
				'/comments/' +
				$filter('rpAppNameToId36Filter')(post.data.link_id) +
				'/' + post.data.id + '/', 'context=8', true, false);
		};

		var afterPost = 1;

		$scope.morePosts = function(after) {
			console.log('[rpPostCtrl] morePosts(), loadingMore: ' + loadingMore);

			if ($scope.posts && $scope.posts.length > 0) {

				// calculating the last post to use as after in posts request

				//use if there are ads in the page
				var lastPost;

				for (var i = $scope.posts.length - 1; i > 0; i--) {
					if (!$scope.posts[i].isAd) {
						lastPost = $scope.posts[i];
						break;
					}
				}

				var lastPostName = lastPost.data.name;

				//use if there are no ads
				// var lastPostName = $scope.posts[$scope.posts.length - afterPost].data.name;

				console.log('[rpPostCtrl] morePosts(), 1, lastPostName: ' + lastPostName + ', loadingMore: ' + loadingMore);
				if (lastPostName && !loadingMore) {
					console.log('[rpPostCtrl] morePosts(), 2');
					loadingMore = true;
					$rootScope.$emit('rp_progress_start');
					// $rootScope.$emit('rp_suspendable_suspend');

					var thisLoad = ++currentLoad;

					rpPostService($scope.subreddit, $scope.sort, lastPostName, t, moreLimit, function(err, data) {

						console.log('[rpPostCtrl] load-tracking morePosts(), thisLoad: ' + thisLoad + ', currentLoad: ' + currentLoad);

						if (thisLoad === currentLoad) {
							console.log('[rpPostCtrl] morePosts(), 3');

							$rootScope.$emit('rp_progress_stop');

							if (err) {
								console.log('[rpPostCtrl] err');
							} else {
								console.log('[rpPostCtrl] morePosts(), data.length: ' + data.get.data.children.length);

								if (data.get.data.children.length < moreLimit) {
									$scope.noMorePosts = true;
								} else {
									$scope.noMorePosts = false;
								}

								if (data.get.data.children.length > 0) {

									// // insert ads
									// for (var i = 1; i < data.get.data.children.length; i++) {
									//     if (i % adFrequency === 0) {
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
									console.log('[rpPostCtrl] morePosts(), no more posts error, data: ' + JSON.stringify(data));
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

			rpPostService($scope.subreddit, $scope.sort, '', t, loadLimit, function(err, data) {

				console.log('[rpPostCtrl] load-tracking loadPosts(), currentLoad: ' + currentLoad + ', thisLoad: ' + thisLoad);

				if (thisLoad === currentLoad) {
					$rootScope.$emit('rp_progress_stop');

					if (err) {
						console.log('[rpPostCtrl] err.status: ' + JSON.stringify(err.status));

					} else {

						$scope.havePosts = true;
						$rootScope.$emit('rp_button_visibility', 'showRefresh', true);
						$rootScope.$emit('rp_refresh_button_spin', false);


						// console.log('[rpPostCtrl] data.get.data.children[0]: ' + JSON.stringify(data.get.data.children[0]));
						console.log('[rpPostCtrl] data.length: ' + data.get.data.children.length);
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
								rpAppTitleChangeService('r/' + $scope.subreddit, true, true);
								rpAppLocationService(null, '/r/' + $scope.subreddit, '', false, true);
							}

							// insert an ads.
							// for (var i = 1; i < data.get.data.children.length; i++) {
							//     if (i % adFrequency === 0) {
							//         data.get.data.children.splice(i, 0, {
							//             isAd: true
							//         });
							//     } else {
							//         data.get.data.children[i].isAd = false;
							//     }
							// }

							// add posts using addPosts()
							addPosts(data.get.data.children, false);

							// data.get.data.children[0].isAd = true;
							// data.get.data.children[1].isAd = true;
							// data.get.data.children[2].isAd = true;

							// add posts directly
							// console.log('[rpPostCtrl] add posts directly');
							// $scope.posts = data.get.data.children;
							// Array.prototype.push.apply($scope.posts, data.get.data.children);

							$timeout(function() {
								$window.prerenderReady = true;

							}, 10000);

						}

						// for (var i = 0; i < data.get.data.children.length; i++) {
						//
						//
						//
						// 	var shortestColumn = getShortestColumn();
						// 	console.log('[rpPostCtrl] adding post ' + i + ' to column ' + shortestColumn);
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

		//Adds a single post to scope,
		//calls itself to add next.
		function addPosts(posts, putInShortest) {

			console.log('[rpPostCtrl] addPosts, posts.length: ' + posts.length);

			// if ($scope.posts.length !== 0 && adCount < 3 && $scope.posts.length % adFrequency === 0) {
			//     console.log('[rpPostCtrl] addPosts(), insert ad');
			//
			//     $scope.posts.push({
			//         isAd: true,
			//         column: getColumn(putInShortest)
			//     });
			//
			//     adCount++;
			//
			// }

			var duplicate = false;

			if (!posts[0].data.hidden) {

				for (var i = 0; i < $scope.posts.length; i++) {
					if ($scope.posts[i].data.id === posts[0].data.id) {

						if ($scope.posts[i].data.id === posts[0].data.id) {
							console.log('[rpPostCtrl] addPosts, duplicate post detected, $scope.posts[i].data.id: ' + $scope.posts[i].data.id);
							duplicate = true;
							break;
						}
					}
				}


				var post = posts.shift();

				if (duplicate === false) {
					post.column = getColumn(putInShortest);
					$scope.posts.push(post);

				}

			}
			// addPosts(posts, putInShortest);

			$timeout(function() {
				if (posts.length > 0) {
					addPosts(posts, putInShortest);
				}

			}, 50);

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

			// console.log('[rpPostCtrl] getShortestColumn(), shortestColumn: ' + shortestColumn + ', shortestHeight: ' + shortestHeight);

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

		var deregisterSlideshowGetPost = $rootScope.$on('rp_slideshow_get_post', function(e, i, callback) {
			if (i >= $scope.posts.length / 2) {
				$scope.morePosts();
			}
			callback($scope.posts[i]);
		});

		var deregisterSlideshowGetShowSub = $rootScope.$on('rp_slideshow_get_show_sub', function(e, callback) {
			callback($scope.showSub);
		});

		$scope.$on('$destroy', function() {
			console.log('[rpPostCtrl] $destroy, $scope.subreddit: ' + $scope.subreddit);
			deregisterSlideshowGetPost();
			deregisterSlideshowGetShowSub();
			deregisterSettingsChanged();
			deregisterPostTimeClick();
			deregisterPostSortClick();
			deregisterWindowResize();
			deregisterRefresh();
			deregisterHidePost();
		});

	}

})();