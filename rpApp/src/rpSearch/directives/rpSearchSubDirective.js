(function() {
	'use strict';
	angular.module('rpSearch').directive('rpSearchSub', [rpSearchSub]);

	function rpSearchSub() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchSub.html'
		};
	}
})();