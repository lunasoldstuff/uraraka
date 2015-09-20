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
		'rpMoreChildrenService',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',
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
		rpMoreChildrenService,
		rpSaveUtilService,
		rpUpvoteUtilService,
		rpDownvoteUtilService,
		rpIdentityUtilService,
		rpAuthUtilService,
		rpCommentsUtilService

	) {

		console.log('[rpCommentCtrl] loaded, $scope.$id: ' + $scope.$id);
		console.log('[rpCommentCtrl] $scope.cid: ' + $scope.cid);
		console.log('[rpCommentCtrl] $scope.sort: ' + $scope.sort);
		console.log('[rpCommentCtrl] $scope.depth: ' + $scope.depth);
		console.log('[rpCommentCtrl] $scope.comment.data: ' + JSON.stringify($scope.comment.data));

		$scope.childDepth = $scope.depth + 1;
		$scope.showReply = false;
		$scope.childrenCollapsed = false;
		$scope.isMine = false;
		$scope.deleted = false;
		$scope.editing = false;


		if ($scope.comment && 
			$scope.comment.data.author !== undefined && 
			$scope.comment.data.body !== undefined &&
			$scope.comment.data.author === '[deleted]' &&
			$scope.comment.data.body === '[deleted]'
		) {
			$scope.deleted = true;
			
			if (rpAuthUtilService.isAuthenticated) {
				rpIdentityUtilService.getIdentity(function(identity) {
					$scope.isMine = ($scope.comment.data.author.toLowerCase() === identity.name.toLowerCase());
				});
			}
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

		$scope.deleteComment = function(e) {
			console.log('[rpCommentCtrl] deleteComment: ' + $scope.comment.data.id);

			$mdDialog.show({
				templateUrl: 'partials/rpDeleteDialog',
				controller: 'rpCommentDeleteCtrl',
				targetEvent: e,
				clickOutsideToClose: true,
				escapeToClose: true,
				scope: $scope,
				preserveScope: true,
			
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
						$scope.comment = data[1].data.children[0];
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
			
			rpMoreChildrenService.query({
				sort: $scope.sort,
				link_id: $scope.post.data.name,
				children: $scope.comment.data.children.join(",")
			
			}, function(data) {
				
				$scope.loadingMoreChildren = false;

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

				if ($scope.parent.data.replies && $scope.parent.data.replies !== '' && $scope.parent.data.replies.data.children.length > 1) {
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

			});
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

rpCommentControllers.controller('rpCommentReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {


		$scope.postCommentReply = function(name, comment) {

			rpPostCommentUtilService(name, comment, function(err, data) {

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

/*
	Determine the type of the media link
 */
rpCommentControllers.controller('rpCommentMediaCtrl', ['$scope', '$element', '$filter',
	function($scope, $element, $filter) {

		// $scope.isMedia = $filter('rp_media_type')($scope.href) !== null;

		// var redditRe = /^(?:https?:\/\/)?(?:www\.)?(?:np\.)?(?:(?:reddit\.com)|(\/?r\/)|(\/?u\/)){1,2}([\S]+)?$/i;

		// $scope.redditLink = redditRe.test($scope.href);
		// // console.log('[rpCommentMediaCtrl] $scope.redditLink: ' + $scope.redditLink);
		


		// if ($scope.redditLink) {
		// 	console.log('[rpCommentMediaCtrl] $scope.href: ' + $scope.href);
		// 	var groups = redditRe.exec($scope.href);
		// 	console.log('[rpCommentMediaCtrl] groups: ' + groups.length + ' [' + groups.toString() + ']');

		// 	var newHref = "";

		// 	for (var i = 1; i < groups.length; i++) {
		// 		if (groups[i] !== undefined)
		// 			newHref += groups[i];
		// 	}

		// 	console.log('[rpCommentMediaCtrl] newHref: ' + newHref);

		// 	$scope.href = newHref;
		// }

		// if ($scope.href.indexOf('/r/') === 0) {
		//  	$scope.redditLink = true;

		// }
	}
]);

rpCommentControllers.controller('rpCommentDeleteCtrl', ['$scope', '$mdDialog', 'rpDeleteUtilService',
	function ($scope, $mdDialog, rpDeleteUtilService) {

		console.log('[rpCommentDeleteCtrl] $scope.comment.data.name: ' + $scope.comment.data.name);
		$scope.type = "comment";
		$scope.deleting = false;

		$scope.confirm = function() {
			console.log('[rpCommentDeleteCtrl] confirm()');
			$scope.deleting = true;

			rpDeleteUtilService($scope.comment.data.name, function(err, data) {
				if (err) {
					console.log('[rpCommentDeleteCtrl] err');
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