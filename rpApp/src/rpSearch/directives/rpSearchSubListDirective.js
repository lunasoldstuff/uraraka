(function() {
	'use strict';
	angular.module('rpSearch').directive('rpSearchSubList', [rpSearchSubList]);

	function rpSearchSubList() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchSubList.html'
		};
	}
})();