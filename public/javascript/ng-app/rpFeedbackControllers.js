'use strict';

var rpFeedbackControllers = angular.module('rpFeedbackControllers', []);

rpFeedbackControllers.controller('rpFeedbackSidenavCtrl', [
    '$scope',
    '$mdDialog',
    'rpSettingsUtilService',
    'rpLocationUtilService',
    function(
        $scope,
        $mdDialog,
        rpSettingsUtilService,
        rpLocationUtilService
    ) {

        console.log('[rpFeedbackSidenavCtrl] load');

        $scope.showFeedback = function(e) {
            console.log('[rpFeedbackSidenavCtrl] showFeedback()');
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

        };
    }
]);

rpFeedbackControllers.controller('rpFeedbackDialogCtrl', [
    '$scope',
    'rpSettingsUtilService',
    function($scope, rpSettingsUtilService) {
        console.log('[rpFeedbackDialogCtrl] load');
        $scope.isDialog = true;
        $scope.animations = rpSettingsUtilService.settings.animations;
    }
]);

rpFeedbackControllers.controller('rpFeedbackCtrl', [
    '$scope',
    function($scope) {
        console.log('[rpFeedbackCtrl] load');
        $scope.isFeedback = true;
    }
]);
