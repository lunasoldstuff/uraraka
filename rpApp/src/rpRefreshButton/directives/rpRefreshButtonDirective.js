(function() {
	'use strict';
	angular.module('rpRefreshButton').directive('rpRefreshButton', [rpRefreshButton]);

	function rpRefreshButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpRefreshButton/views/rpRefreshButton.html',
			controller: 'rpRefreshButtonCtrl'
		};
	}
})();