(function() {
	'use strict';
	angular.module('rpMessage').directive('rpMessageCompose', [rpMessageCompose]);

	function rpMessageCompose() {

		return {
			restrict: 'C',
			templateUrl: 'rpMessage/views/rpMessageCompose.html',
			controller: 'rpMessageComposeCtrl'
		};

	}

})();