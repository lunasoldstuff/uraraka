'use strict';

var rpCommentsControllers = angular.module('rpCommentsControllers', []);

rpCommentsControllers.controller('rpCommentsDialogCtrl', ['$scope', 'post',
	function($scope, post) {

		$scope.post = post;
		$scope.dialog = true;

	}
]);

rpCommentsControllers.controller('rpCommentsCtrl', 
		[
			'$scope', 
			'$rootScope', 
			'$routeParams', 
			'$location',
			'$mdDialog', 
			'rpCommentsService',
			'rpSaveUtilService',
			'rpUpvoteUtilService',
			'rpDownvoteUtilService',
			'rpCommentsTabUtilService',
			'rpTitleChangeService',
			'rpPostFilterButtonUtilService',
			'rpUserFilterButtonUtilService',
			'rpUserSortButtonUtilService',
	
	function($scope, $rootScope, $routeParams, $location, $mdDialog, rpCommentsService, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService, 
		rpCommentsTabUtilService, rpTitleChangeService, rpPostFilterButtonUtilService, rpUserFilterButtonUtilService, rpUserSortButtonUtilService) {
		
		$scope.subreddit = $scope.post ? $scope.post.data.subreddit : $routeParams.subreddit;
		
		if (!$scope.dialog) {
			rpPostFilterButtonUtilService.hide();
			rpUserFilterButtonUtilService.hide();
			rpUserSortButtonUtilService.hide();

			rpTitleChangeService.prepTitleChange('r/' + $scope.subreddit);
		}

		$scope.article = $scope.post ? $scope.post.data.id : $routeParams.article;
		
		var sort = $routeParams.sort || 'confidence';
		rpCommentsTabUtilService.setTab(sort);

		$scope.comment = $routeParams.comment;
		var context = $routeParams.context || 0;

		if ($scope.post)
			$scope.threadLoading = true;
		else
			$rootScope.$emit('progressLoading');

		rpCommentsService.query({

			subreddit: $scope.subreddit, 
			article: $scope.article,
			sort: sort,
			comment: $scope.comment,
			context: context

		}, function(data) {

			$scope.post = $scope.post || data[0].data.children[0];
			$scope.comments = data[1].data.children;
			

			if ($scope.threadLoading)
				$scope.threadLoading = false;
			else
				$rootScope.$emit('progressComplete');

		});

		$rootScope.$on('comments_sort', function(e, tab) {
			
			sort = tab;
			
			if (!$scope.dialog) {
				$location.path('/r/' + $scope.subreddit + '/comments/' + $scope.article, false).search('sort=' + sort);
			}

			$scope.threadLoading = true;

			rpCommentsService.query({

				subreddit: $scope.subreddit, 
				article: $scope.article,
				sort: sort,
				comment: $scope.comment,
				context: context

			}, function(data) {

				$scope.post = $scope.post || data[0];
				$scope.comments = data[1].data.children;
			
				$scope.threadLoading = false;

			});		

		});

		$scope.closeDialog = function() {
			$mdDialog.hide();
		};

		$scope.commentsUpvotePost = function() {
			
			rpUpvoteUtilService($scope.post);

		};

		$scope.commentsDownvotePost = function() {
			
			rpDownvoteUtilService($scope.post);

		};

		$scope.commentsSavePost = function() {
			
			rpSaveUtilService($scope.post);

		};

	}

]);

rpCommentsControllers.controller('rpCommentsReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {

		$scope.postCommentsReply = function(name, comment) {

			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();

				$scope.$parent.comments.unshift(data.json.data.things[0]);

			});


		};
	}
]);

rpCommentsControllers.controller('rpCommentsSortCtrl', ['$scope', '$rootScope', 'rpCommentsTabUtilService',
	function($scope, $rootScope, rpCommentsTabUtilService) {

		selectTab();
		
		$rootScope.$on('comments_tab_change', function() {
			selectTab();
		});

		$scope.tabClick = function(tab){
			$rootScope.$emit('comments_sort', tab);
			rpCommentsTabUtilService.setTab(tab);
		};

		function selectTab() {
			
			var sort = rpCommentsTabUtilService.tab;

			switch(sort) {
				case 'confidence':
					$scope.selectedIndex = 0;
					break;
				case 'top':
					$scope.selectedIndex = 1;
					break;
				case 'new':
					$scope.selectedIndex = 2;
					break;
				case 'hot':
					$scope.selectedIndex = 3;
					break;
				case 'controversial':
					$scope.selectedIndex = 4;
					break;
				case 'old':
					$scope.selectedIndex = 5;
					break;
				case 'qa':
					$scope.selectedIndex = 6;
					break;
				default:
					$scope.selectedIndex = 0;
					break;
			}			
		}
	}
]);