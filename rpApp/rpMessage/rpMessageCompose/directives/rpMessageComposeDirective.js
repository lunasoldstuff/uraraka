(function() {
	'use strict';
	angular.module('rpMessageCompose').directive('rpMessageCompose', [rpMessageCompose]);

	function rpMessageCompose() {

		return {
			restrict: 'C',
			templateUrl: 'rpMessage/rpMessageCompose/views/rpMessageCompose.html',
			controller: 'rpMessageComposeCtrl'
		};

	}

})();