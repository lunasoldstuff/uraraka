'use strict';

var rpGildControllers = angular.module('rpGildControllers', []);

rpGildControllers.controller('rpGildButtonCtrl', [
    '$scope',
    'rpGildUtilService',
    'rpAuthService',
    'rpToastUtilService',
    function(
        $scope,
        rpGildUtilService,
        rpAuthService,
        rpToastUtilService

    ) {

        // console.log('[rpGildButtonCtrl]');

        $scope.gild = function() {

            if (rpAuthService.isAuthenticated) {

                rpGildUtilService($scope.redditId, function(err, data) {

                    if (err) {
                        console.log('[rpGildButtonCtrl] err');
                    } else {
                        console.log('[rpGildButtonCtrl] success');
                        $scope.gilded++;
                    }

                });

            } else {
                rpToastUtilService("you must log in to gild posts", "sentiment_neutral");
            }
        };
    }
]);
