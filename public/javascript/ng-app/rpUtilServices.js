'use strict';

var rpUtilServices = angular.module('rpUtilServices', []);

rpUtilServices.factory('rpAuthUtilService', function() {

	var rpAuthUtilService = {};
	
	rpAuthUtilService.isAuthenticated = false;
	
	rpAuthUtilService.setAuthenticated = function(authenticated) {
		rpAuthUtilService.isAuthenticated = authenticated;
	}

	return rpAuthUtilService;

});

rpUtilServices.factory('rpToastUtilService', ['$mdToast', 
	function($mdToast) {
		return function(message) {
			$mdToast.show({
				locals: {toastMessage: message},
				controller: 'rpToastCtrl',
				templateUrl: 'partials/rpToast',
				hideDelay: 2000,
				position: "top left",
			});
		}
	}
]);

rpUtilServices.factory('rpSaveUtilService', ['rpAuthUtilService', 'rpSaveService', 'rpUnsaveService', 'rpToastUtilService',
	function(rpAuthUtilService, rpSaveService, rpUnSaveService, rpToastUtilService) {
		
		return function(post) {

			if (rpAuthUtilService.isAuthenticated) {
				if (post.data.saved) {
					
					post.data.saved = false;
					rpUnsaveService.save({id: post.data.name}, function(data) { });
				} 
				else {
					post.data.saved = true;
					rpSaveService.save({id: post.data.name}, function(data) { });
				}
			} else {
				rpToastUtilService("You've got to log in to save posts");
			}			

		}

	}
]);

rpUtilServices.factory('rpUpvoteUtilService', ['rpAuthUtilService', 'rpVoteService', 'rpToastUtilService',
	function(rpAuthUtilService, rpVoteService, rpToastUtilService) {

		return function(post) {
			if (rpAuthUtilService.isAuthenticated) {
				var dir = post.data.likes ? 0 : 1;
				if (dir == 1)
						post.data.likes = true;
					else
						post.data.likes = null;
				rpVoteService.save({id: post.data.name, dir: dir}, function(data) { });
			} else {
				rpToastUtilService("You've got to log in to vote");
			}
		}

	}
]);

rpUtilServices.factory('rpDownvoteUtilService', ['rpAuthUtilService', 'rpVoteService', 'rpToastUtilService',
	function(rpAuthUtilService, rpVoteService, rpToastUtilService) {

		return function(post) {
			
			if (rpAuthUtilService.isAuthenticated) {
				
				var dir;

				if (post.data.likes === false) {
					dir = 0;
				} else {
					dir = -1;
				}

				if (dir == -1)
						post.data.likes = false;
					else
						post.data.likes = null;
				
				rpVoteService.save({id: post.data.name, dir: dir}, function(data) { });

			} else {

				rpToastUtilService("You've got to log in to vote");

			}
		}

	}
]);

rpUtilServices.factory('rpPostCommentUtilService', ['rpAuthUtilService', 'rpCommentService', 'rpToastUtilService', 
	function(rpAuthUtilService, rpCommentService, rpToastUtilService) {
		return function(name, comment, callback) {
			if (rpAuthUtilService.isAuthenticated) {

				if (comment) {
					
					rpCommentService.save({
						parent_id: name,
						text: comment

					}, function(data) {
						
						rpToastUtilService("Comment Posted :)")

						callback(data);

					});
				}

			} else {
				rpToastUtilService("You've got to log in to post comments");
			}			
		}
	}	
]);
