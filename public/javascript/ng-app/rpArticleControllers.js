'use strict';

var rpArticleControllers = angular.module('rpArticleControllers', []);

rpArticleControllers.controller('rpArticleDialogCtrl', ['$scope', '$location', '$mdDialog', 'post',
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

rpArticleControllers.controller('rpArticleCtrl', 
	[
		'$scope', 
		'$rootScope', 
		'$routeParams', 
		'$mdDialog',
		'$mdBottomSheet',
		'rpCommentsUtilService',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',
		'rpArticleTabsUtilService',
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
		'rpGildUtilService',
		'rpDeleteUtilService',
		'rpSidebarButtonUtilService',
	
	function(
		$scope,
		$rootScope,
		$routeParams,
		$mdDialog,
		$mdBottomSheet,
		rpCommentsUtilService,
		rpSaveUtilService,
		rpUpvoteUtilService,
		rpDownvoteUtilService,
		rpArticleTabsUtilService,
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
		rpAuthUtilService,
		rpGildUtilService,
		rpDeleteUtilService,
		rpSidebarButtonUtilService
		
	) {

		console.log('[rpArticleCtrl] loaded.');

		$scope.comments = {};
		$scope.isMine = {};
		$scope.editing = false;
		$scope.deleting = false;

		$scope.subreddit = $scope.post ? $scope.post.data.subreddit : $routeParams.subreddit;
		
		/*
			Toolbar stuff if we are not in a dialog.	
		 */

		if (!$scope.dialog) {
			rpPostFilterButtonUtilService.hide();
			rpUserFilterButtonUtilService.hide();
			rpUserSortButtonUtilService.hide();
			rpSearchFormUtilService.hide();
			rpSearchFilterButtonUtilService.hide();
			rpSubscribeButtonUtilService.show();
			rpToolbarShadowUtilService.hide();
			rpSidebarButtonUtilService.show();

			rpTitleChangeService.prepTitleChange('r/' + $scope.subreddit);
			
			rpSubredditsUtilService.setSubreddit($scope.subreddit);
		}

		$scope.article = $scope.post ? $scope.post.data.id : $routeParams.article;
		console.log('[rpArticleCtrl] $scope.article: ' + $scope.article);

		$scope.sort = $routeParams.sort || 'confidence';

		// console.log('[rpArticleCtrl] sort: ' + sort);
		rpArticleTabsUtilService.setTab($scope.sort);

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

		else if ($scope.post && $scope.post.comment && commentRe.test($scope.post.comment)) {
			$scope.comment = $scope.post.comment;
		}
		else {
			$scope.comment = null;
		}

		console.log('[rpArticleCtrl] $routeParams.comment: ' + $routeParams.comment);
		console.log('[rpArticleCtrl] $scope.comment: ' + $scope.comment);
		console.log('[rpArticleCtrl] $scope.cid: ' + $scope.cid);

		var context = 0;

		if ($routeParams.context) {
			context = $routeParams.context;
		}
		else if ($scope.post && $scope.post.context) { 
			//do i add context to $scope.post? We don't actually have a post at this point... 
			//Unless it has been passed in from the dialog controller
			context = $scope.post.context;
		}

		// var context = $routeParams.context || 0;

		console.log('[rpArticleCtrl] context: ' + context);

		if ($scope.post) {
			$scope.threadLoading = true;
		}
		else {
			$rootScope.$emit('progressLoading');
		}

		/**
		 * Load the Post and Comments.
		 */


		rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, context, function(err, data) {
			$rootScope.$emit('progressComplete');

			if (err) {
				console.log('[rpArticleCtrl] err');

			} else {

				$scope.post = $scope.post || data.data[0].data.children[0];
				$scope.comments = data.data[1].data.children;
				
				$scope.threadLoading = false;

				if (rpAuthUtilService.isAuthenticated) {
					rpIdentityUtilService.getIdentity(function(identity) {
						$scope.identity = identity;
						console.log('[rpArticleCtrl] $scope.identity.name: ' + $scope.identity.name);
						$scope.isMine = ($scope.post.data.author === $scope.identity.name);
					});
				}	

				if ($scope.post.data.author.toLowerCase() === '[deleted]') {
					$scope.deleted = true;
				}
				
			}

		});

		var deregisterArticleSort = $rootScope.$on('article_sort', function(e, tab) {
			console.log('[rpArticleCtrl] article_sort, tab: ' + tab);
			console.log('[rpArticleCtrl] article_sort, $scope.post.data.id: ' + $scope.post.data.id);

			$scope.comments = {};

			$scope.sort = tab;
			
			if (!$scope.dialog) {
				rpLocationUtilService(null, '/r/' + $scope.subreddit + '/comments/' + $scope.article, 
					'sort=' + $scope.sort, false, false);
			}

			$scope.threadLoading = true;

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, context, function(err, data) {

				if (err) {
					console.log('[rpArticleCtrl] err');
				} else {
					$scope.post = $scope.post || data.data[0].data.children[0];
					$scope.comments = data.data[1].data.children;
				
					$scope.threadLoading = false;
					
				}
			});		
		});

		$scope.closeDialog = function() {
			$mdDialog.hide();
		};

		$scope.toggleDeleting = function(e) {
			$scope.deleting = !$scope.deleting;
		};

		$scope.confirmDeletePost = function(e) {
			console.log('[rpArticleCtrl] confirmDeletePost()');
			$scope.deleteProgress = true;

			rpDeleteUtilService($scope.post.data.name, function(err, data) {
				if (err) {
					console.log('[rpArticleCtrl] confirmDeletePost() err');
				} else {
					console.log('[rpArticleCtrl] confirmDeletePost() delete complete.');
					$scope.deleteProgress = false;
					$scope.deleted = true;
					$scope.deleting = false;
				}

			});
		};

		$scope.editPost = function(e) {
			console.log('[rpArticleCtrl] editPost()');
		$scope.editing = !$scope.editing;

		};

		$scope.reloadPost = function(callback) {
			$scope.postLoading = true;
			
			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, context, function(err, data) {
				if (err) {
					console.log('[rpArticleCtrl] err');
				} else {
					$scope.post = data.data[0].data.children[0];
					$scope.postLoading = false;
					$scope.editing = false;
					callback();
					
				}				

			});

		};

		$scope.articleUpvote = function() {
			rpUpvoteUtilService($scope.post, function(err, data) {

				if (err) {

				} else {
					
				}

			});

		};

		$scope.articleDownvote = function() {
			
			rpDownvoteUtilService($scope.post, function(err, data) {

				if (err) {

				} else {
					
				}

			});

		};

		$scope.articleSave = function() {
			
			rpSaveUtilService($scope.post, function(err, data) {

				if (err) {

				} else {
					
				}

			});

		};

		$scope.articleGild = function(e, post) {
			console.log('[rpArticleCtrl] articleGild(), post.data.name: ' + post.data.name);

			rpGildUtilService(post.data.name, function(err, data) {

				if (err) {

				} else {
					post.data.gilded++;
				}


			});


		};

		$scope.articleShare = function(e, post) {
			console.log('[rpArticleCtrl] articleShare(), post.data.url: ' + post.data.url);

			post.bottomSheet = true;

			var shareBottomSheet = $mdBottomSheet.show({
				templateUrl: 'partials/rpShareBottomSheet',
				controller: 'rpShareCtrl',
				targetEvent: e,
				parent: '.rp-view',
				disbaleParentScroll: true,
				locals: {
					post: post
				}
			}).then(function() {
				console.log('[rpArticleCtrl] bottomSheet Resolved: remove rp-bottom-sheet class');
				post.bottomSheet = false;
			}).catch(function() {
				console.log('[rpArticleCtrl] bottomSheet Rejected: remove rp-bottom-sheet class');
				post.bottomSheet = false;
			});

		};

		$scope.openAuthor = function(e) {
			rpLocationUtilService(e, '/u/' + $scope.post.data.author, '', true, false);
		};

		$scope.openSubreddit = function(e) {
			rpLocationUtilService(e, '/r/' + $scope.subreddit, '', true, false);
		};

		$scope.$on('$destroy', function() {
			deregisterArticleSort();
		});

	}
]);

