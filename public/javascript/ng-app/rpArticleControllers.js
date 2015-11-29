'use strict';

var rpArticleControllers = angular.module('rpArticleControllers', []);

rpArticleControllers.controller('rpArticleButtonCtrl', ['$scope', '$filter', '$mdDialog', 'rpSettingsUtilService', 'rpLocationUtilService',
	function($scope, $filter, $mdDialog, rpSettingsUtilService, rpLocationUtilService) {

		$scope.showArticle = function(e, context) {
			console.log('[rpArticleButtonCtrl] $scope.showArticle()');

			var article;
			var subreddit;
			var comment;
			var anchor;

			if ($scope.post) { //rpLink passing in a post, easy.
				console.log('[rpArticleButtonCtrl] $scope.showArticle() post, isComment: ' + $scope.isComment);

				article = $scope.isComment ? $filter('rp_name_to_id36')($scope.post.data.link_id) : $scope.post.data.id;
				console.log('[rpArticleButtonCtrl] $scope.showArticle() article: ' + article);

				subreddit = $scope.post.data.subreddit;
				console.log('[rpArticleButtonCtrl] $scope.showArticle() subreddit: ' + subreddit);

				comment = $scope.isComment ? $scope.post.data.id : "";

				anchor = '#' + $scope.post.data.name;

			} else if ($scope.message) { //rpMessageComment...
				console.log('[rpArticleButtonCtrl] $scope.showArticle() message.');

				var messageContextRe = /^\/r\/([\w]+)\/comments\/([\w]+)\/(?:[\w]+)\/([\w]+)/;
				var groups = messageContextRe.exec($scope.message.data.context);

				if (groups) {
					subreddit = groups[1];
					article = groups[2];
					comment = groups[3]; //only if we are showing context
				}

				anchor = '#' + $scope.message.data.name;

			}

			if (rpSettingsUtilService.settings.commentsDialog && !e.ctrlKey) {
				$mdDialog.show({
					controller: 'rpArticleDialogCtrl',
					templateUrl: 'partials/rpArticleDialog',
					targetEvent: e,
					locals: {
						post: $scope.isComment ? undefined : $scope.post,
						article: article,
						comment: context ? comment : '',
						subreddit: subreddit

					},
					clickOutsideToClose: true,
					openFrom: anchor,
					closeTo: anchor,
					escapeToClose: false

				});

			} else {
				console.log('[rpArticleButtonCtrl] $scope.showArticle() dont open in dialog.');

				var search = '';
				var url = '/r/' + subreddit + '/comments/' + article;

				if (context) {
					url += '/' + comment + '/';
					search = 'context=8';
				}

				rpLocationUtilService(e, url, search, true, false);
			}

		};

	}

]);

