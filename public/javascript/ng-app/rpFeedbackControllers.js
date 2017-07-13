'use strict';

var rpFeedbackControllers = angular.module('rpFeedbackControllers', []);

rpFeedbackControllers.controller('rpFeedbackSidenavCtrl', [
    '$scope',
    '$mdDialog',
    'rpSettingsUtilService',
    'rpLocationUtilService',
    'rpAuthUtilService',
    'rpToastUtilService',
    'rpIsMobileViewUtilService',
    function (
        $scope,
        $mdDialog,
        rpSettingsUtilService,
        rpLocationUtilService,
        rpAuthUtilService,
        rpToastUtilService,
        rpIsMobileViewUtilService
    ) {

        console.log('[rpFeedbackSidenavCtrl] load');

        $scope.showFeedback = function (e) {
            console.log('[rpFeedbackSidenavCtrl] showFeedback()');
            // if (rpAuthUtilService.isAuthenticated) {

            if ((rpSettingsUtilService.settings.submitDialog && !e.ctrlKey) || rpIsMobileViewUtilService.isMobileView()) {
                $mdDialog.show({
                    controller: 'rpFeedbackDialogCtrl',
                    templateUrl: 'rpFeedbackDialog.html',
                    targetEvent: e,
                    clickOutsideToClose: false,
                    escapeToClose: false,
                });

            } else {
                rpLocationUtilService(e, '/feedback', '', true, false);
            }
            // } else {
            //     rpToastUtilService("you must log in to submit feedback", "sentiment_neutral");
            // }

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
        };
    }
]);

rpFeedbackControllers.controller('rpFeedbackFormCtrl', [
    '$scope',
    '$timeout',
    '$mdDialog',
    '$window',
    'rpFeedbackUtilService',
    'rpLocationUtilService',
    'rpIdentityUtilService',

    function (
        $scope,
        $timeout,
        $mdDialog,
        $window,
        rpFeedbackUtilService,
        rpLocationUtilService,
        rpIdentityUtilService

    ) {
        console.log('[rpFeedbackFormCtrl]');

        $scope.showButtons = true;
        $scope.showSubmit = true;
        $scope.showFeedback = false;
        $scope.feedbackMessage = "";
        $scope.showFeedbackAlert = false;

        function resetForm() {
            $scope.text = "";
            $scope.title = "";
            $scope.showButtons = true;
            $scope.showSubmit = true;
            $scope.feedbackMessage = "";
            $scope.showFeedbackAlert = false;
            angular.element('#feedback-title').focus();
        }

        $scope.submitForm = function () {
            console.log('[rpFeedbackFormCtrl] submitForm()');

            $scope.showProgress = true;
            $scope.showButtons = false;
            $scope.showFeedback = false;
            $scope.feedbackMessage = "";
            $scope.showFeedbackAlert = false;
            $scope.showFeedbackSuccess = false;

            var name;

            rpIdentityUtilService.getIdentity(function (identity) {
                name = identity.name === null ? 'user not logged in' : identity.name;

                console.log('[rpFeedbackFormCtrl] $scope.title: ' + $scope.title);
                console.log('[rpFeedbackFormCtrl] $scope.text: ' + $scope.text);
                console.log('[rpFeedbackFormCtrl] name: ' + name);

                rpFeedbackUtilService($scope.title, $scope.text, name, function (err, data) {

                    if (err) {
                        console.log('[rpFeedbackFormCtrl] err');
                        console.log('[rpFeedbackFormCtrl] err: ' + JSON.stringify(err));
                        $scope.showProgress = false;
                        $scope.showSubmit = true;
                        $scope.showButtons = true;
                        // $timeout(angular.noop, 0);

                    } else {
                        console.log('[rpFeedbackFormCtrl] success');
                        $scope.feedbackMessage = "Email sent.";
                        $scope.showFeedbackSuccess = true;
                        $scope.showFeedback = true;
                        $scope.showProgress = false;
                        $scope.showAnother = true;
                        $scope.showSubmit = false;
                        $scope.showButtons = true;
                        //$timeout(angular.noop, 0);

                    }

                });

            });
        };

        $scope.resetForm = function () {
            resetForm();
        };

        $scope.closeDialog = function (e) {
            console.log('[rpFeedbackFormCtrl] closeDialog()');

            if ($scope.isDialog) {
                console.log('[rpFeedbackFormCtrl] closeDialog: Dialog.');
                $mdDialog.hide();
            } else {
                console.log('[rpFeedbackFormCtrl] closeDialog: $window.history.length: ' + $window.history.length);

                if ($window.history.length > 1) {
                    $window.history.back();

                } else {
                    rpLocationUtilService(null, '/', '', true, false);
                }

            }

        };
    }
]);
