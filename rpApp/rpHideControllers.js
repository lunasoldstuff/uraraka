'use strict';

var rpHideControllers = angular.module('rpHideControllers', []);

rpHideControllers.controller('rpHideButtonCtrl', [
    '$scope',
    '$rootScope',
    'rpHideUtilService',
    'rpAuthService',
    'rpToastUtilService',

    function (
        $scope,
        $rootScope,
        rpHideUtilService,
        rpAuthService,
        rpToastUtilService

    ) {

        console.log('[rpHideButtonCtrl] $scope.isHidden: ' + $scope.isHidden);

        $scope.hide = function () {

            console.log('[rpHideButtonCtrl] hide(), $scope.redditId: ' + $scope.redditId);
            console.log('[rpHideButtonCtrl] hide(), $scope.parentCtrl.$id: ' + $scope.parentCtrl.$id);

            if (rpAuthService.isAuthenticated) {
                rpHideUtilService($scope.redditId, $scope.isHidden, function (err, data) {
                    if (err) {
                        console.log('[rpHideButtonCtrl] err');
                    } else {
                        console.log('[rpHideButtonCtrl] success');
                        // $scope.parentCtrl.completeHiding($scope.redditId);
                        $scope.$emit('rp_hide_post', $scope.redditId);
                    }
                });

            } else {
                rpToastUtilService("you must log in to hide posts", "sentiment_neutral");
            }

        };

    }
]);
