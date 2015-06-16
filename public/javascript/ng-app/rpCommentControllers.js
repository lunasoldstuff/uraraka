'use strict';

var rpCommentControllers = angular.module('rpCommentControllers', []);


rpCommentControllers.controller('rpCommentCtrl', ['$scope', '$rootScope', '$element', '$compile', 'rpMoreChildrenService',
	'rpSaveUtilService', 'rpUpvoteUtilService', 'rpDownvoteUtilService',
	function($scope, $rootScope, $element, $compile, rpMoreChildrenService, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService) {

		$scope.childDepth = $scope.depth + 1;

		$scope.showReply = false;

		$scope.childrenCollapsed = false;


		if ($scope.comment.data.replies && $scope.comment.data.replies !== "") {
			console.log('$scope.comment.data.replies.data.children.length: ' + $scope.comment.data.replies.data.children.length);
			$scope.hasChildren = true;
		} else {

		}


		var children = {};

		$scope.showMore = function() {
			$scope.loadingMoreChildren = true;
			rpMoreChildrenService.query({
				sort: $scope.sort,
				link_id: $scope.post.data.name,
				children: $scope.comment.data.children.join(",")
			}, function(data) {
				$scope.loadingMoreChildren = false;
				$scope.moreChildren = data.json.data.things;
				$compile("<rp-comment ng-repeat='comment in moreChildren' " + 
					"comment='comment' depth='depth' post='post' sort='sort'></rp-comment>")
					($scope, function(cloned, scope) {
						$element.replaceWith(cloned);
					});				
			});
		};

		$scope.toggleReply = function() {
			$scope.showReply = !$scope.showReply;
		};

		$scope.savePost = function() {
			rpSaveUtilService($scope.comment);
		};

		$scope.upvotePost = function() {
			rpUpvoteUtilService($scope.comment);
		};

		$scope.downvotePost = function() {
			rpDownvoteUtilService($scope.comment);
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


	}
]);

rpCommentControllers.controller('rpCommentReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {


		$scope.postCommentReply = function(name, comment) {

			rpPostCommentUtilService(name, comment, function(data) {

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

					$scope.$parent.comment.data.replies.data.children.unshift(data.json.data.things[0]);
					
				}

			});

		};
	}
]);

/*
	Determine the type of the media link
 */
rpCommentControllers.controller('rpCommentMediaCtrl', ['$scope', '$element',
	function($scope, $element) {
		$scope.redditLink = false;
		if ($scope.href.indexOf('/r/') === 0) {
		 	$scope.redditLink = true;
		}
	}
]);