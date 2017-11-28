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
                    controller: 'rpSettingsDialogCtrl',
                    templateUrl: 'rpSettingsDialog.html',
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    locals: {
                        animations: $scope.animations,
                        theme: $scope.theme,
                        tab: 1
                    }
                });

            } else {
                rpLocationUtilService(e, '/settings', 'selected=1', true, false);
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

rpPremiumControllers.controller('rpPremiumCtrl', [
    '$scope',
    '$rootScope',
    '$mdDialog',
    '$mdBottomSheet',
    'rpPremiumSubscriptionUtilService',

    function(
        $scope,
        $rootScope,
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

        checkSubscription();

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