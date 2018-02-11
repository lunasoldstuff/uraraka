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
rpScoreControllers.controller('rpScoreCtrl', [
    '$scope',
    'rpAuthService',
    'rpToastUtilService',
    'rpVoteUtilService',

    function($scope, rpAuthService, rpToastUtilService, rpVoteUtilService) {
        // console.log('[rpScoreCtrl]');

        $scope.upvote = function() {
            console.log('[rpScoreCtrl] upvote()');

            if (rpAuthService.isAuthenticated) {

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
                        rpToastUtilService('something went wrong trying to upvote', "sentiment_dissatisfied");

                    } else {
                        console.log('[rpScoreCtrl] upvote() success.');

                    }

                });


            } else {
                rpToastUtilService("you must log in to vote", "sentiment_neutral");
            }

        };

        $scope.downvote = function() {
            console.log('[rpScoreCtrl] downvote()');

            if (rpAuthService.isAuthenticated) {
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
                        rpToastUtilService("something went wrong tring to downvote", "sentiment_dissatisfied");
                        $scope.score = origScore;
                        $scope.lieks = origLikes;

                    } else {
                        console.log('[rpScoreCtrl] downvote() success.');

                    }
                });


            } else {
                rpToastUtilService("you must log in to vote", "sentiment_neutral");
            }


        };




    }
]);

// rpScore.factory('')
