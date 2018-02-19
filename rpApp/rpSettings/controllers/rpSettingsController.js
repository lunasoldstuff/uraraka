(function() {
	'use strict';
	angular.module('rpSettings').controller('rpSettingsCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		'rpAppSettingsService',
		'rpAppTitleChangeService',
		'rpPlusSubscriptionService',
		rpSettingsCtrl
	]);

	function rpSettingsCtrl(
		$scope,
		$rootScope,
		$routeParams,
		rpAppSettingsService,
		rpAppTitleChangeService,
		rpPlusSubscriptionService

	) {

		console.log('[rpSettingsCtrl]');
		console.log('[rpSettingsCtrl] $scope.theme: ' + $scope.theme);

		if (angular.isUndefined($scope.selected)) {
			$scope.selected = $routeParams.selected === 'plus' ? 1 : 0;
		}

		console.log('[rpSettingsCtrl] $scope.selected: ' + $scope.selected);
		console.log('[rpSettingsCtrl] $routeParams.selected: ' + $routeParams.selected);


		$scope.settings = rpAppSettingsService.getSettings();
		rpPlusSubscriptionService.isSubscribed(function(isSubscribed) {
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
})();