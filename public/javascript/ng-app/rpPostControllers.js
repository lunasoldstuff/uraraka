'use strict';

var rpPostControllers = angular.module('rpPostControllers', []);

rpPostControllers.controller('rpPostsCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$log',
		'$window',
		'$location',
		'$timeout',
		'rpPostsService',
		'rpTitleChangeService',
		'rpSubredditService',
		'$mdToast',
		'$mdDialog',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',
		'rpPostsTabUtilService',

		function($scope, $rootScope, $routeParams, $log, $window, $location, $timeout, rpPostsService, rpTitleChangeService, 
			rpSubredditService, $mdToast, $mdDialog, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService, rpPostTabsUtilService) {

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
			var t = $routeParams.t ? $routeParams.t : '';
			var loadingMore = false;
			$scope.showSub = true;
			$scope.havePosts = false;

			rpPostTabsUtilService.setTab(sort);

			if (sub == 'all'){
				$scope.showSub = true;
				rpTitleChangeService.prepTitleChange('reddit: the frontpage of the internet');
			}
			else{
				$scope.showSub = false;
				rpTitleChangeService.prepTitleChange('r/' + sub);
			}
			rpSubredditService.prepSubredditChange(sub);

			/*
				Loading Posts
			 */
			$rootScope.$emit('progressLoading');
			rpPostsService.query({sub: sub, sort: sort, t: t}, function(data){
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

				$location.path('/r/' + sub + '/' + sort, false).search('t=' + t);

				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;

				rpPostsService.query({sub: sub, sort: sort, t: t}, function(data) {

					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
					
				});

			});

			$rootScope.$on('posts_tab_click', function(e, tab){
				
				sort = tab;
				$location.path('/r/' + sub + '/' + sort, false);

				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;
				rpPostsService.query({sub: sub, sort: sort, t: t}, function(data) {
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

			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();

			});

		};
	}
]);

rpPostControllers.controller('rpPostsTabsCtrl', ['$scope', '$rootScope', 'rpPostsTabUtilService', 'rpPostFilterButtonUtilService',
	function($scope, $rootScope, rpPostsTabUtilService, rpPostFilterButtonUtilService) {

		selectTab();

		$rootScope.$on('posts_tab_change', function(e, tab){

			selectTab();

		});

		$scope.tabClick = function(tab) {
			$rootScope.$emit('posts_tab_click', tab);
			rpPostsTabUtilService.setTab(tab);
		};

		function selectTab() {

			var tab = rpPostsTabUtilService.tab;

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
				default:
					$scope.selectedIndex = 0;
					break;
			}			
		}
	}
]);

rpPostControllers.controller('rpPostsTimeFilterCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {
		$scope.selectTime = function(value){
			$rootScope.$emit('t_click', value);
		};
	}
]);