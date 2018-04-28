(function() {
	'use strict';
	angular.module('rpPlus').directive('rpPlusSidenavAd', [rpPlusSidenavAd]);

	function rpPlusSidenavAd() {
		return {
			restrict: 'E',
			templateUrl: 'rpPlus/views/rpPlusSidenavAd.html',
			controller: 'rpPlusSidenavCtrl'
		};
	}

})();