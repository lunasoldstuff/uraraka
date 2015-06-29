'use strict';

var rpCommentsControllers = angular.module('rpCommentsControllers', []);

rpCommentsControllers.controller('rpCommentsDialogCtrl', ['$scope', '$location', '$mdDialog', 'post',
	function($scope, $location, $mdDialog, post) {

		$scope.post = post;
		$scope.dialog = true;

		//Close the dialog if user navigates to a new page.
		$scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

	}
]);

rpCommentsControllers.controller('rpCommentsCtrl', 
		[
			'$scope', 
			'$rootScope', 
			'$routeParams', 
			'$location',
			'$mdDialog', 
			'rpCommentsUtilService',
			'rpSaveUtilService',
			'rpUpvoteUtilService',
			'rpDownvoteUtilService',
			'rpCommentsTabUtilService',
			'rpTitleChangeService',
			'rpPostFilterButtonUtilService',
			'rpUserFilterButtonUtilService',
			'rpUserSortButtonUtilService',
	
	function($scope, $rootScope, $routeParams, $location, $mdDialog, rpCommentsUtilService, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService, 
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

		console.log('[rpCommentsCtrl] sort: ' + sort);
		rpCommentsTabUtilService.setTab(sort);

		/*
			For if we are loading the thread of an individual comment (comment context).
			undefined if loading all the comments for an article.
		 */
		$scope.comment = $routeParams.comment;
		console.log('[rpCommentsCtrl] $scope.comment: ' + $scope.comment);

		var context = $routeParams.context || 0;
		console.log('[rpCommentsCtrl] context: ' + context);

		if ($scope.post)
			$scope.threadLoading = true;
		else
			$rootScope.$emit('progressLoading');

		rpCommentsUtilService($scope.subreddit, $scope.article, sort, $scope.comment, context, function(data) {

			$scope.post = $scope.post || data[0].data.children[0];
			$scope.comments = data[1].data.children;
			
			$scope.threadLoading = false;
			$rootScope.$emit('progressComplete');

		});

		$rootScope.$on('comments_sort', function(e, tab) {
			console.log('[rpCommentsCtrl] comments_sort');

			sort = tab;
			
			if (!$scope.dialog) {
				$location.path('/r/' + $scope.subreddit + '/comments/' + $scope.article, false)
					.search('sort=' + sort)
					.replace();
			}

			$scope.threadLoading = true;

			rpCommentsUtilService($scope.subreddit, $scope.article, sort, $scope.comment, context, function(data) {

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
		var firstLoadOver = false;


		$scope.tabClick = function(tab){
			console.log('[rpCommentsSortCtrl] tabClick()');

			if (firstLoadOver) {

				$rootScope.$emit('comments_sort', tab);
				rpCommentsTabUtilService.setTab(tab);

			} else {
				firstLoadOver = true;
			}

		};

		$rootScope.$on('comments_tab_change', function() {
			console.log('[rpCommentsSortCtrl] comments_tab_change');
			selectTab();
		});

		function selectTab() {
			console.log('[rpCommentsSortCtrl] selectTab()');
			
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