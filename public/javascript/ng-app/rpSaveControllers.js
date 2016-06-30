'use strict';

var rpSaveControllers = angular.module('rpSaveControllers', []);

rpSaveControllers.controller('rpSaveButtonCtrl', [
    '$scope',
    'rpSaveUtilService',
    'rpAuthUtilService',
    'rpToastUtilService',

    function(
        $scope,
        rpSaveUtilService,
        rpAuthUtilService,
        rpToastUtilService

    ) {

        $scope.save = function() {
            if (rpAuthUtilService.isAuthenticated) {

                $scope.saved = !$scope.saved;

                rpSaveUtilService($scope.redditId, $scope.saved, function(err, data) {
                    if (err) {
                        console.log('[rpSaveButtonCtrl] err');
                    } else {
                        console.log('[rpSaveButtonCtrl] success');

                    }
                });

            } else {
                rpToastUtilService("you must log in to save posts", "sentiment_neutral");
            }


        };

    }
]);
