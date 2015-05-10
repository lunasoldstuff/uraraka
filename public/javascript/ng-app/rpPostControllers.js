'use strict';

var rpPostControllers = angular.module('rpPostControllers', []);

rpPostControllers.controller('rpPostsCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$log',
		'$window',
		'$timeout',
		'rpPostsService',
		'rpTitleChangeService',
		'rpSubredditService',
		'$mdToast',
		'$mdDialog',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',

		function($scope, $rootScope, $routeParams, $log, $window, $timeout, rpPostsService, rpTitleChangeService, 
			rpSubredditService, $mdToast, $mdDialog, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService) {

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

			var sort = $routeParams.sort ? $routeParams.sort : 'hot';
			var sub = $routeParams.sub ? $routeParams.sub : 'all';
			var t;
			var loadingMore = false;
			$scope.showSub = true;
			$scope.havePosts = false;

			if (sub == 'all'){
				$scope.showSub = true;
				rpTitleChangeService.prepTitleChange('reddit: the frontpage of the internet');
			}
			else{
				$scope.showSub = false;
				rpTitleChangeService.prepTitleChange('r/' + sub);
			}
			rpSubredditService.prepSubredditChange(sub);

			$rootScope.$emit('tab_change', sort);

			/*
				Loading Posts
			 */

			$rootScope.$emit('progressLoading');
			rpPostsService.query({sub: sub, sort: sort}, function(data){
				$rootScope.$emit('progressComplete');
				$scope.posts = data;
				$scope.havePosts = true;

			});

			/*
				Load more posts using the 'after' parameter.
			 */
			$scope.morePosts = function() {
				if ($scope.posts && $scope.posts.length > 0){
					var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
					if(lastPostName && !loadingMore){
						loadingMore = true;
						$rootScope.$emit('progressLoading');
						rpPostsService.query({sub: sub, sort: sort, after: lastPostName, t: t}, function(data) {
							Array.prototype.push.apply($scope.posts, data);
							loadingMore = false;
							$rootScope.$emit('progressComplete');
						});
					}
				}
			};

			$rootScope.$on('t_click', function(e, time){
				t = time;
				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;

				rpPostsService.query({sub: sub, sort: sort, t: t}, function(data){
					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
				});
			});

			$rootScope.$on('tab_click', function(e, tab){
				sort = tab;
				$rootScope.$emit('tab_change', tab);
				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;
				rpPostsService.query({sub: sub, sort: sort}, function(data) {
					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
				});
			});

			$scope.savePost = function(post) {
				
				rpSaveUtilService(post);

			};

			$scope.upvotePost = function(post) {

				rpUpvoteUtilService(post);

			};
			
			$scope.downvotePost = function(post) {
				
				rpDownvoteUtilService(post);

			};

			$scope.showComments = function(e, post) {
				
				$mdDialog.show({
					controller: 'rpCommentsDialogCtrl',
					templateUrl: 'partials/rpCommentsDialog',
					targetEvent: e,
					// parent: angular.element('#rp-content'),
					locals: {
						post: post
					},
					clickOutsideToClose: true,
					escapeToClose: false

				});
			};

		}
	]
);

rpPostControllers.controller('rpPostReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {


		$scope.postReply = function(name, comment) {

			console.log('[rpPostReplyCtrl]');
			
			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();

			});

		};
	}
]);

rpPostControllers.controller('rpPostsTabsCtrl', ['$scope', '$rootScope', '$log', 'rpSubredditService',
	function($scope, $rootScope, $log, rpSubredditService) {
	// $scope.subreddit = 'all';
	$scope.selectedIndex = 0;

	// $scope.$on('handleSubredditChange', function(e, d){
	// 	$scope.subreddit = rpSubredditService.subreddit;
	// });

	$rootScope.$on('tab_change', function(e, tab){
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
			default:
				$scope.selectedIndex = 0;
				break;
		}
	});

	$scope.tabClick = function(tab) {
		$rootScope.$emit('tab_click', tab);
	};
	}
]);

rpPostControllers.controller('rpPostsTimeFilterCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {
		$scope.selectTime = function(value){
			$rootScope.$emit('t_click', value);
		};
	}
]);