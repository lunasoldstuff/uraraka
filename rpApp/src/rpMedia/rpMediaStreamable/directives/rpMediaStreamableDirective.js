(function() {
	'use strict';
	angular.module('rpMediaStreamable').directive('rpMediaStreamable', [rpMediaStreamable]);

	function rpMediaStreamable() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaStreamable/views/rpMediaStreamable.html',
			controller: 'rpMediaStreamableCtrl'
		};
	}

})();