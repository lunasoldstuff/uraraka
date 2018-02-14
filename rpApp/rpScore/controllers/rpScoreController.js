(function() {
	'use strict';

	angular.module('rpScore').controller('rpScoreCtrl', [
		'$scope',
		'rpAppAuthService',
		'rpAppToastService',
		'rpVoteUtilService',
		rpScoreCtrl
	]);

	function rpScoreCtrl($scope, rpAppAuthService, rpAppToastService, rpVoteUtilService) {
		console.log('[rpScoreCtrl]');

		$scope.upvote = function() {
			console.log('[rpScoreCtrl] upvote()');

			if (rpAppAuthService.isAuthenticated) {

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

				rpVoteUtilService($scope.redditId, dir, function(err, data) {

					if (err) {
						console.log('[rpScoreCtrl] upvote() err.');
						$scope.score = origScore;
						$scope.likes = origLikes;
						rpAppToastService('something went wrong trying to upvote', "sentiment_dissatisfied");

					} else {
						console.log('[rpScoreCtrl] upvote() success.');

					}

				});


			} else {
				rpAppToastService("you must log in to vote", "sentiment_neutral");
			}

		};

		$scope.downvote = function() {
			console.log('[rpScoreCtrl] downvote()');

			if (rpAppAuthService.isAuthenticated) {
				var dir;
				var origScore = $scope.score;
				var origLikes = $scope.likes;

				switch ($scope.likes) {

					case true:
						dir = -1;
						$scope.score = $scope.score - 2;
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

				rpVoteUtilService($scope.redditId, dir, function(err, data) {
					if (err) {
						rpAppToastService("something went wrong tring to downvote", "sentiment_dissatisfied");
						$scope.score = origScore;
						$scope.lieks = origLikes;

					} else {
						console.log('[rpScoreCtrl] downvote() success.');

					}
				});


			} else {
				rpAppToastService("you must log in to vote", "sentiment_neutral");
			}


		};
	}
})();