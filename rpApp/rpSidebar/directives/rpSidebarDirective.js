(function() {
	'use strict';
	angular.module('rpSidebar').directive('rpSidebar', [rpSidebar]);

	function rpSidebar() {
		return {
			restrict: 'E',
			templateUrl: 'rpSidebar/views/rpSidebar.html',
			controller: 'rpSidebarCtrl'
		};
	}

})();