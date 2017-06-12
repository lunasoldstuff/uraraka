'use strict';

var rpFeedbackControllers = angular.module('rpFeedbackControllers', []);

rpFeedbackControllers.controller('rpFeedbackSidenavCtrl', [
    '$scope',
    '$mdDialog',
    'rpSettingsUtilService',
    'rpLocationUtilService',
    'rpAuthUtilService',
    'rpToastUtilService',
    function (
        $scope,
        $mdDialog,
        rpSettingsUtilService,
        rpLocationUtilService,
        rpAuthUtilService,
        rpToastUtilService
    ) {

        console.log('[rpFeedbackSidenavCtrl] load');

        $scope.showFeedback = function (e) {
            console.log('[rpFeedbackSidenavCtrl] showFeedback()');
            if (rpAuthUtilService.isAuthenticated) {

                if (rpSettingsUtilService.settings.submitDialog) {
                    $mdDialog.show({
                        controller: 'rpFeedbackDialogCtrl',
                        templateUrl: 'rpFeedbackDialog.html',
                        targetEvent: e,
                        clickOutsideToClose: true,
                        escapeToClose: true,
                    });

                } else {
                    rpLocationUtilService(e, '/feedback', '', true, false);
                }
            } else {
                rpToastUtilService("you must log in to submit feedback", "sentiment_neutral");
            }

        };
    }
]);

rpFeedbackControllers.controller('rpFeedbackDialogCtrl', [
    '$scope',
    'rpSettingsUtilService',
    function ($scope, rpSettingsUtilService) {
        console.log('[rpFeedbackDialogCtrl] load');
        $scope.isDialog = true;
        $scope.animations = rpSettingsUtilService.settings.animations;
    }
]);

rpFeedbackControllers.controller('rpFeedbackCtrl', [
    '$scope',
    function ($scope) {
        console.log('[rpFeedbackCtrl] load');
        $scope.isFeedback = true;

        $scope.formatting = false;
        $scope.toggleFormatting = function () {
            $scope.formatting = !$scope.formatting;
        }
    }
]);
