'use strict';

var rpArticleControllers = angular.module('rpArticleControllers', []);

rpArticleControllers.controller('rpArticleDialogCtrl', ['$scope', '$location', '$filter', '$mdDialog', 'link', 'isComment', 'context',
	function($scope, $location, $filter, $mdDialog, link, isComment, context) {
		console.log('[rpArticleDialogCtrl]');

		$scope.dialog = true;

		$scope.link = link;
		$scope.isComment = isComment;
		$scope.context = context;

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

		$scope.$on('destroy', function() {
			deregisterLocationChangeSuccess();
		});

	}
]);

rpArticleControllers.controller('rpArticleCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$timeout',
	'$filter',
	'rpCommentsUtilService',
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
	'rpSidebarButtonUtilService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		$timeout,
		$filter,
		rpCommentsUtilService,
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
		rpSidebarButtonUtilService

	) {

		console.log('[rpArticleCtrl] loaded.');

		if ($scope.isComment) {
			$scope.article = $filter('rp_name_to_id36')($scope.link.data.link_id);

		} else {
			$scope.article = $scope.link ? $scope.link.data.id : $routeParams.article;
			$scope.post = $scope.link;

		}

		$scope.subreddit = $scope.link ? $scope.link.data.subreddit : $routeParams.subreddit;

		console.log('[rpArticleCtrl] $scope.article: ' + $scope.article);

		$scope.isMine = null;

		if (angular.isUndefined($scope.subreddit))
			$scope.subreddit = $routeParams.subreddit;

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


		$scope.sort = $routeParams.sort || 'confidence';

		// console.log('[rpArticleCtrl] sort: ' + sort);
		rpArticleTabsUtilService.setTab($scope.sort);

		$scope.tabs = [{
			label: 'best',
			value: 'confidence'
		}, {
			label: 'top',
			value: 'top'
		}, {
			label: 'new',
			value: 'new'
		}, {
			label: 'hot',
			value: 'hot'
		}, {
			label: 'controvesial',
			value: 'controversial'
		}, {
			label: 'old',
			value: 'old'
		}, {
			label: 'q&a',
			value: 'qa'
		}, ];


		for (var i = 0; i < $scope.tabs.length; i++) {
			if ($scope.sort === $scope.tabs[i].value) {
				$scope.selectedTab = i;
				break;
			}
		}

		/*
			For if we are loading the thread of an individual comment (comment context).
			undefined if loading all the comments for an article.
		 */
		var commentRe = /^\w{7}$/;

		if ($routeParams.comment && commentRe.test($routeParams.comment)) {
			$scope.cid = $scope.comment = $routeParams.comment;

		} else if ($scope.context === 8 && commentRe.test($scope.link.data.id)) {
			$scope.cid = $scope.comment = $scope.link.data.id;

		} else {
			$scope.comment = null;
		}

		console.log('[rpArticleCtrl] $routeParams.comment: ' + $routeParams.comment);
		console.log('[rpArticleCtrl] $scope.comment: ' + $scope.comment);
		console.log('[rpArticleCtrl] $scope.cid: ' + $scope.cid);

		if ($routeParams.context) {
			$scope.context = $routeParams.context;
		}

		// var context = $routeParams.context || 0;

		console.log('[rpArticleCtrl] $scope.context: ' + $scope.context);

		if ($scope.post) {
			$scope.threadLoading = true;
		} else {
			$rootScope.$emit('progressLoading');
		}

		loadPosts();

		/**
		 * CONTRPLLER API
		 * */

		$scope.thisController = this;

		this.completeReplying = function(data, post) {
			this.isReplying = false;
			$scope.comments.unshift(data.json.data.things[0]);

		};

		this.completeDeleting = function(id) {
			console.log('[rpArticleCtrl] this.completeDelete()');
			this.isDeleting = false;
			$scope.deleted = true;
		};

		this.completeEditing = function() {
			console.log('[rpArticleCtrl] this.completeEdit()');

			var thisController = this;

			reloadPost(function() {
				thisController.isEditing = false;
			});
		};

		var ignoredFirstTabClick = false;

		this.tabClick = function(tab) {
			console.log('[rpArticleCtrl] this.tabClick()');

			if (ignoredFirstTabClick) {
				$scope.sort = tab;

				if (!$scope.dialog) {
					rpLocationUtilService(null, '/r/' + $scope.subreddit + '/comments/' + $scope.article,
						'sort=' + $scope.sort, false, false);
				}

				$scope.threadLoading = true;

				loadPosts();

			} else {
				console.log('[rpArticleCtrl] this.tabClick(), tabClick() ignored');
				ignoredFirstTabClick = true;
			}
		};

		/**
		 * SCOPE FUNCTIONS
		 * */

		$scope.openAuthor = function(e) {
			rpLocationUtilService(e, '/u/' + $scope.post.data.author, '', true, false);
		};

		$scope.openSubreddit = function(e) {
			rpLocationUtilService(e, '/r/' + $scope.subreddit, '', true, false);
		};

		function reloadPost(callback) {
			$scope.postLoading = true;

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, $scope.context, function(err, data) {
				if (err) {
					console.log('[rpArticleCtrl] err');
				} else {
					console.log('[rpArticleCtrl] success');

					$scope.post = data.data[0].data.children[0];
					$scope.postLoading = false;
					$scope.editing = false;

					if (callback) {
						callback();

					}

				}

			});

		}

		/**
		 * Load the Post and Comments.
		 */
		function loadPosts() {

			$scope.comments = {};

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.comment, $scope.context, function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpArticleCtrl] err');

				} else {
					// console.log('[rpArticleCtrl] rpCommentsUtilService returned. data: ' + JSON.stringify(data));

					$scope.post = $scope.post || data.data[0].data.children[0];

					$scope.threadLoading = false;

					//Enable this timeout function to stage loading the post and comments
					//Icons and other elements don't load until the whole post has been loaded though
					//So i disbaled it.
					// $timeout(function() {

					//Must wait to load the CommentCtrl until after the identity is gotten
					//otherwise it might try to check identity.name before we have identity.
					if (rpAuthUtilService.isAuthenticated) {
						rpIdentityUtilService.getIdentity(function(identity) {
							$scope.identity = identity;
							console.log('[rpArticleCtrl] $scope.identity.name: ' + $scope.identity.name);
							$scope.isMine = ($scope.post.data.author === $scope.identity.name);
							$scope.comments = data.data[1].data.children;
						});
					} else {
						$scope.comments = data.data[1].data.children;

					}

					// }); //timeout function.

					if ($scope.post.data.author.toLowerCase() === '[deleted]') {
						$scope.deleted = true;
					}

				}

			});
		}

		$scope.$on('$destroy', function() {

		});

	}
]);