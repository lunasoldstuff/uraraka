'use strict';

var rpSettingsControllers = angular.module('rpSettingsControllers', []);


rpSettingsControllers.controller('rpSettingsCtrl', ['$scope', '$rootScope', 'rpSettingsUtilService', 
	function($scope, $rootScope, rpSettingsUtilService) {

		console.log('[rpSettingsCtrl]');

		$scope.settings = rpSettingsUtilService.getSettings();

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

rpSettingsControllers.controller('rpSettingsSidenavCtrl', ['$scope', '$mdDialog',
	function ($scope, $mdDialog) {

		$scope.showSettings = function(e) {
			$mdDialog.show({
				controller: 'rpSettingsDialogCtrl',
				templateUrl: 'partials/rpSettings',
				targetEvent: e,
				clickOutsideToClose: true,
				escapeToClose: true
			});
		};

	}
]);

rpSettingsControllers.controller('rpSettingsDialogCtrl', ['$scope', '$rootScope', '$location', '$mdDialog', 'rpSettingsUtilService',
	function($scope, $rootScope, $location, $mdDialog, rpSettingsUtilService) {
		
		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

		$scope.$on('$destroy', function() {
			deregisterLocationChangeSuccess();
		});

	}
]);