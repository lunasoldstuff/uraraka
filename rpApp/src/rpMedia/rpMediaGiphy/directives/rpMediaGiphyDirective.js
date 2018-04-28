(function() {
	'use strict';
	angular.module('rpMediaGiphy').directive('rpMediaGiphy', [rpMediaGiphy]);

	function rpMediaGiphy() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaGiphy/views/rpMediaGiphy.html',
			controller: 'rpMediaGiphyCtrl'
		};
	}

})();