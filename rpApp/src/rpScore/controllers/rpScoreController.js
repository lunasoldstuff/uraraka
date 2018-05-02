(function () {
  'use strict';

  angular.module('rpScore')
    .controller('rpScoreCtrl', [
      '$scope',
      'rpAppAuthService',
      'rpToastService',
      'rpScoreVoteService',
      rpScoreCtrl
    ]);

  function rpScoreCtrl($scope, rpAppAuthService, rpToastService, rpScoreVoteService) {
    console.log('[rpScoreCtrl]');

    $scope.upvote = function () {
      console.log('[rpScoreCtrl] upvote()');

      if (rpAppAuthService.isAuthenticated) {
        var dir;
        var origScore = $scope.score;
        var origLikes = $scope.likes;

        switch ($scope.likes) {
          case true:

            dir = 0;
            $scope.score -= 1;
            $scope.likes = null;
            break;

          case false:
            dir = 1;
            $scope.score += 2;
            $scope.likes = true;
            break;

          default:
            dir = 1;
            $scope.score += 1;
            $scope.likes = true;
        }

        rpScoreVoteService($scope.redditId, dir, function (err, data) {
          if (err) {
            console.log('[rpScoreCtrl] upvote() err.');
            $scope.score = origScore;
            $scope.likes = origLikes;
            rpToastService('something went wrong trying to upvote', 'sentiment_dissatisfied');
          } else {
            console.log('[rpScoreCtrl] upvote() success.');
          }
        });
      } else {
        rpToastService('you must log in to vote', 'sentiment_neutral');
      }
    };

    $scope.downvote = function () {
      console.log('[rpScoreCtrl] downvote()');

      if (rpAppAuthService.isAuthenticated) {
        var dir;
        var origScore = $scope.score;
        var origLikes = $scope.likes;

        switch ($scope.likes) {
          case true:
            dir = -1;
            $scope.score -= 2;
            $scope.likes = false;
            break;

          case false:
            dir = 0;
            $scope.score += 1;
            $scope.likes = null;
            break;

          default:
            dir = -1;
            $scope.score -= 1;
            $scope.likes = false;
        }

        rpScoreVoteService($scope.redditId, dir, function (err, data) {
          if (err) {
            rpToastService('something went wrong tring to downvote', 'sentiment_dissatisfied');
            $scope.score = origScore;
            $scope.lieks = origLikes;
          } else {
            console.log('[rpScoreCtrl] downvote() success.');
          }
        });
      } else {
        rpToastService('you must log in to vote', 'sentiment_neutral');
      }
    };
  }
}());
