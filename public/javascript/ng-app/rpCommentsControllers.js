'use strict';

var rpCommentsControllers = angular.module('rpCommentsControllers', []);

rpCommentsControllers.controller('rpCommentsDialogCtrl', ['$scope', '$location', '$mdDialog', 'post',
	function($scope, $location, $mdDialog, post) {

		$scope.post = post;
		$scope.dialog = true;

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

		$scope.$on('destroy', function() {
			deregisterLocationChangeSuccess();
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
		'rpSubscribeButtonUtilService',
		'rpSubredditsUtilService',
		'rpLocationUtilService',
		'rpSearchFormUtilService',
		'rpSearchFilterButtonUtilService',
		'rpToolbarShadowUtilService',
		'rpIdentityUtilService',
		'rpAuthUtilService',
	
	function(
		$scope,
		$rootScope,
		$routeParams,
		$location,
		$mdDialog,
		rpCommentsUtilService,
		rpSaveUtilService,
		rpUpvoteUtilService,
		rpDownvoteUtilService,
		rpCommentsTabUtilService,
		rpTitleChangeService,
		rpPostFilterButtonUtilService,
		rpUserFilterButtonUtilService,
		rpUserSortButtonUtilService,
		rpSubscribeButtonUtilService,
		rpSubredditsUtilService,
		rpLocationUtilService,
		rpSearchFormUtilService,
		rpSearchFilterButtonUtilService,
		rpToolbarShadowUtilService,
		rpIdentityUtilService,
		rpAuthUtilService
	) {

		console.log('[rpCommentsCtrl] loaded.');

		$scope.comments = {};
		$scope.isMine = false;
		$scope.editing = false;

		$scope.subreddit = $scope.post ? $scope.post.data.subreddit : $routeParams.subreddit;
		rpSubredditsUtilService.setSubreddit($scope.subreddit);
		
		if (!$scope.dialog) {
			rpPostFilterButtonUtilService.hide();
			rpUserFilterButtonUtilService.hide();
			rpUserSortButtonUtilService.hide();
			rpSearchFormUtilService.hide();
			rpSearchFilterButtonUtilService.hide();
			rpSubscribeButtonUtilService.show();
			rpToolbarShadowUtilService.hide();


			rpTitleChangeService.prepTitleChange('r/' + $scope.subreddit);
		}

		$scope.article = $scope.post ? $scope.post.data.id : $routeParams.article;
		console.log('[rpCommentsCtrl] $scope.article: ' + $scope.article);

		$scope.sort = $routeParams.sort || 'confidence';

		// console.log('[rpCommentsCtrl] sort: ' + sort);
		rpCommentsTabUtilService.setTab($scope.sort);

		/*
			For if we are loading the thread of an individual comment (comment context).
			undefined if loading all the comments for an article.
		 */
		var commentRe = /^\w{7}$/;
		
		if ($routeParams.comment && commentRe.test($routeParams.comment)) {
			$scope.comment = $routeParams.comment;
			//cid: The current comment id
			//used to set style on the focuessed comment.
			$scope.cid = $routeParams.comment;
		}

		else if ($scope.post && $scope.post.comment && commentRe.test($scope.post.comment))
			$scope.comment = $scope.post.comment;
		else
			$scope.comment = null;

		console.log('[rpCommentsCtrl] $routeParams.comment: ' + $routeParams.comment);
		console.log('[rpCommentsCtrl] $scope.comment: ' + $scope.comment);
		console.log('[rpCommentsCtrl] $scope.cid: ' + $scope.cid);

		var context = 0;

		if ($routeParams.context)
			context = $routeParams.context;
		else if ($scope.post && $scope.post.context)
			context = $scope.post.context;

		// var context = $routeParams.context || 0;

		console.log('[rpCommentsCtrl] context: ' + context);

		if ($scope.post)
			$scope.threadLoading = true;
		else
			$rootScope.$emit('progressLoading');

		rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, context, function(err, data) {
			$rootScope.$emit('progressComplete');

			if (err) {
				console.log('[rpCommentsCtrl] err');
			} else {
				$scope.post = $scope.post || data[0].data.children[0];
				$scope.comments = data[1].data.children;
				
				$scope.threadLoading = false;

				if (rpAuthUtilService.isAuthenticated) {
					rpIdentityUtilService.getIdentity(function(identity) {
						$scope.isMine = ($scope.post.data.author.toLowerCase() === identity.name.toLowerCase());
					});
				}	

				if ($scope.post.data.author.toLowerCase() === '[deleted]') {
					$scope.deleted = true;
				}
				
			}


		});

		var deregisterCommentsSort = $rootScope.$on('comments_sort', function(e, tab) {
			console.log('[rpCommentsCtrl] comments_sort, tab: ' + tab);
			console.log('[rpCommentsCtrl] comments_sort, $scope.post.data.id: ' + $scope.post.data.id);

			$scope.comments = {};

			$scope.sort = tab;
			
			if (!$scope.dialog) {
				$location.path('/r/' + $scope.subreddit + '/comments/' + $scope.article, false)
					.search('sort=' + $scope.sort)
					.replace();
			}

			$scope.threadLoading = true;

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, context, function(err, data) {

				if (err) {
					console.log('[rpCommentsCtrl] err');
				} else {
					$scope.post = $scope.post || data[0].data.children[0];
					$scope.comments = data[1].data.children;
				
					$scope.threadLoading = false;
					
				}


			});		

		});



		$scope.closeDialog = function() {
			$mdDialog.hide();
		};

		$scope.deletePost = function(e) {
			console.log('[rpCommentsCtrl] deletePost()');

			$mdDialog.show({
				templateUrl: 'partials/rpDeleteDialog',
				controller: 'rpPostDeleteCtrl',
				targetEvent: e,
				clickOutsideToClose: true,
				escapeToClose: true,
				scope: $scope,
				preserveScope: true
			
			});

		};

		$scope.editPost = function(e) {
			console.log('[rpCommentsCtrl] editPost()');
			$scope.editing = !$scope.editing;

		};

		$scope.reloadPost = function() {
			$scope.postLoading = true;
			
			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, context, function(err, data) {
				if (err) {
					console.log('[rpCommentsCtrl] err');
				} else {
					$scope.post = data[0].data.children[0];
					$scope.postLoading = false;
					$scope.editing = false;
					
				}				

			});

		};

		$scope.showInfo = function(e) {
			console.log('[rpCommentsCtrl] showInfo()');

			$mdDialog.show({
				templateUrl: 'partials/rpInfoDialog',
				// controller: 'rpPostDeleteCtrl',
				targetEvent: e,
				clickOutsideToClose: true,
				escapeToClose: true,
			});

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

		$scope.openAuthor = function(e) {
			rpLocationUtilService(e, '/u/' + $scope.post.data.author, '', true, false);
		};

		$scope.openSubreddit = function(e) {
			rpLocationUtilService(e, '/r/' + $scope.subreddit, '', true, false);
		};

		$scope.$on('$destroy', function() {
			deregisterCommentsSort();
		});

	}
]);

rpCommentsControllers.controller('rpCommentsReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {

		$scope.postCommentsReply = function(name, comment) {

			rpPostCommentUtilService(name, comment, function(err, data) {

				if (err) {
					console.log('[rpCommentsReplyCtrl] err');
				} else {
					$scope.reply = "";
					$scope.rpPostReplyForm.$setUntouched();
					$scope.$parent.comments.unshift(data.json.data.things[0]);
				}


			});


		};
	}
]);

