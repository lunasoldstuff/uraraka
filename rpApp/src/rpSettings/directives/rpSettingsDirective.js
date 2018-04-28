(function() {
	'use strict';
	angular.module('rpSettings').directive('rpSettings', [rpSettings]);

	function rpSettings() {
		return {
			restrict: 'C',
			templateUrl: 'rpSettings/views/rpSettings.html',
			controller: 'rpSettingsCtrl',
		};
	}

})();