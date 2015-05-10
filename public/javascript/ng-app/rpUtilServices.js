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
				controller: 'toastCtrl',
				templateUrl: 'partials/rpToast',
				hideDelay: 2000,
				position: "top left",
			});
		}
	}
]);

rpUtilServices.factory('rpSaveUtilService', ['rpAuthUtilService', 'saveService', 'unsaveService', 'rpToastUtilService',
	function(rpAuthUtilService, saveService, unSaveService, rpToastUtilService) {
		
		return function(post) {

			if (rpAuthUtilService.isAuthenticated) {
				if (post.data.saved) {
					
					post.data.saved = false;
					unsaveService.save({id: post.data.name}, function(data) { });
				} 
				else {
					post.data.saved = true;
					saveService.save({id: post.data.name}, function(data) { });
				}
			} else {
				rpToastUtilService("You've got to log in to save posts");
			}			

		}

	}
]);

rpUtilServices.factory('rpUpvoteUtilService', ['rpAuthUtilService', 'voteService', 'rpToastUtilService',
	function(rpAuthUtilService, voteService, rpToastUtilService) {

		return function(post) {
			if (rpAuthUtilService.isAuthenticated) {
				var dir = post.data.likes ? 0 : 1;
				if (dir == 1)
						post.data.likes = true;
					else
						post.data.likes = null;
				voteService.save({id: post.data.name, dir: dir}, function(data) { });
			} else {
				rpToastUtilService("You've got to log in to vote");
			}
		}

	}
]);

rpUtilServices.factory('rpDownvoteUtilService', ['rpAuthUtilService', 'voteService', 'rpToastUtilService',
	function(rpAuthUtilService, voteService, rpToastUtilService) {

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
				
				voteService.save({id: post.data.name, dir: dir}, function(data) { });

			} else {

				rpToastUtilService("You've got to log in to vote");

			}
		}

	}
]);