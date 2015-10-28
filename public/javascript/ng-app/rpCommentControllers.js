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
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',
		'rpIdentityUtilService',
		'rpAuthUtilService',
		'rpCommentsUtilService',
		'rpGildUtilService',
		'rpDeleteUtilService',

	function(
		$scope,
		$rootScope,
		$element,
		$compile,
		$filter,
		$mdDialog,
		rpMoreChildrenUtilService,
		rpSaveUtilService,
		rpUpvoteUtilService,
		rpDownvoteUtilService,
		rpIdentityUtilService,
		rpAuthUtilService,
		rpCommentsUtilService,
		rpGildUtilService,
		rpDeleteUtilService

	) {

		console.log('[rpCommentCtrl] loaded.');

		$scope.childDepth = $scope.depth + 1;
		$scope.showReply = false;
		$scope.childrenCollapsed = false;
		$scope.deleted = false;
		$scope.editing = false;
		$scope.deleting = false;
		$scope.isMine = $scope.comment.data.author === $scope.identity.name;	
		$scope.isFocussed = $scope.cid === $scope.comment.data.id;
		$scope.isOp = $scope.comment.data.author === $scope.post.data.author;

		$scope.isShowMore = $scope.comment.kind === 'more' && $scope.comment.data.count > 0;
		$scope.isContinueThread = $scope.comment.kind === 'more' && $scope.comment.data.count === 0 && $scope.comment.data.children.length > 0;

		if ($scope.comment && 
			$scope.comment.data.author !== undefined && 
			$scope.comment.data.body !== undefined &&
			$scope.comment.data.author === '[deleted]' &&
			$scope.comment.data.body === '[deleted]'
		) {
			console.log('[rpCommentCtrl] check author identity');
			$scope.deleted = true;
			
		}

		if ($scope.comment &&
			$scope.comment.data.replies && 
			$scope.comment.data.replies !== "") {
			$scope.hasChildren = true;
		} else {
			$scope.hasChildren = false;
		}

		var children = {};
		
		$scope.currentComment = $scope.comment;

		$scope.toggleReply = function() {
			$scope.showReply = !$scope.showReply;
		};

		$scope.savePost = function() {
			rpSaveUtilService($scope.comment, function(err, data) {

				if (err) {

				} else {
					
				}

			});
		};

		$scope.upvotePost = function() {
			rpUpvoteUtilService($scope.comment, function(err, data) {

				if (err) {

				} else {
					
				}

			});
		};

		$scope.downvotePost = function() {
			rpDownvoteUtilService($scope.comment, function(err, data) {

				if (err) {

				} else {
					
				}

			});
		};

		$scope.gildComment = function(e) {
			console.log('[rpCommentsCtrl] gildPost(), $scope.comment.data.name: ' + $scope.comment.data.name);

			rpGildUtilService($scope.comment.data.name, function(err, data) {

				if (err) {

				} else {
					$scope.comment.data.gilded++;
				}


			});


		};

		$scope.toggleDeleting = function(e) {
			$scope.deleting = !$scope.deleting;
		};

		$scope.confirmDeleteComment = function(e) {
			console.log('[rpCommentCtrl] confirmDeleteComment() $scope.comment.data.name: ' + $scope.comment.data.name);
			$scope.deleteProgress = true;

			rpDeleteUtilService($scope.comment.data.name, function(err, data) {
				if (err) {
					console.log('[rpCommentCtrl] confirmDeleteComment() err');
					console.log('[rpCommentsDeleteCtrl] err');
				} else {
					console.log('[rpCommentCtrl] confirmDeleteComment() delete complete');
					$scope.deleting = false;
					$scope.deleteProgress = false;
					$scope.deleted = true;
				}

			});
		};

		$scope.editComment = function(e) {
			console.log('[rpCommentCtrl] editComment()');
			$scope.editing = !$scope.editing;

		};

		$scope.reloadComment = function() {
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
						$scope.editing = false;
						
					}					

				});
		};

		$scope.collapseChildren = function() {
			$scope.childrenCollapsed = true;
			children = $scope.comment.data.replies.data.children;
			$scope.comment.data.replies.data.children = {};
		};

		$scope.expandChildren = function() {
			$scope.childrenCollapsed = false;
			$scope.comment.data.replies.data.children = children;
			children = {};
		};

		$scope.showMore = function() {
			$scope.loadingMoreChildren = true;
			
			if (!$scope.sort)
				$scope.sort = 'confidence';
			
			console.log('[rpCommentCtrl] sort: ' + $scope.sort);	
			console.log('[rpCommentCtrl] link_id: ' + $scope.post.data.name);	
			console.log('[rpCommentCtrl] children: ' + $scope.comment.data.children.join(","));	
			
			rpMoreChildrenUtilService($scope.sort, $scope.post.data.name, $scope.comment.data.children.join(","), 
				function(err, data) {
					$scope.loadingMoreChildren = false;

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

rpCommentControllers.controller('rpCommentReplyFormCtrl', ['$scope', 'rpCommentUtilService',
	function($scope, rpCommentUtilService) {


		$scope.postCommentReply = function(name, comment) {

			rpCommentUtilService(name, comment, function(err, data) {

				if (err) {
					console.log('[rpCommentReplyCtrl] err');
				} else {
					$scope.reply = "";
					$scope.rpPostReplyForm.$setUntouched();


					if ($scope.$parent.showReply) {

						$scope.$parent.toggleReply();

					}

					/*
						Add the comment to the thread.					
					 */
					


					if (!$scope.$parent.comment.data.replies) {
						
						$scope.$parent.childDepth = $scope.$parent.depth + 1;

						$scope.$parent.comment.data.replies = {
							
							data: {
								children: data.json.data.things
							}

						};

					} else {

						if ($scope.$parent.childrenCollapsed === true) {
							$scope.$parent.expandChildren();
						}

						$scope.$parent.comment.data.replies.data.children.unshift(data.json.data.things[0]);
						
					}
				}

			});

		};
	}
]);

rpCommentControllers.controller('rpCommentEditFormCtrl', ['$scope', 'rpEditUtilService', 
	function ($scope, rpEditUtilService) {
		console.log('[rpCommentEditFormCtrl] loaded.');

		if ($scope.$parent && $scope.$parent.comment.data) {
			$scope.editText = $scope.$parent.comment.data.body;
		}

		$scope.submit = function() {
			console.log('[rpCommentEditFormCtrl] submit()');
			$scope.submitting = true;

			rpEditUtilService($scope.editText, $scope.$parent.comment.data.name, function(err, data) {
				if (err) {
					console.log('[rpCommentEditFormCtrl] err');

				} else {
					$scope.$parent.reloadComment();
					$scope.submitting = false;
				}
			});
		};
	}
]);