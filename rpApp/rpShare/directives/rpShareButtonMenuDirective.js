(function() {
	'use strict';
	angular.module('rpShare').directive('rpShareButtonMenu', [rpShareButtonMenu]);

	function rpShareButtonMenu() {
		return {
			restrict: 'E',
			templateUrl: 'rpShare/views/rpShareButtonMenu.html',
			controller: 'rpShareButtonCtrl',
			scope: {
				post: '='
			}
		};
	}
})();