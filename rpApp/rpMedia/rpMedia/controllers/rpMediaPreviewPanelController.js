(function() {
	'use strict';
	angular.module('rpMedia').controller('rpMediaPreviewPanelCtrl', [
		'$scope',
		'mdPanelRef',
		'rpAppSettingsService',
		'post',
		rpMediaPreviewPanelCtrl
	]);

	function rpMediaPreviewPanelCtrl($scope, mdPanelRef, rpAppSettingsService, post) {
		$scope.post = post;
		$scope.theme = rpAppSettingsService.settings.theme;
		console.log('[rpMediaPreviewPanelCtrl] $scope.theme: ' + $scope.theme);

		$scope.close = function(e) {
			console.log('[rpMediaImagePanelCtrl] close()');
			mdPanelRef.close().then(function() {
				mdPanelRef.destroy();
			});
		};
	}

})();