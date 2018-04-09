(function() {
	'use strict';
	angular.module('rpNightTheme').directive('rpNightThemeButton', [rpNightThemeButton]);

	function rpNightThemeButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpNightTheme/views/rpNightThemeButton.html',
			controller: 'rpNightThemeButtonCtrl'
		};
	}
})();