'use strict';

var rpCommentControllers = angular.module('rpCommentControllers', []);


rpCommentControllers.controller('rpCommentCtrl',
	[
		'$scope',
		'$rootScope',
		'$element',
		'$compile',
		'$filter',
		'$mdDialog',
		'rpMoreChildrenUtilService',
		'rpIdentityUtilService',
		'rpAuthUtilService',
		'rpCommentsUtilService',

	function(
		$scope,
		$rootScope,
		$element,
		$compile,
		$filter,
		$mdDialog,
		rpMoreChildrenUtilService,
		rpIdentityUtilService,
		rpAuthUtilService,
		rpCommentsUtilService

	) {

		/**
		 * Set state variables used in the view.
		 */

		$scope.thisController = this;
		$scope.isDeleted = $scope.comment && $scope.comment.data.author !== undefined && $scope.comment.data.body !== undefined &&
			$scope.comment.data.author === '[deleted]' && $scope.comment.data.body === '[deleted]';
		$scope.childDepth = $scope.depth + 1;
		$scope.isReplying = false;
		$scope.isChildrenCollapsed = false;
		$scope.isEditing = false;
		$scope.isLoadingMoreChildren = false;
		$scope.isMine = $scope.identity ? $scope.comment.data.author === $scope.identity.name : false;
		$scope.isFocussed = $scope.cid === $scope.comment.data.id;
		$scope.isOp = $scope.post ? $scope.comment.data.author === $scope.post.data.author : false;
		$scope.isComment = $scope.comment.kind === 't1';
		$scope.isShowMore = $scope.comment.kind === 'more' && $scope.comment.data.count > 0;
		$scope.isContinueThread = $scope.comment.kind === 'more' && $scope.comment.data.count === 0 && $scope.comment.data.children.length > 0;
		$scope.hasChildren = $scope.comment && $scope.comment.data.replies && $scope.comment.data.replies !== "";

		$scope.currentComment = $scope.comment;

		/**
		 * DIRECTIVES CTRL API
		 * */

		 $scope.thisController = this;

		this.addComment = function(data, post) {

			if ($scope.isReplying) {
				$scope.toggleReplying();
			}

			console.log('[rpCommentCtrl] this.addComment()');

			if (!$scope.comment.data.replies) {

				$scope.childDepth = $scope.depth + 1;

				$scope.comment.data.replies = {

					data: {
						children: data.json.data.things
					}

				};

				$scope.hasChildren = true;

			} else {

				if ($scope.isChildrenCollapsed === true) {
					$scope.expandChildren();
				}

				$scope.comment.data.replies.data.children.unshift(data.json.data.things[0]);

			}
		};

		this.completeDelete = function(id) {
			console.log('[rpCommentCtrl] this.completeDelete()');
			this.isDeleting = false;
			$scope.isDeleted = true;

		};

		this.completeEdit = function() {
			$scope.reloadComment(function() {
				$scope.isEditing = false;
			});
		};

		/**
		 * SCOPE FUNCTIONS
		 * */

		$scope.toggleReplying = function(e) {
			$scope.isReplying = !$scope.isReplying;
		};

		$scope.toggleEditing = function(e) {
			console.log('[rpCommentCtrl] toggleEditing()');
			$scope.isEditing = !$scope.isEditing;

		};

		$scope.collapseChildren = function() {
			$scope.isChildrenCollapsed = true;
		};

		$scope.expandChildren = function() {
			$scope.isChildrenCollapsed = false;
		};

		$scope.showMore = function() {
			$scope.isLoadingMoreChildren = true;

			if (!$scope.sort) {
				$scope.sort = 'confidence';

			}

			// console.log('[rpCommentCtrl] showMore(), sort: ' + $scope.sort);
			// console.log('[rpCommentCtrl] showMore(), link_id: ' + $scope.post.data.name);
			// console.log('[rpCommentCtrl] showMore(), children: ' + $scope.comment.data.children.join(","));

			rpMoreChildrenUtilService($scope.sort, $scope.post.data.name, $scope.comment.data.children.join(","),
				function(err, data) {
					$scope.isLoadingMoreChildren = false;

					if (err) {
						console.log('[rpCommentCtrl] err loading more children.');
					} else {

						var children = new Array(0);
						console.log('[rpCommentCtrl] data: ' + JSON.stringify(data));
						children[0] = data.json.data.things[0];

						for (var i = 1; i < data.json.data.things.length; i++) {
							console.log('[rpCommentCtrl] do you even for loop bro: ' + i);

							children = insertComment(data.json.data.things[i], children);

							if (data.json.data.things[i].data.parent_id === $scope.comment.data.parent_id) {
								// console.log('[rpCommentCtrl] top level comment detected: ' + data.json.data.things[i].data.name);
								children.push(data.json.data.things[i]);
							}
						}

						if ($scope.parent.data && $scope.parent.data.replies && $scope.parent.data.replies !== '' && $scope.parent.data.replies.data.children.length > 1) {
							$scope.parent.data.replies.data.children.pop();
							$scope.parent.data.replies.data.children = $scope.parent.data.replies.data.children.concat(children);
						} else {
							console.log('[rpCommentCtrl] adding one lonely comment, children: ' + JSON.stringify(children));
							$scope.parent.data.replies = {
								data: {
									children: children
								}
							};
						}

					}
				}
			);
		};


		function reloadComment(callback) {
			console.log('[rpCommentCtrl] reloadComment()');

			rpCommentsUtilService(
				$scope.comment.data.subreddit,
				$filter('rp_name_to_id36')($scope.comment.data.link_id),
				'hot',
				$scope.comment.data.id,
				0,
				function(err, data) {
					if (err) {
						console.log('[rpCommentCtrl] err');
					} else {
						$scope.comment = data.data[1].data.children[0];
						$scope.isEditing = false;

						if (callback) {
							callback();
						}

					}

				}
			);
		}

	}

]);

function insertComment(insert, children) {

	for (var i = 0; i < children.length; i++) {


		if (insert.data.parent_id === children[i].data.name) {

			if (children[i].data.replies && children[i].data.replies !== '') {
				children[i].data.replies.data.children.push(insert);
			} else {
				children[i].data.replies = {
					data: {
						children: [insert]
					}
				};
			}

		} else if (insert.data.name === children[i].data.parent_id) {

			insert.data.replies = {
				data: {
					children: [children[i]]
				}
			};

			children.splice(i, 1);

			children.push(insert);

		} else {

			if (children[i].data.replies && children[i].data.replies !== '') {
				children[i].data.replies.children = insertComment(insert, children[i].data.replies.data.children);
			}

		}
	}

	return children;
}

rpCommentControllers.controller('rpCommentEditFormCtrl', ['$scope', 'rpEditUtilService',
	function ($scope, rpEditUtilService) {
		console.log('[rpCommentEditFormCtrl] loaded.');

		if ($scope.$parent && $scope.$parent.comment.data) {
			$scope.editText = $scope.$parent.comment.data.body;
		}

		$scope.submit = function() {
			console.log('[rpCommentEditFormCtrl] submit()');
			$scope.isSubmitting = true;

			rpEditUtilService($scope.editText, $scope.$parent.comment.data.name, function(err, data) {
				if (err) {
					console.log('[rpCommentEditFormCtrl] err');

				} else {
					$scope.$parent.reloadComment();
					$scope.isSubmitting = false;
				}
			});
		};
	}
]);