rpArticleControllers.controller('rpArticleReplyFormCtrl', ['$scope', 'rpCommentUtilService',
	function($scope, rpCommentUtilService) {

		$scope.articleReplyFormSubmit = function(name, comment) {

			rpCommentUtilService(name, comment, function(err, data) {

				if (err) {
					console.log('[rpArticleReplyFormCtrl] err');
				} else {
					$scope.reply = "";
					$scope.rpPostReplyForm.$setUntouched();
					$scope.$parent.comments.unshift(data.json.data.things[0]);
				}


			});


		};
	}
]);

rpArticleControllers.controller('rpArticleSortCtrl', ['$scope', '$rootScope', 'rpArticleTabsUtilService',
	function($scope, $rootScope, rpArticleTabsUtilService) {

		selectTab();
		var firstLoadOver = false;


		$scope.tabClick = function(tab){
			console.log('[rpArticleSortCtrl] tabClick(), tab: ' + tab);

			if (firstLoadOver) {

				$rootScope.$emit('article_sort', tab);
				rpArticleTabsUtilService.setTab(tab);

			} else {
				firstLoadOver = true;
			}

		};

		var deregisterArticleTabChange = $rootScope.$on('article_tab_change', function() {
			// console.log('[rpArticleSortCtrl] article_tab_change');
			selectTab();
		});

		function selectTab() {
			// console.log('[rpArticleSortCtrl] selectTab()');
			
			var sort = rpArticleTabsUtilService.tab;

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
			deregisterArticleTabChange();
		});
	}
]);

rpArticleControllers.controller('rpArticleEditFormCtrl', ['$scope', 'rpEditUtilService',
	function ($scope, rpEditUtilService) {
		console.log('[rpArticleEditFormCtrl] loaded');

		if ($scope.$parent && $scope.$parent.post.data) {
			$scope.editText = $scope.$parent.post.data.selftext;
			
		}

		console.log('[rpArticleEditFormCtrl] $scope.editText: ' + $scope.editText);


		$scope.submit = function() {
			console.log('[rpArticleEditFormCtrl] submit() $scope.$parent.post.data.name: ' + $scope.$parent.post.data.name);
			$scope.submitting = true;

			rpEditUtilService($scope.editText, $scope.$parent.post.data.name, function(err, data) {
				if (err) {
					console.log('[rpArticleEditFormCtrl] err');
				} else {
					$scope.$parent.reloadPost(function() {
						$scope.submitting = false;
						
					});
				}

			});

		};
	}
]);