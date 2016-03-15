'use strict';

var rpSettingsControllers = angular.module('rpSettingsControllers', []);

rpSettingsControllers.controller('rpSettingsDialogCtrl', ['$scope', '$rootScope', '$location', '$mdDialog', 'rpSettingsUtilService',
	function($scope, $rootScope, $location, $mdDialog, rpSettingsUtilService) {

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

rpSettingsControllers.controller('rpSettingsCtrl', ['$scope', '$rootScope', 'rpSettingsUtilService', 'rpTitleChangeService',
	function($scope, $rootScope, rpSettingsUtilService, rpTitleChangeService) {

		console.log('[rpSettingsCtrl]');

		$scope.settings = rpSettingsUtilService.getSettings();

		$scope.themes = [{
				name: 'orange',
				value: 'default'
			}, {
				name: 'blue',
				value: 'blue'
			}, {
				name: 'indigo',
				value: 'indigo'
			}, {
				name: 'green',
				value: 'green'
			}, {
				name: 'red',
				value: 'red'
			}, {
				name: 'pink',
				value: 'pink'
			}, {
				name: 'purple',
				value: 'purple'
			}

		];

		if (!$scope.isDialog) {
			rpTitleChangeService.prepTitleChange('Settings');
		}

		$scope.settingChanged = function() {
			// rpSettingsUtilService.setSetting(setting, value);
			rpSettingsUtilService.setSettings($scope.settings);
		};

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function() {
			$scope.settings = rpSettingsUtilService.getSettings();
		});

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
		});

	}
]);

rpSettingsControllers.controller('rpSettingsSidenavCtrl', ['$scope', '$rootScope', '$mdDialog', 'rpSettingsUtilService', 'rpLocationUtilService',
	function($scope, $rootScope, $mdDialog, rpSettingsUtilService, rpLocationUtilService) {

		$scope.showSettings = function(e) {

			if (rpSettingsUtilService.settings.settingsDialog) {
				$mdDialog.show({
					controller: 'rpSettingsDialogCtrl',
					templateUrl: 'partials/rpSettingsDialog',
					targetEvent: e,
					clickOutsideToClose: true,
					// openFrom: {
					// 	top: 1500
					// },
					// closeTo: {
					// 	left: 1500
					// },
					escapeToClose: true
				});

			} else {
				rpLocationUtilService(null, '/settings', '', true, false);
			}

		};

		$scope.$on('$destroy', function() {});

	}
]);