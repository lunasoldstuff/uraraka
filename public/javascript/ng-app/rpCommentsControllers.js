'use strict';

var rpCommentsControllers = angular.module('rpCommentsControllers', []);

//cid: The current comment id
//used to set style on the focuessed comment.

rpCommentsControllers.controller('rpCommentsCtrl',
	[
		'$scope',
		'rpCommentUtilService',
	
		function(
			$scope,
			rpCommentUtilService
		) {
	
			console.log('[rpCommentsCtrl] loaded.');
			// console.log('[rpCommentsCtrl] $scope.comments[0].data: ' + JSON.stringify($scope.comments[0].data));
	
			$scope.props = {};
	
			$scope.props.identityName = $scope.identity ? $scope.identity.name : "";
			$scope.props.commentId = $scope.commentId || "";
			$scope.propsAuthor = $scope.post.data.author;
			$scope.propsId = $scope.post.data.id;
	
			// console.log('[rpCommentsCtrl] $scope.props: ' + JSON.stringify($scope.props));
			
			$scope.testCommentsCtrl = function() {
				console.log('[rpCommentsCtrl] test success!');
			};
	
	
			/**
			* State functions. 
			* Help check the comment state for template.
			*/
			
			$scope.hasChildren = function(comment) {
				return comment.data.replies && comment.data.replies !== "";
			};
	
			$scope.isDeleted = function(comment) {
				return (
					comment &&
					comment.data.author !== undefined &&
					comment.data.body !== undefined &&
					comment.data.author === '[deleted]' &&
					comment.data.body === '[deleted]'
				)
			};
	
			$scope.isShowMore = function(comment) {
				return comment.kind === 'more' && comment.data.count > 0;	
			};
			
			$scope.isContinueThread = function(comment) {
				return comment.kind === 'more' && comment.data.count === 0 && comment.data.children.length > 0;	
			};
	
			$scope.isHidden = function(comment) {
				//return true if show is undefined
				return comment.show === false;	
			};
	
			$scope.isOp = function(comment) {
				return comment.data.author === $scope.post.data.author; 
			};
			
			$scope.isMine = function(comment) {
				return $scope.identity ? comment.data.author === $scope.identity.name : false;
			};
	
			$scope.isFocussed = function(comment) {
				return comment.data.id === $scope.cid;
			};
			
			$scope.isCollapsed = function(comment) {
				return comment.childrenCollapsed === true;	
			};
	
			$scope.isEditing = function(comment) {
				return comment.editing === true;
			};
			
			$scope.isDeleting = function(comment) {
				return comment.deleting === true;
			};
			
			$scope.isDeleteProgress = function(comment) {
				return comment.deleteProgress === true;
			};
			
			$scope.isReplying = function(comment) {
				return comment.replying === true;
			};
			
			$scope.isLoadingMore = function(comment) {
				return comment.isLoadingMore === true;	
			};
			
			
			
			/**
			* Action functions.
			*/
			
			$scope.collapseChildren = function(comment, index) {
				console.log('[rpCommentsCtrl] collapseChildren() comment.depth: ' + comment.depth);
				
				comment.childrenCollapsed = true;
				
				for (var i = index + 1; i < $scope.flatComments.length; i++) {
					console.log('[rpCommentsCtrl] collapseChildren(), i: ' + i + ', flatComments[i].depth: ' + $scope.flatComments[i].depth);
					if ($scope.flatComments[i].depth > comment.depth) {
						$scope.flatComments[i].show = false;
					} else {
						console.log('[rpCommentsCtrl] collapseChildren(), break, i: ' + i + ', flatComments[i].depth: ' + $scope.flatComments[i].depth);
						
						break;
					}
				}
				
			};
			
			$scope.expandChildren = function(comment, index) {
				console.log('[rpCommentsCtrl] expandChildren()');
				comment.childrenCollapsed = false;
				
				for (var i = index + 1; i < $scope.flatComments.length; i++) {
					if ($scope.flatComments[i].depth > comment.depth) {
						$scope.flatComments[i].show = true;
					} else {
						break;
					}
				}
				
			};
	
			$scope.upvote = function(comment) {
				console.log('[rpCommentsCtrl] upvote()');
			};
			
			$scope.save = function(comment) {
				console.log('[rpCommentsCtrl] save()');
				
			};
			
			$scope.toggleReplying = function(comment) {
				console.log('[rpCommentsCtrl] toggleReplying()');
				//if undefined (or false) make true.
				comment.replying = comment.replying ? false : true;
				 
			};
			
			$scope.toggleDeleting = function(e, comment) {
				console.log('[rpCommentsCtrl] toggleDeleting()');
				
			};
			
			$scope.toggleEditing = function(e, comment) {
				console.log('[rpCommentsCtrl] toggleEditing()');
				
			};
			
			$scope.gild = function(e, comment) {
				console.log('[rpCommentsCtrl] gild()');
				
			};
			
			$scope.confirmDelete = function(e, comment) {
				console.log('[rpCommentsCtrl] confirmDelete()');
				
			};
			
			$scope.showMore = function(comment) {
				console.log('[rpCommentsCtrl] showMore()');
				
			};
			
			$scope.replySubmit = function(comment, index) {
				console.log('[rpCommentsCtrl] replySubmit(), comment.reply: ' + comment.reply);
				
				rpCommentUtilService(comment.data.name, comment.reply,function(err, data) {
				
					if (err) {
						console.log('[rpCommentsCtrl] replySubmit() err');
						
					} else {
						comment.reply = "";
						$scope.toggleReplying(comment);
						
						//add the comment to flatComments.
						data.json.data.things[0].depth = comment.depth + 1;
						$scope.flatComments.splice(index + 1, 0, data.json.data.things[0]);
						
						if (comment.isCollapsed()) {
							$scope.expandChildren(comment);
						}
						
					}
					
				});
				
			}
	
		}
	]
);