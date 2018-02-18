(function() {
	'use strict';
	angular.module('rpArticle').controller('rpArticleCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		'$timeout',
		'$filter',
		'$q',
		'$http',
		'debounce',
		'rpCommentsUtilService',
		'rpAppTitleChangeService',
		'rpSubredditsUtilService',
		'rpAppLocationService',
		'rpIdentityService',
		'rpAppAuthService',
		rpArticleCtrl
	]);

	function rpArticleCtrl(
		$scope,
		$rootScope,
		$routeParams,
		$timeout,
		$filter,
		$q,
		$http,
		debounce,
		rpCommentsUtilService,
		rpAppTitleChangeService,
		rpSubredditsUtilService,
		rpAppLocationService,
		rpIdentityService,
		rpAppAuthService

	) {

		console.log('[rpArticleCtrl] loaded.');

		console.log('[rpArticleCtrl] load, $scope.article: ' + $scope.article);
		console.log('[rpArticleCtrl] load, $scope.subreddit: ' + $scope.subreddit);
		console.log('[rpArticleCtrl] load, $scope.comment: ' + $scope.comment);

		if (angular.isDefined($scope.post)) {
			console.log('[rpArticleCtrl] load, $scope.post.data.title: ' + $scope.post.data.title);

		}

		var isDestroyed = false;

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

			$rootScope.$emit('rp_hide_all_buttons');

			$rootScope.$emit('rp_button_visibility', 'showSubscribe', true);
			$rootScope.$emit('rp_button_visibility', 'showRules', true);
			$rootScope.$emit('rp_button_visibility', 'showArticleSort', true);

			rpAppTitleChangeService('r/' + $scope.subreddit, true, true);

			rpSubredditsUtilService.setSubreddit($scope.subreddit);
		}

		// var context = $routeParams.context || 0;

		$scope.threadLoading = true;
		$scope.postLoading = true;

		$scope.showProgress = function() {
			$rootScope.$emit('rp_progress_start');
			$timeout(angular.noop, 0);
		};

		$scope.hideProgress = function() {
			$rootScope.$emit('rp_progress_stop');
			$timeout(angular.noop, 0);
		};

		if (!$scope.post) {
			// $rootScope.$emit('rp_progress_start');
			$scope.showProgress();
		}

		/**
		 * Scope Functions
		 */
		$scope.disableCommentsScroll = function() {
			console.log('[rpArticleCtrl] disableCommentsScroll(), $scope.commentsScroll: ' + $scope.commentsScroll);
			if ($scope.commentsScroll) {
				$scope.commentsScroll = false;

			}
		};

		$scope.enableCommentsScroll = function() {
			console.log('[rpArticleCtrl] enableCommentsScroll(), $scope.commentsScroll: ' + $scope.commentsScroll);
			if (!$scope.commentsScroll) {
				$scope.commentsScroll = true;

			}
		};

		/**
		 * CONTRPLLER API
		 * */

		$scope.thisController = this;

		this.completeReplying = function(data, post) {
			this.isReplying = false;
			//$timeout(angular.noop, 0);
			console.log('[rpArticleCtrl] this.completeReplying(), $scope.comments: ' + $scope.comments);
			$scope.comments.unshift(data.json.data.things[0]);

			if ($scope.haveComments === false) {
				$scope.haveComments = true;

			}

		};

		this.completeDeleting = function(id) {
			console.log('[rpArticleCtrl] this.completeDelete()');
			this.isDeleting = false;
			$scope.deleted = true;
			//$timeout(angular.noop, 0);
		};

		this.completeEditing = function() {
			console.log('[rpArticleCtrl] this.completeEdit()');

			var thisController = this;

			reloadPost(function() {
				thisController.isEditing = false;
			});
		};

		/**
		 * EVENT HANDLERS
		 */
		var deregisterArticleSortClick = $rootScope.$on('rp_article_sort_click', function(e, sort) {
			console.log('[rpArticleCtrl] rp_article_sort_click');

			$scope.sort = sort;

			if (!$scope.dialog) {
				rpAppLocationService(null, '/r/' + $scope.subreddit + '/comments/' + $scope.article,
					'sort=' + $scope.sort, false, false);

			} else {
				$scope.showProgress();
			}

			loadPosts();

		});

		var deregisterRefresh = $rootScope.$on('rp_refresh', function() {
			console.log('[rpArticleCtrl] rp_refresh');
			$rootScope.$emit('rp_refresh_button_spin', true);
			loadPosts();
		});


		/*
		    relaod Post
		 */

		function reloadPost(callback) {
			$scope.postLoading = true;

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.cid, $scope.context, function(err, data) {
				if (err) {
					console.log('[rpArticleCtrl] err');
				} else {
					console.log('[rpArticleCtrl] realodPost(), data: ' + JSON.stringify(data));

					$scope.post = data[0].data.children[0];
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

			console.log('[rpArticleCtrl] loadPosts()');

			if (!$scope.dialog && angular.isUndefined($scope.post)) {
				$scope.post = null;
			}

			$scope.comments = [];
			$scope.noMoreComments = false;
			$scope.disableCommentsScroll();

			rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.cid, $scope.context, function(err, data) {
				if (!isDestroyed) {
					$scope.hideProgress();

					if (err) {
						console.log('[rpArticleCtrl] err');

					} else {
						console.log('[rpArticleCtrl] loadPosts(), angular.isUndefined($scope.post): ' + angular.isUndefined($scope.post));

						if (angular.isUndefined($scope.post) || $scope.post === null) {
							$scope.post = data[0].data.children[0];
						}

						if ($scope.post.data.author.toLowerCase() === '[deleted]') {
							$scope.deleted = true;
						}

						console.log('[rpArticleCtrl] $scope.post.data.name: ' + $scope.post.data.name);

						$scope.threadLoading = false;
						$scope.postLoading = false;
						$scope.showProgress();

						if (!$scope.dialog) {
							$rootScope.$emit('rp_button_visibility', 'showRefresh', true);
							$rootScope.$emit('rp_refresh_button_spin', false);
							//Put the title of the post in the page title.
							rpAppTitleChangeService($scope.post.data.title, true, false);
						}

						if (data[1].data.children.length > 0) {
							$scope.haveComments = true;
						} else {
							$scope.haveComments = false;
							$scope.noMoreComments = true;
							$scope.hideProgress();
						}

						//Must wait to load the CommentCtrl until after the identity is gotten
						//otherwise it might try to check identity.name before we have identity.
						if (rpAppAuthService.isAuthenticated) {
							rpIdentityService.getIdentity(function(identity) {
								$scope.identity = identity;
								$scope.isMine = ($scope.post.data.author === $scope.identity.name);
								console.log('[rpArticleCtrl] $scope.isMine: ' + $scope.isMine);
							});
						}

						console.log('[rpArticleCtrl] $scope.post.data.selftext_html: ' + $scope.post.data.selftext_html);
						$scope.isSelfText = $scope.post.data.selftext_html !== null;

						if ($scope.haveComments) {
							// $scope.comments.push(data[1].data.children);
							console.log('[rpArticleCtrl] data[1].data.children.length: ' + data[1].data.children.length);
							addComments(data[1].data.children);


						}

					}

				}
			});
		}

		$scope.moreComments = function() {
			console.log('[rpArticleCtrl] moreComments()');
			addSubtreeBatchToComments();
			$scope.showProgress();
		};

		//subtree size
		var subtreeSize;
		var subtreeBatchSize;
		//subtree counters/management
		var subtrees;
		var subtreesCreated;
		var subtreesAttached;
		//subtree queue
		var attachSubtree;
		var subtreeQueue;

		function addComments(comments) {
			console.time('[rpArticleCtrl addComments]');
			$scope.comments = [];
			//subtree size
			subtreeSize = 3;
			subtreeBatchSize = 12;
			//subtree counters/management
			subtrees = [];
			subtreesCreated = 0;
			subtreesAttached = 0;
			//subtree queue
			attachSubtree = null;
			subtreeQueue = $q.when();

			$rootScope.$emit('rp_start_watching_height');

			buildSubtrees(comments, 0);

		}

		function buildSubtrees(comments, depth) {
			for (var i = 0; i < comments.length; i++) {

				var comment = comments[i];
				comment.depth = depth;
				var leaf = JSON.parse(JSON.stringify(comment));
				leaf.data.replies = "";
				leaf.depth = depth;

				if (!subtrees[subtreesCreated]) {

					subtrees[subtreesCreated] = {
						rootComment: leaf,
						subtreeSize: 0,
					};

				} else {
					//use existing subtree
					var branch = subtrees[subtreesCreated].rootComment;
					var branchDepth = 0;
					var insertionDepth = subtrees[subtreesCreated].subtreeSize;

					while (
						branch.data.replies && branch.data.replies !== '' &&
						branch.data.replies.data.children.length > 0 &&
						branchDepth < insertionDepth
					) {
						branch = branch.data.replies.data.children[0];
						branchDepth++;
					}

					if (
						branch.data.replies === undefined ||
						branch.data.replies === '' ||
						branch.data.replies.data.children.length === 0
					) {

						branch.data.replies = {
							data: {
								children: []
							}
						};

					}

					branch.data.replies.data.children.push(leaf);
					subtrees[subtreesCreated].subtreeSize++;

				}

				//check if subtree is complete
				if (subtrees[subtreesCreated].subtreeSize === subtreeSize) {
					subtreesCreated++;
				}

				//recurse children
				if (comment.data.replies && comment.data.replies !== '' && comment.data.replies.data.children.length > 0) {
					buildSubtrees(comment.data.replies.data.children, depth + 1);
				}

				if (subtrees[subtreesCreated]) {
					subtreesCreated++;

				}
			}

			if (depth === 0) {
				addSubtreeBatchToComments();
			}

		}

		function addSubtreeBatchToComments() {
			console.log('[rpArticleCtrl] addSubtreeBatchToComments(), subtreesAttached: ' + subtreesAttached);

			for (var i = 0; i < subtreeBatchSize; i++) {
				addSubtreeToQueue(subtreesAttached + i);

			}

			subtreesAttached += subtreeBatchSize;

			console.log('[rpArticleCtrl] addSuperBatchToComments(), subtreesAttached: ' + subtreesAttached + ', subtrees.length: ' + subtrees.length);
			if (subtreesAttached >= subtrees.length) {
				$scope.noMoreComments = true;
			}


		}

		function addSubtreeToQueue(subtreeIndex) {
			console.log('[rpArticleCtrl] addSubtreeToQueue() subtreeIndex: ' + subtreeIndex);

			attachSubtree = angular.bind(null, attachSubtreeToComments, subtreeIndex);
			subtreeQueue = subtreeQueue.then(attachSubtree);

		}

		function attachSubtreeToComments(subtreeIndex) {
			console.log('[rpArticleCtrl] attachSubtreeToComments(), began subtree: ' + subtreeIndex);

			if (subtrees[subtreeIndex]) {
				var subtree = subtrees[subtreeIndex].rootComment;
				var insertionDepth = subtree.depth - 1; //TODO both -1 and without seem to work..

				if (subtree.depth === 0) {
					// console.log('[rpArticleCtrl] attachSubtreeToComments() insertion depth = 0');
					$scope.comments.push(subtree);

				} else {
					//last comment is the working branch
					// console.log('[rpArticleCtrl] attachSubtreeToComments() insertion depth > 0, adding to branch...');

					var branch = $scope.comments[$scope.comments.length - 1];
					var branchDepth = 0;

					// console.log('[rpArticleCtrl] attachSubtreeToComments() angular.isDefined(branch): ' + angular.isDefined(branch));

					if (angular.isDefined(branch)) {

						while (
							branch.data.replies && branch.data.replies !== '' &&
							branch.data.replies.data.children.length > 0 &&
							branchDepth < insertionDepth
						) {
							// console.log('[rpArticleCtrl] attachSubtreeToComments(), branchDepth: ' + branchDepth);
							branch = branch.data.replies.data.children[branch.data.replies.data.children.length - 1];
							branchDepth++;

						}

						// console.log('[rpArticleCtrl] attachSubtreeToComments(), branch found');

						if (
							angular.isUndefined(branch.data.replies) ||
							branch.data.replies === '' ||
							branch.data.replies.data.children.length === 0
						) {
							branch.data.replies = {
								data: {
									children: []
								}
							};

						}

						console.log('[rpArticleCtrl] attachSubtreeToComments(), branch primed for push, ' + subtreeIndex);
						console.log('[rpArticleCtrl] attachSubtreeToComments(), branch primed for push, digest running: ' + $scope.$$phase);

						branch.data.replies.data.children.push(subtree);

					}
				}
			}
			return;
		} //attachSubtreeToComments

		loadPosts();



		$scope.$on('$destroy', function() {
			console.log('[rpArticleCtrl] onDestroy');
			isDestroyed = true;
			deregisterArticleSortClick();
			deregisterRefresh();
			if ($scope.dialog) {
				$scope.hideProgress();
			}
		});

	}

})();