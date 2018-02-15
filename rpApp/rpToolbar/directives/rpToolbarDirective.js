(function() {
	'use strict';
	angular.module('rpToolbar').directive('rpToolbar', [rpToolbar]);

	function rpToolbar() {
		return {
			restrict: 'E',
			templateUrl: 'rpToolbar/views/rpToolbar.html',
			controller: 'rpToolbarCtrl'

		};
	}
})();