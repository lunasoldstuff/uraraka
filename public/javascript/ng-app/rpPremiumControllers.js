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
    '$rootScope',
    'moment',
    'rpPremiumSubscriptionUtilService',


    function(
        $scope,
        $rootScope,
        moment,
        rpPremiumSubscriptionUtilService

    ) {
        console.log('[rpPremiumSubscriptionCtrl]');

        $scope.subscription = null;
        $scope.showCancelConfirmation = false;
        $scope.cancelling = false;

        rpPremiumSubscriptionUtilService.getSubscription(function(data) {
            console.log('[rpPremiumCtrl] data.id: ' + data.id);
            console.log('[rpPremiumCtrl] data.current_period_start: ' + data.current_period_start);
            $scope.subscription = data;

            $scope.currentPeriodStart = moment(new Date(data.current_period_start)).format("Do MMMM, YYYY");
            $scope.currentPeriodEnd = moment(new Date(data.current_period_end)).format("Do MMMM, YYYY");

            // $scope.currentPeriodStart = new Date(data.current_period_start);

        });

        $scope.toggleCancelConfirmation = function(e) {
            $scope.showCancelConfirmation = !$scope.showCancelConfirmation;
        };

        $scope.cancelSubscription = function(e) {
            $scope.cancelling = true;
            console.log('[rpPremiumSubscriptionCtrl] cancelSubscription()');
            rpPremiumSubscriptionUtilService.cancel(function(data) {
                console.log('[rpPremiumSubscriptionCtrl] cancelSubscription(), subscription canceled');
                $scope.cancelling = false;
            });

        };

        var deregisterPremiumSubscriptionUpdate = $rootScope.$on('rp_premium_subscription_update', function(e, subscription) {
            $scope.subscription = subscription;
        });

        $scope.$on('$destroy', function() {
            deregisterPremiumSubscriptionUpdate();
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