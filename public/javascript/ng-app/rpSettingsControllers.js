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

		$rootScope.$on('settings_changed', function() {
			$scope.settings = rpSettingsUtilService.getSettings();
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
		$scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

	}
]);