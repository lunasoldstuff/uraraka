(function() {
	'use strict';
	angular.module('rpSlideshow').controller('rpSlideshowSettingsPanelCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'rpAppSettingsService',
		rpSlideshowSettingsPanelCtrl
	]);

	function rpSlideshowSettingsPanelCtrl(
		$scope,
		$rootScope,
		$timeout,
		rpAppSettingsService
	) {
		console.log('[rpSlideshowSettingsCtrl]');
		$scope.time = rpAppSettingsService.settings.slideshowTime / 1000;
		$scope.theme = rpAppSettingsService.settings.theme;

		$timeout(function() {
			$scope.slideshowHeader = rpAppSettingsService.settings.slideshowHeader;
			$scope.slideshowHeaderFixed = rpAppSettingsService.settings.slideshowHeaderFixed;
			$scope.slideshowAutoplay = rpAppSettingsService.settings.slideshowAutoplay;
			console.log('[rpSlideshowSettingsCtrl] slideshowHeaderFixed: ' + $scope.slideshowHeaderFixed);
			console.log('[rpSlideshowSettingsCtrl] slideshowAutoplay: ' + $scope.slideshowAutoplay);
		}, 0);


		$scope.timeSettingChanged = function() {
			console.log('[rpSlideshowSettingsCtrl] timeSettingChanged()');
			rpAppSettingsService.setSetting('slideshowTime', $scope.time * 1000);
		};

		$scope.headerSettingChanged = function() {
			console.log('[rpSlideshowSettingsCtrl] headerSettingChanged()');
			rpAppSettingsService.setSetting('slideshowHeader', $scope.slideshowHeader);
		};

		$scope.headerFixedSettingChanged = function() {
			console.log('[rpSlideshowSettingsCtrl] headerFixedSettingChanged()');
			rpAppSettingsService.setSetting('slideshowHeaderFixed', $scope.slideshowHeaderFixed);
		};

		$scope.autoplaySettingChanged = function() {
			console.log('[rpSlideshowSettingsCtrl] autoplaySettingChanged() $scope.slideshowAutoplay: ' + $scope.slideshowAutoplay);
			rpAppSettingsService.setSetting('slideshowAutoplay', $scope.slideshowAutoplay);
		};

		$scope.$on('$destroy', function() {
			$rootScope.$emit('rp_slideshow_show_header');
		});

	}
})();