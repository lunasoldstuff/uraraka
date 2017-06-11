'use strict';

var rpSettingsControllers = angular.module('rpSettingsControllers', []);

rpSettingsControllers.controller('rpSettingsSidenavCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'$mdPanel',
	'rpSettingsUtilService',
	'rpLocationUtilService',
	function (
		$scope,
		$rootScope,
		$mdDialog,
		$mdPanel,
		rpSettingsUtilService,
		rpLocationUtilService
	) {



		$scope.showSettings = function ($event) {

			// var panelAnimation = $mdPanel.newPanelAnimation()
			//     .openFrom({
			//         top: document.documentElement.clientHeight,
			//         left: document.documentElement.clientWidth / 2 - 250
			//     }).closeTo({
			//         top: document.documentElement.clientHeight,
			//         left: document.documentElement.clientWidth / 2 - 250
			//     }).withAnimation($mdPanel.animation.SLIDE);
			//
			// var position = $mdPanel.newPanelPosition()
			//     .absolute()
			//     .center();
			//
			// $mdPanel.open({
			//     animation: panelAnimation,
			//     position: position,
			//     attachTo: angular.element(document.body),
			//     controller: 'rpSettingsDialogCtrl',
			//     templateUrl: 'rpSettingsPanel.html',
			//     trapFocus: true,
			//     zIndex: 150,
			//     clickOutsideToClose: true,
			//     clickEscapeToClose: true,
			//     hasBackdrop: true,
			// });




			console.log('[rpSettingsSidenavCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
			console.log('[rpSettingsSidenavCtrl] $scope.animations: ' + $scope.animations);

			if (rpSettingsUtilService.settings.settingsDialog) {
				$mdDialog.show({
					controller: 'rpSettingsDialogCtrl',
					templateUrl: 'rpSettingsDialog.html',
					clickOutsideToClose: true,
					escapeToClose: true,
					locals: {
						animations: $scope.animations
					}


				});

			} else {
				rpLocationUtilService(null, '/settings', '', true, false);
			}

		};

		$scope.$on('$destroy', function () {

		});

	}
]);


rpSettingsControllers.controller('rpSettingsDialogCtrl', [
	'$scope',
	'$rootScope',
	'$location',
	'$timeout',
	'$mdDialog',
	'rpSettingsUtilService',
	'animations',

	function (
		$scope,
		$rootScope,
		$location,
		$timeout,
		$mdDialog,
		rpSettingsUtilService,
		animations
	) {

		$scope.animations = animations;
		// $scope.animations = rpSettingsUtilService.settings.animations;

		$scope.isDialog = true;

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
			$mdDialog.hide();
		});

		$scope.$on('$destroy', function () {
			deregisterLocationChangeSuccess();
		});

	}
]);

rpSettingsControllers.controller('rpSettingsCtrl', [
	'$scope',
	'$rootScope',
	'rpSettingsUtilService',
	'rpTitleChangeUtilService',

	function (
		$scope,
		$rootScope,
		rpSettingsUtilService,
		rpTitleChangeUtilService

	) {

		console.log('[rpSettingsCtrl]');

		$scope.settings = rpSettingsUtilService.getSettings();

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
		}

		];

		if (!$scope.isDialog) {
			rpTitleChangeUtilService('Settings', true, true);
			$rootScope.$emit('rp_hide_all_buttons');
			$rootScope.$emit('rp_tabs_hide');

		}

		$scope.settingChanged = function () {
			// rpSettingsUtilService.setSetting(setting, value);
			rpSettingsUtilService.setSettings($scope.settings);
		};

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
			$scope.settings = rpSettingsUtilService.getSettings();
		});

		$scope.$on('$destroy', function () {
			deregisterSettingsChanged();
		});

	}
]);