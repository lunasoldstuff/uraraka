(function() {
	'use strict';
	angular.module('rpSearch').directive('rpSearchForm', [rpSearchForm]);

	function rpSearchForm() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchForm.html',
			replace: true
		};
	}
})();