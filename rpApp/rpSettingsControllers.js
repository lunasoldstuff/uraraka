'use strict';

var rpSettingsControllers = angular.module('rpSettingsControllers', []);

rpSettingsControllers.controller('rpSettingsSidenavCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'$mdPanel',
	'rpAppSettingsService',
	'rpAppLocationService',
	'rpAppIsMobileViewService',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		$mdPanel,
		rpAppSettingsService,
		rpAppLocationService,
		rpAppIsMobileViewService

	) {
		$scope.showSettings = function(e) {

			console.log('[rpSettingsSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpSettingsSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpAppSettingsService.settings.settingsDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
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
				rpAppLocationService(e, '/settings', '', true, false);
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
	'rpAppSettingsService',
	'animations',
	'theme',
	'tab',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		rpAppSettingsService,
		animations,
		theme,
		tab

	) {

		console.log('[rpSettingsDialogCtrl] theme: ' + theme);
		$scope.theme = theme;
		$scope.animations = animations;
		$scope.selected = tab;
		// $scope.animations = rpAppSettingsService.settings.animations;

		$scope.isDialog = true;

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			$scope.theme = rpAppSettingsService.settings.theme;
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
	'rpAppSettingsService',
	'rpAppTitleChangeService',
	'rpPlusSubscriptionUtilService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		rpAppSettingsService,
		rpAppTitleChangeService,
		rpPlusSubscriptionUtilService

	) {

		console.log('[rpSettingsCtrl]');
		console.log('[rpSettingsCtrl] $scope.theme: ' + $scope.theme);

		if (angular.isUndefined($scope.selected)) {
			$scope.selected = $routeParams.selected === 'plus' ? 1 : 0;
		}

		console.log('[rpSettingsCtrl] $scope.selected: ' + $scope.selected);
		console.log('[rpSettingsCtrl] $routeParams.selected: ' + $routeParams.selected);


		$scope.settings = rpAppSettingsService.getSettings();
		rpPlusSubscriptionUtilService.isSubscribed(function(isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

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
			rpAppTitleChangeService('Settings', true, true);
			$rootScope.$emit('rp_hide_all_buttons');
			$rootScope.$emit('rp_tabs_hide');

		}

		$scope.settingChanged = function() {
			// rpAppSettingsService.setSetting(setting, value);
			rpAppSettingsService.setSettings($scope.settings);
		};

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			$scope.settings = rpAppSettingsService.getSettings();

		});

		var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
			deregisterPlusSubscriptionUpdate();
		});

	}
]);