rpArticleControllers.controller('rpArticleDialogCtrl', ['$scope', '$location', '$filter', '$mdDialog', 'post', 'article', 'comment', 'subreddit',
	function($scope, $location, $filter, $mdDialog, post, article, comment, subreddit, isComment) {
		console.log('[rpArticleDialogCtrl]');

		$scope.dialog = true;

		$scope.post = post;
		$scope.article = article;
		$scope.comment = comment;
		$scope.subreddit = subreddit;

		console.log('[rpArticleDialogCtrl] $scope.article: ' + $scope.article);
		console.log('[rpArticleDialogCtrl] $scope.subreddit: ' + $scope.subreddit);
		console.log('[rpArticleDialogCtrl] $scope.comment: ' + $scope.comment);

		if (!angular.isUndefined($scope.post)) {
			console.log('[rpArticleDialogCtrl] $scope.post.data.title: ' + $scope.post.data.title);
		}

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
	'$q',
	'rpCommentsUtilService',
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
		$q,
		rpCommentsUtilService,
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

		console.log('[rpArticleCtrl] load, $scope.article: ' + $scope.article);
		console.log('[rpArticleCtrl] load, $scope.subreddit: ' + $scope.subreddit);
		console.log('[rpArticleCtrl] load, $scope.comment: ' + $scope.comment);

		if (!angular.isUndefined($scope.post)) {
			console.log('[rpArticleCtrl] load, $scope.post.data.title: ' + $scope.post.data.title);

		}

		/*
			only set them from the routeParams if there aren't set by the button already...
		 */

		if (angular.isUndefined($scope.article)) {
			$scope.article = $routeParams.article;
		}

		if (angular.isUndefined($scope.subreddit)) {
			$scope.subreddit = $routeParams.subreddit;
		}

		var commentRe = /^\w{7}$/;

		if (angular.isUndefined($scope.comment)) {
			if ($routeParams.comment && commentRe.test($routeParams.comment)) {
				$scope.cid = $routeParams.comment;

			} else {
				$scope.cid = "";
			}
		} else {
			$scope.cid = $scope.comment;

		}

		if ($routeParams.context) {
			$scope.context = $routeParams.context;
		} else if (!angular.isUndefined($scope.cid)) {
			$scope.context = 8;
		} else {
			$scope.context = 0;
		}

		$scope.sort = $routeParams.sort || 'confidence';

		console.log('[rpArticleCtrl] $scope.article: ' + $scope.article);
		console.log('[rpArticleCtrl] $scope.subreddit: ' + $scope.subreddit);
		console.log('[rpArticleCtrl] $scope.cid: ' + $scope.cid);
		console.log('[rpArticleCtrl] $scope.context: ' + $scope.context);
		console.log('[rpArticleCtrl] $scope.sort: ' + $scope.sort);

		$scope.isMine = null;

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

		// var context = $routeParams.context || 0;

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

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.cid, $scope.context, function(err, data) {
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

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.cid, $scope.context, function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpArticleCtrl] err');

				} else {
					// console.log('[rpArticleCtrl] rpCommentsUtilService returned. data: ' + JSON.stringify(data));

					console.time('[rpArticleCtrl] time $scope.post');
					$scope.post = $scope.post || data.data[0].data.children[0];
					console.log('[rpArticleCtrl] $scope.post.data.name: ' + $scope.post.data.name);
					console.timeEnd('[rpArticleCtrl] time $scope.post');

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
							$scope.isMine = ($scope.post.data.author === $scope.identity.name);

							var flatComments = flattenComments(data.data[1].data.children, 0);
							// console.log('[rpArticleCtrl] flatComments[0]: ' + JSON.stringify(flatComments[0]));

							addCommentsInBatches(flatComments);

							// $scope.comments = flattenComments(data.data[1].data.children, 0);
							// $scope.comments = data.data[1].data.children;
						});
					} else {
						$scope.comments = flattenComments(data.data[1].data.children, 0);

					}

					// }, 0); //timeout function.

					if ($scope.post.data.author.toLowerCase() === '[deleted]') {
						$scope.deleted = true;
					}

				}

			});
		}

		// /**
		//  * Function to recursively flatten the hierarchical comments tree
		//  * structure received from redddit.
		//  *
		//  * Enables us to display all comments using a react component and a
		//  * single ng-repeat.
		//  *
		//  * @return {flattened comments array}
		//  */
		function flattenComments(comments, depth) {
			console.log('[rpArticleCtrl] flattenComments(), depth: ' + depth);

			//The current flat comments array that will be returned.
			var flatComments = [];

			console.time('[rpArticleCtrl] flattenComments');

			//loop the comments array passed in.
			for (var i = 0; i < comments.length; i++) {

				//add the depth to the comment's data
				comments[i].depth = depth;

				//add the current comment to the end of the flat comments array
				flatComments.push(comments[i]);

				//if current comment has children.
				if (comments[i].data.replies && comments[i].data.replies !== "") {

					//recurse through the children of the current comment
					//add the returned flatComments array to the current one.
					Array.prototype.push.apply(flatComments, flattenComments(comments[i].data.replies.data.children, depth + 1));

				}

			}

			console.timeEnd('[rpArticleCtrl] flattenComments');

			// var flatCommentsAuthorsString = "";

			// flatComments.forEach(function(comment) {
			// 	flatCommentsAuthorsString = flatCommentsAuthorsString + comment.data.name + ", ";
			// });

			// console.log('[rpArticleCtrl] flattenComments() flatCommentsAuthorsString, '+ depth +': ' + flatCommentsAuthorsString);

			return flatComments;
		}


		function addComments(first, last, flatComments) {
			console.log('[rpArticleCtrl] addComments() flatComments.length: ' + flatComments.length + ', first: ' + first + ', last: ' + last);

			if ($scope.comments.length > 0) {
				$scope.comments = Array.prototype.concat.apply($scope.comments, flatComments.slice(first, last));

			} else {
				$scope.comments = flatComments.slice(first, last);
			}


			return $timeout(angular.noop, 0);
		}

		function addCommentsInBatches(flatComments) {

			var batchSize = 5;
			var addNextBatch;

			var addCommentsAndRender = $q.when();

			for (var i = 0; i < flatComments.length; i += batchSize) {
				addNextBatch = angular.bind(null, addComments, i, Math.min(i + batchSize, flatComments.length), flatComments);
				addCommentsAndRender = addCommentsAndRender.then(addNextBatch);

			}

			return addCommentsAndRender;


		}

		$scope.$on('$destroy', function() {

		});

	}
]);