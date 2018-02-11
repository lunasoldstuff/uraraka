'use strict';

var rpSaveControllers = angular.module('rpSaveControllers', []);

rpSaveControllers.controller('rpSaveButtonCtrl', [
    '$scope',
    'rpSaveUtilService',
    'rpAuthService',
    'rpToastService',

    function(
        $scope,
        rpSaveUtilService,
        rpAuthService,
        rpToastService

    ) {

        $scope.save = function() {
            if (rpAuthService.isAuthenticated) {

                $scope.saved = !$scope.saved;

                rpSaveUtilService($scope.redditId, $scope.saved, function(err, data) {
                    if (err) {
                        console.log('[rpSaveButtonCtrl] err');
                    } else {
                        console.log('[rpSaveButtonCtrl] success');

                    }
                });

            } else {
                rpToastService("you must log in to save posts", "sentiment_neutral");
            }


        };

    }
]);
