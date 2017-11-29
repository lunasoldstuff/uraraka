'use strict';

var rpSettingsControllers = angular.module('rpSettingsControllers', []);

rpSettingsControllers.controller('rpSettingsSidenavCtrl', [
    '$scope',
    '$rootScope',
    '$mdDialog',
    '$mdPanel',
    'rpSettingsUtilService',
    'rpLocationUtilService',
    'rpIsMobileViewUtilService',

    function(
        $scope,
        $rootScope,
        $mdDialog,
        $mdPanel,
        rpSettingsUtilService,
        rpLocationUtilService,
        rpIsMobileViewUtilService

    ) {
        $scope.showSettings = function(e) {

            console.log('[rpSettingsSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
            console.log('[rpSettingsSidenavCtrl] $scope.animations: ' + $scope.animations);

            if ((rpSettingsUtilService.settings.settingsDialog && !e.ctrlKey) || rpIsMobileViewUtilService.isMobileView()) {
                $mdDialog.show({
                    controller: 'rpSettingsDialogCtrl',
                    templateUrl: 'rpSettingsDialog.html',
                    clickOutsideToClose: true,
                    escapeToClose: true,
                    locals: {
                        animations: $scope.animations,
                        theme: $scope.theme,
                        tab: 0
                    }


                });

            } else {
                rpLocationUtilService(e, '/settings', '', true, false);
            }

        };

        $scope.$on('$destroy', function() {

        });

    }
]);


rpSettingsControllers.controller('rpSettingsDialogCtrl', [
    '$scope',
    '$rootScope',
    '$mdDialog',
    'rpSettingsUtilService',
    'animations',
    'theme',
    'tab',

    function(
        $scope,
        $rootScope,
        $mdDialog,
        rpSettingsUtilService,
        animations,
        theme,
        tab

    ) {

        console.log('[rpSettingsDialogCtrl] theme: ' + theme);
        $scope.theme = theme;
        $scope.animations = animations;
        $scope.selected = tab;
        // $scope.animations = rpSettingsUtilService.settings.animations;

        $scope.isDialog = true;

        //Close the dialog if user navigates to a new page.
        var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
            $mdDialog.hide();
        });

        var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
            $scope.theme = rpSettingsUtilService.settings.theme;
            console.log('[rpSettingsDialogCtrl] rp_settings_changed, $scope.theme: ' + $scope.theme);
        });

        $scope.$on('$destroy', function() {
            deregisterLocationChangeSuccess();
            deregisterSettingsChanged();
        });

    }
]);

rpSettingsControllers.controller('rpSettingsCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    'rpSettingsUtilService',
    'rpTitleChangeUtilService',
    'rpPremiumSubscriptionUtilService',

    function(
        $scope,
        $rootScope,
        $routeParams,
        rpSettingsUtilService,
        rpTitleChangeUtilService,
        rpPremiumSubscriptionUtilService

    ) {

        console.log('[rpSettingsCtrl]');
        console.log('[rpSettingsCtrl] $scope.theme: ' + $scope.theme);

        if (angular.isUndefined($scope.selected)) {
            $scope.selected = $routeParams.selected ? $routeParams.selected : 0;
        }

        $scope.settings = rpSettingsUtilService.getSettings();
        checkSubscription();

        $scope.themes = [{
            name: 'blue',
            value: 'default'
        }, {
            name: 'indigo',
            value: 'indigo'
        }, {
            name: 'green',
            value: 'green'
        }, {
            name: 'deep-orange',
            value: 'deep-orange'
        }, {
            name: 'red',
            value: 'red'
        }, {
            name: 'pink',
            value: 'pink'
        }, {
            name: 'purple',
            value: 'purple'
        }];

        $scope.fontSizes = [{
            name: 'Smaller',
            value: 'smaller'
        }, {
            name: 'Regular',
            value: 'regular'
        }, {
            name: 'Larger',
            value: 'larger'
        }];


        if (!$scope.isDialog) {
            rpTitleChangeUtilService('Settings', true, true);
            $rootScope.$emit('rp_hide_all_buttons');
            $rootScope.$emit('rp_tabs_hide');

        }

        $scope.settingChanged = function() {
            // rpSettingsUtilService.setSetting(setting, value);
            rpSettingsUtilService.setSettings($scope.settings);
        };

        var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
            $scope.settings = rpSettingsUtilService.getSettings();

        });

        var deregisterPremiumSubscriptionUpdate = $rootScope.$on('rp_premium_subscription_update', function(e, subscription) {
            checkSubscription();
        });

        function checkSubscription() {
            rpPremiumSubscriptionUtilService.isSubscribed(function(isSubscribed) {
                $scope.isSubscribed = isSubscribed;
            });
        }

        $scope.$on('$destroy', function() {
            deregisterSettingsChanged();
            deregisterPremiumSubscriptionUpdate();
        });

    }
]);