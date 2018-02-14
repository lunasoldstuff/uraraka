(function() {
	'use strict';
	angular.module('rpSearch').directive('rpSearchLink', [rpSearchLink]);

	function rpSearchLink() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchLink.html'
		};
	}

})();