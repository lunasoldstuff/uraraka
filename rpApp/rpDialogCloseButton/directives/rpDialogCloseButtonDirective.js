(function() {
	'use strict';
	angular.module('rpDialogCloseButton').directive('rpDialogCloseButton', [rpDialogCloseButton]);

	function rpDialogCloseButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpDialogCloseButton/views/rpDialogCloseButton.html',
			controller: 'rpDialogCloseButtonCtrl'
		};
	}
})();