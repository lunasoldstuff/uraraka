'use strict';

/**
 * All the components used to manage score and votes.
 * directive, controller and services. 
 */

var rpScoreControllers = angular.module('rpScoreControllers', []);

/**
 * rpScore Controller
 * 
 */
rpScoreControllers.controller('rpScoreCtrl', 
	[
		'$scope', 
		'rpAuthUtilService', 
		'rpToastUtilService', 
		'rpVoteUtilService', 

		function($scope, rpAuthUtilService, rpToastUtilService, rpVoteUtilService) {
			console.log('[rpScoreCtrl]');
	
			$scope.upvote = function() {
				console.log('[rpScoreCtrl] upvote()');
				
				if (rpAuthUtilService.isAuthenticated) {

					var dir;
					var origScore = $scope.score;
					var origLikes = $scope.likes;

					switch ($scope.likes) {
						case true:
						
							dir = 0;
							$scope.score = $scope.score - 1;
							$scope.likes = null;
							break;
						
						case false:
							dir = 1;
							$scope.score = $scope.score + 2;
							$scope.likes = true;
							break;
						
						default:
							dir = 1;
							$scope.score = $scope.score + 1;
							$scope.likes = true;
							
					}
					
					rpVoteUtilService($scope.id, dir, function(err, data) {
						
						if (err) {
							console.log('[rpScoreCtrl] upvote() err.');
							$scope.score = origScore;
							$scope.likes = origLikes;
							rpToastUtilService('Something went wrong trying to upvotes.');
							
						}
						
						else {
							console.log('[rpScoreCtrl] upvote() success.');
							
						}
						
					});
					
				
				} else {
					rpToastUtilService("You must log in to vote");
				}
				
			};
			
			$scope.downvote = function() {
				console.log('[rpScoreCtrl] downvote()');
				
				if (rpAuthUtilService.isAuthenticated) {
					var dir;
					var origScore = $scope.score;
					var origLikes = $scope.likes;
					
					switch($scope.likes) {
						
						case true:
							dir = -1;
							$scope.score = $scope.score -2;
							$scope.likes = false;
							break;
						
						case false:
							dir = 0;
							$scope.score = $scope.score + 1;
							$scope.likes = null;
							break;
						
						default:
							dir = -1;
							$scope.score = $scope.score - 1;
							$scope.likes = false;
						
					}
					
					rpVoteUtilService($scope.id, dir, function(err, data) {
						if (err) {
							rpToastUtilService("Something went wrong tring to downvote.");
							$scope.score = origScore;
							$scope.lieks = origLikes;
							
						} else {
							console.log('[rpScoreCtrl] downvote() success.');
							
						}
					});
					
					
				} else {
					rpToastUtilService("You must log in to vote");
				}
				
				
			};
			
			
	
	
		}
	]
);

// rpScore.factory('')