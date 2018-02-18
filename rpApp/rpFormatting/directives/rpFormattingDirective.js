(function() {
	'use strict';
	angular.module('rpFormatting').directive('rpFormatting', [rpFormatting]);

	function rpFormatting() {
		return {
			restrict: 'E',
			templateUrl: 'rpFormatting/views/rpFormatting.html',
		};

	}
})();