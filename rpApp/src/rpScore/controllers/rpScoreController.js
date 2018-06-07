(function () {
  'use strict';

  function rpScoreCtrl(
    $scope,
    rpAppAuthService,
    rpToastService,
    rpScoreVoteService,
    rpLoginService
  ) {
    console.log('[rpScoreCtrl]');

    $scope.upvote = function (e) {
      console.log('[rpScoreCtrl] upvote()');

      if (rpAppAuthService.isAuthenticated) {
        let dir;
        let origScore = $scope.score;
        let origLikes = $scope.likes;

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
            rpToastService(
              'something went wrong trying to upvote',
              'sentiment_dissatisfied'
            );
          } else {
            console.log('[rpScoreCtrl] upvote() success.');
          }
        });
      } else {
        rpLoginService.showDialog();
      }
    };

    $scope.downvote = function (e) {
      console.log('[rpScoreCtrl] downvote()');

      if (rpAppAuthService.isAuthenticated) {
        let dir;
        let origScore = $scope.score;
        let origLikes = $scope.likes;

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
            rpToastService(
              'something went wrong tring to downvote',
              'sentiment_dissatisfied'
            );
            $scope.score = origScore;
            $scope.lieks = origLikes;
          } else {
            console.log('[rpScoreCtrl] downvote() success.');
          }
        });
      } else {
        rpLoginService.showDialog();
      }
    };
  }

  angular
    .module('rpScore')
    .controller('rpScoreCtrl', [
      '$scope',
      'rpAppAuthService',
      'rpToastService',
      'rpScoreVoteService',
      'rpLoginService',
      rpScoreCtrl
    ]);
}());