rpCommentsControllers.controller('rpCommentsSortCtrl', ['$scope', '$rootScope', 'rpCommentsTabUtilService',
	function($scope, $rootScope, rpCommentsTabUtilService) {

		selectTab();
		var firstLoadOver = false;


		$scope.tabClick = function(tab){
			console.log('[rpCommentsSortCtrl] tabClick(), tab: ' + tab);

			if (firstLoadOver) {

				$rootScope.$emit('comments_sort', tab);
				rpCommentsTabUtilService.setTab(tab);

			} else {
				firstLoadOver = true;
			}

		};

		var deregisterCommentsTabChange = $rootScope.$on('comments_tab_change', function() {
			// console.log('[rpCommentsSortCtrl] comments_tab_change');
			selectTab();
		});

		function selectTab() {
			// console.log('[rpCommentsSortCtrl] selectTab()');
			
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

		$scope.$on('$destroy', function() {
			deregisterCommentsTabChange();
		});
	}
]);

rpCommentsControllers.controller('rpCommentsDeleteCtrl', ['$scope', '$mdDialog', 'rpDeleteUtilService',
	function ($scope, $mdDialog, rpDeleteUtilService) {

		console.log('[rpCommentDeleteCtrl] $scope.comment.data.name: ' + $scope.post.data.name);
		$scope.type = "post";
		$scope.deleting = false;

		$scope.confirm = function() {
			console.log('[rpCommentDeleteCtrl] confirm()');
			$scope.deleting = true;

			rpDeleteUtilService($scope.post.data.name, function(err, data) {
				if (err) {
					console.log('[rpCommentsDeleteCtrl] err');
				} else {
					console.log('[rpCommentDeleteCtrl] confirm(), delete complete.');
					$mdDialog.hide();
					$scope.deleted = true;
				}

			});

		};

		$scope.cancel = function() {
			console.log('[rpCommentDeleteCtrl] cancel()');
			$mdDialog.hide();

		};

	}
]);

rpCommentsControllers.controller('rpCommentsEditPostFormCtrl', ['$scope', 'rpEditUtilService',
	function ($scope, rpEditUtilService) {
		console.log('[rpCommentsEditPostFormCtrl] loaded');

		if ($scope.$parent && $scope.$parent.post.data) {
			$scope.editText = $scope.$parent.post.data.selftext;
			
		}

		console.log('[rpCommentsEditPostFormCtrl] $scope.editText: ' + $scope.editText);


		$scope.submit = function() {
			console.log('[rpCommentsEditPostFormCtrl] submit() $scope.$parent.post.data.name: ' + $scope.$parent.post.data.name);
			$scope.submitting = true;

			rpEditUtilService($scope.editText, $scope.$parent.post.data.name, function(err, data) {
				if (err) {
					console.log('[rpCommentsEditPostFormCtrl] err');
				} else {
					$scope.$parent.reloadPost();
					$scope.submitting = false;
				}

			});

		};
	}
]);