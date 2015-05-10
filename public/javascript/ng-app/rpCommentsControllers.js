'use strict';

var rpCommentsControllers = angular.module('rpCommentsControllers', []);

rpCommentsControllers.controller('rpCommentsDialogCtrl', ['$scope', 'post',
	function($scope, post) {

		$scope.post = post;

	}
]);

rpCommentsControllers.controller('rpCommentsCtrl', 
		[
			'$scope', 
			'$rootScope', 
			'$routeParams', 
			'$mdDialog', 
			'rpCommentsService',
			'rpSaveUtilService',
			'rpUpvoteUtilService',
			'rpDownvoteUtilService',
	
	function($scope, $rootScope, $routeParams, $mdDialog, rpCommentsService, 
		rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService) {
		

		$scope.subreddit = $scope.post ? $scope.post.data.subreddit : $routeParams.subreddit;
		$scope.article = $scope.post ? $scope.post.data.id : $routeParams.article;
		var sort = 'confidence';

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

		$rootScope.$on('comments_sort', function(e, sort) {
			
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

rpCommentsControllers.controller('rpCommentsSortCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		
		$scope.selectedIndex = 0;
		$scope.sort = 'confidence';

		$scope.commentsSort = function(sort){

			$rootScope.$emit('comments_sort', sort);

			switch(sort) {
				case 'confidence':
					$scope.selectedIndex = 0;
					$scope.sort = 'confidence';
					break;
				case 'top':
					$scope.selectedIndex = 1;
					$scope.sort = 'top';
					break;
				case 'new':
					$scope.selectedIndex = 2;
					$scope.sort = 'new';
					break;
				case 'hot':
					$scope.selectedIndex = 3;
					$scope.sort = 'hot';
					break;
				case 'controversial':
					$scope.selectedIndex = 4;
					$scope.sort = 'controversial';
					break;
				case 'old':
					$scope.selectedIndex = 5;
					$scope.sort = 'old';
					break;
				default:
					$scope.selectedIndex = 0;
					$scope.sort = 'confidence';
					break;
			}
		};
	}
]);