(function() {
	'use strict';
	angular.module('rpOverflowMenu').directive('rpOverflowMenu', [rpOverflowMenu]);

	function rpOverflowMenu() {
		return {
			restrict: 'E',
			templateUrl: 'rpOverflowMenu/views/rpOverflowMenu.html'

		};
	}
})();