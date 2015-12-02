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

					$scope.post = $scope.post || data.data[0].data.children[0];
					console.log('[rpArticleCtrl] $scope.post.data.name: ' + $scope.post.data.name);

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

							// var flatComments = flattenComments(data.data[1].data.children, 0);
							// addCommentsInBatches(flatComments, 5);
							// console.log('[rpArticleCtrl] flatComments[0]: ' + JSON.stringify(flatComments[0]));

							console.log('[rpArticleCtrl] comments data.length: ' + data.data[1].data.children.length);

							// $scope.comments = flattenComments(data.data[1].data.children, 0);
							// $scope.comments = data.data[1].data.children;

							addComments(data.data[1].data.children, 3);

						});
					} else {
						// $scope.comments = data.data[1].data.children;
						// $scope.comments = flattenComments(data.data[1].data.children, 0);

					}

					// }, 0); //timeout function.

					if ($scope.post.data.author.toLowerCase() === '[deleted]') {
						$scope.deleted = true;
					}

				}

			});
		}


		/**
		 * Recurse through the comments array and incrementally add comments to
		 * $scope.comments and render them to the UI through promise chaining.
		 * @param {[Array of comment objects]} comments  array to comments to add;
		 * @param {[number]} batchSize how many comments to add at a time
		 */
		function addComments(comments, batchLimit) {
			console.log('[rpArticleCtrl] addComments, comments.length: ' + comments.length);
			var batches = [];
			var batchIndex = 0;
			$scope.comments = [];

			recurseAndRenderComments(comments, 0);

			/**
			 * recurse through the array of comments passed in recursively adding
			 * each comment to batch and redering when batchSize equals batchLimit.
			 * @param  {[Array of comment objects]} comments array of comments to recurse through
			 * @param  {[number]} the current recursive depth
			 */
			function recurseAndRenderComments(comments, depth) {
				console.log('[rpArticleCtrl] recurseAndRenderComments(), depth:' + depth + ', comments.length: ' + comments.length);
				//iterate over all comments at this depth
				for (var i = 0; i < comments.length; i++) {

					//add the current comment we're recursing on to batch
					var comment = comments[i];

					//remove the children of the current comment
					// comment.data.replies = "";
					comment.depth = depth;

					//add the current comment to the batch, when adding comment to batch the insertionDepth will be equal to the current batchSize.
					addCommentToBatch(comment, batchIndex);
					batches[batchIndex].batchSize++;

					//check if batch is ready to be rendered
					if (batches[batchIndex].batchSize === batchLimit) {
						console.log('[rpArticleCtrl] recurseAndRenderComments(), batchSize = batchLimit, addBatchAndRender');
						addBatchAndRender(batchIndex);
					}

					//the recursive step
					if (comment.data.replies && comment.data.replies !== '' && comment.data.replies.data.children.length > 0) {
						// console.log('[rpArticleCtrl] recurseAndRenderComments(), comment: ' + JSON.stringify(comment));

						recurseAndRenderComments(comment.data.replies.data.children, ++depth);
					}

					if (batches[batchIndex].batchSize > 0) {
						addBatchAndRender(batchIndex);
					}
				}

			}

			/**
			 * create new promise in chain that adds the batch to $scope.comments
			 * renders them to the UI.
			 */
			function addBatchAndRender(i) {
				console.log('[rpArticleCtrl] addBatchAndRender() i: ' + i);
				// console.log('[rpArticleCtrl] addBatchAndRender() batchSize: ' + batchSize + ', batchDepth: ' + batch.depth);
				// renderBatch = angular.bind(null, addLeaf, batch, $scope, batch.comments.depth, 'scope');

				var renderComments = $q.when();
				var renderBatch;

				renderBatch = angular.bind(null, addBatchToComments, i);
				renderComments = renderComments.then(renderBatch);

				return renderComments;

				// renderComments = renderComments.then(addBatchToComments(batch.depth));

				//reset batch
				// console.log('[rpArticleCtrl] addBatchAndRender(), reset batch...');
				// batch = {};
				// batchSize = 0;

			}

			function addCommentToBatch(comment, i) {
				console.log('[rpArticleCtrl] addCommentToBatch()');
				// console.log('[rpArticleCtrl] addCommentToBatch(), batch: ' + JSON.stringify(batch));

				if (!batches[i]) {
					var newComment = JSON.parse(JSON.stringify(comment));
					newComment.data.replies = "";

					batches[i] = {
						rootComment: newComment,
						batchSize: 1
					};
				} else {
					var branch = batches[i].rootComment;
					var branchDepth = 0;
					var insertionDepth = batches[i].batchSize;

					while (branch.data.replies && branch.data.replies !== '' && branch.data.replies.data.children.length > 0 && branchDepth < insertionDepth) {
						branch = branch.data.replies.data.children[0];
						branchDepth++;
					}

					console.log('[rpArticleCtrl] addCommentToBatch(), branch: ' + JSON.stringify(branch));

					if (branch.data.replies === undefined || branch.data.replies === '' || branch.data.replies.data.children.length === 0) {

						branch.data.replies = {
							data: {
								children: []
							}
						};

					}

					var leaf = JSON.parse(JSON.stringify(comment));
					console.log('[rpArticleCtrl] addCommentToBatch, comment 1: ' + JSON.stringify(comment.data.replies));
					leaf.data.replies = "";
					console.log('[rpArticleCtrl] addCommentToBatch, comment 2: ' + JSON.stringify(comment.data.replies));

					branch.data.replies.data.children.push.apply(leaf);

				}

				return;

			}

			function addBatchToComments(i) {
				// console.log('[rpArticleCtrl] addBatchToComments(), batchSize: ' + batchSize + ', insertionDepth: ' + insertionDepth);
				console.log('[rpArticleCtrl] addBatchToComments(), i: ' + i);

				var batch = batches[i].rootComment;
				var insertionDepth = batch.depth;

				if (insertionDepth === 0) {
					$scope.comments.push(batch);

				} else {
					//last comment is the working branch
					var branch = $scope.comments[$scope.comments.length - 1];
					var branchDepth = 0;

					while (branch.data.replies && branch.data.replies !== '' && branch.data.replies.data.children.length > 0 && branchDepth < insertionDepth) {
						// console.log('[rpArticleCtrl] addBatchToComments(), i: ' + i);
						branch = branch.data.replies.data.children[branch.data.replies.data.children.length - 1];
						branchDepth++;

					}

					if (branch.data.replies === undefined || branch.data.replies === '' || branch.data.replies.data.children.length === 0) {
						branch.data.replies = {
							data: {
								children: []
							}
						};

					}

					branch.data.replies.data.children.push(batch);


					// console.log('[rpArticleCtrl] addBatchtoComments() done, branch: ' + JSON.stringify(branch));
				}


				console.log('[rpArticleCtrl] addBatchtoComments() done, $scope.comments.length: ' + $scope.comments.length);

			}

			/**
			 * determines if there are children on this branch
			 * if the branch is not a comment it won't have a replies property
			 * and if it is a comment with no children replies will be an empty string.
			 * @param  {[onject]}  branch comment object to check
			 * @return {Boolean}   whether or not the comment has children
			 */
			// function hasChildren(branch) {
			// 	// console.log('[rpArticleCtrl] hasChildren(), branch: ' + JSON.stringify(branch));
			// 	return (branch.data && branch.data.replies && branch.data.replies !== "");
			//
			// }

		}



		$scope.$on('$destroy', function() {

		});

	}
]);