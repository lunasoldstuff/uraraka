(function() {
	'use strict';
	angular.module('rpSearch').directive('rpSearchLinkList', [rpSearchLinkList]);

	function rpSearchLinkList() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchLinkList.html'
		};
	}

})();