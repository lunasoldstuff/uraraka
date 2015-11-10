'use strict';

var rpCommentsControllers = angular.module('rpCommentsControllers', []);

//cid: The current comment id
//used to set style on the focuessed comment.

rpCommentsControllers.controller('rpCommentsCtrl',
	['$scope',
	function(
		$scope
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
		
		$scope.collapseChildren = function(comment) {
			console.log('[rpCommentsCtrl] collapseChildren()')
			comment.childrenCollapsed = true;
		};
		
		$scope.expandChildren = function(comment) {
			console.log('[rpCommentsCtrl] expandChildren()')
			comment.childrenCollapsed = false;
		};

		$scope.upvote = function(comment) {
			console.log('[rpCommentsCtrl] upvote()')
		};
		
		$scope.save = function(comment) {
			console.log('[rpCommentsCtrl] save()')
			
		};
		
		$scope.toggleReplying = function(comment) {
			console.log('[rpCommentsCtrl] toggleReplying()')
			
		};
		
		$scope.toggleDeleting = function(e, comment) {
			console.log('[rpCommentsCtrl] toggleDeleting()')
			
		};
		
		$scope.toggleEditing = function(e, comment) {
			console.log('[rpCommentsCtrl] toggleEditing()')
			
		};
		
		$scope.gild = function(e, comment) {
			console.log('[rpCommentsCtrl] gild()')
			
		};
		
		$scope.confirmDelete = function(e, comment) {
			console.log('[rpCommentsCtrl] confirmDelete()')
			
		};
		
		$scope.showMore = function(comment) {
			console.log('[rpCommentsCtrl] showMore()')
			
		};

	}
]);