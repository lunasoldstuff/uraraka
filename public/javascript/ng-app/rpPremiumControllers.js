'use strict';

var rpPremiumControllers = angular.module('rpPremiumControllers', []);

rpPremiumControllers.controller('rpPremiumSidenavCtrl', [
    '$scope',
    '$rootScope',
    '$mdDialog',
    'rpSettingsUtilService',
    'rpLocationUtilService',
    'rpIsMobileViewUtilService',
    'rpPremiumSubscriptionUtilService',

    function(
        $scope,
        $rootScope,
        $mdDialog,
        rpSettingsUtilService,
        rpLocationUtilService,
        rpIsMobileViewUtilService,
        rpPremiumSubscriptionUtilService

    ) {
        console.log('[rpPremiumSidenavCtrl] load');

        checkSubscription();
        $scope.showPremium = function(e) {

            console.log('[rpPremiumSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
            console.log('[rpPremiumSidenavCtrl] $scope.animations: ' + $scope.animations);

            if ((rpSettingsUtilService.settings.settingsDialog && !e.ctrlKey) || rpIsMobileViewUtilService.isMobileView()) {
                $mdDialog.show({
                    controller: 'rpPremiumDialogCtrl',
                    templateUrl: 'rpPremiumDialog.html',
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    locals: {
                        animations: $scope.animations,
                        theme: $scope.theme
                    }
                });
            } else {
                rpLocationUtilService(e, '/premium/upgrade', '', true, false);
            }
        };

        var deregisterPremiumSubscriptionUpdate = $rootScope.$on('rp_premium_subscription_update', function(e, subscription) {
            checkSubscription();
        });

        function checkSubscription() {
            rpPremiumSubscriptionUtilService.isSubscribed(function(isSubscribed) {
                $scope.isSubscribed = isSubscribed;
            });
        }

        $scope.$on('$destroy', function() {
            deregisterPremiumSubscriptionUpdate();
        });
    }
]);

rpPremiumControllers.controller('rpPremiumDialogCtrl', [
    '$scope',
    '$mdDialog',
    'animations',
    'theme',

    function(
        $scope,
        $mdDialog,
        animations,
        theme

    ) {
        console.log('[rpPremiumDialogCtrl]');
        console.log('[rpPremiumDialogCtrl] theme: ' + theme);
        $scope.theme = theme;
        $scope.animations = animations;
        // $scope.animations = rpSettingsUtilService.settings.animations;

        $scope.isDialog = true;

        //Close the dialog if user navigates to a new page.
        var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
            $mdDialog.hide();
        });

        $scope.$on('$destroy', function() {
            deregisterLocationChangeSuccess();
        });
    }
]);

rpPremiumControllers.controller('rpPremiumSubscriptionDialogCtrl', [
    '$scope',
    '$mdDialog',
    'animations',
    'theme',

    function(
        $scope,
        $mdDialog,
        animations,
        theme

    ) {
        console.log('[rpPremiumSubscriptionDialogCtrl]');
        console.log('[rpPremiumSubscriptionDialogCtrl] theme: ' + theme);
        $scope.theme = theme;
        $scope.animations = animations;
        // $scope.animations = rpSettingsUtilService.settings.animations;

        $scope.isDialog = true;

        //Close the dialog if user navigates to a new page.
        var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
            $mdDialog.hide();
        });

        $scope.$on('$destroy', function() {
            deregisterLocationChangeSuccess();
        });
    }
]);

rpPremiumControllers.controller('rpPremiumCtrl', [
    '$scope',
    '$mdDialog',
    '$mdBottomSheet',
    'rpPremiumSubscriptionUtilService',

    function(
        $scope,
        $mdDialog,
        $mdBottomSheet,
        rpPremiumSubscriptionUtilService
    ) {
        console.log('[rpPremiumCtrl]');

        $scope.toggleShowForm = function(e) {
            console.log('[rpPremiumCtrl] showForm()');
            $scope.showForm = !$scope.showForm;
        };

        $scope.closeDialog = function(e) {
            $mdDialog.hide();
            $mdBottomSheet.hide();
        };

    }
]);

rpPremiumControllers.controller('rpPremiumSubscriptionCtrl', [
    '$scope',
    'rpPremiumSubscriptionUtilService',

    function(
        $scope,
        rpPremiumSubscriptionUtilService
    ) {
        console.log('[rpPremiumSubscriptionCtrl]');


        rpPremiumSubscriptionUtilService.getSubscription(function(data) {
            console.log('[rpPremiumCtrl] getSubscription, data.id: ' + data.id);
            $scope.subscription = data;



        });


    }
]);

// rpPremiumControllers.controller('rpPremiumFormCtrl', [
//     '$scope',
//     function($scope) {
//         console.log('[rpPremiumFormCtrl]');
//
//         $scope.submit = function(e) {
//             console.log('[rpPremiumFormCtrl] submit()');
//
//
//
//
//         };
//
//     }
// ]);