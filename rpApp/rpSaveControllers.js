'use strict';

var rpSaveControllers = angular.module('rpSaveControllers', []);

rpSaveControllers.controller('rpSaveButtonCtrl', [
    '$scope',
    'rpSaveUtilService',
    'rpAppAuthService',
    'rpAppToastService',

    function(
        $scope,
        rpSaveUtilService,
        rpAppAuthService,
        rpAppToastService

    ) {

        $scope.save = function() {
            if (rpAppAuthService.isAuthenticated) {

                $scope.saved = !$scope.saved;

                rpSaveUtilService($scope.redditId, $scope.saved, function(err, data) {
                    if (err) {
                        console.log('[rpSaveButtonCtrl] err');
                    } else {
                        console.log('[rpSaveButtonCtrl] success');

                    }
                });

            } else {
                rpAppToastService("you must log in to save posts", "sentiment_neutral");
            }


        };

    }
]);
