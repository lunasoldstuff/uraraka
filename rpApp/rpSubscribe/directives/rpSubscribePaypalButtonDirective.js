(function() {
	'use strict';
	angular.module('rpSubscribe').directive('rpSubscribePaypalButton', [rpSubscribePaypalButton]);

	function rpSubscribePaypalButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpSubscribe/views/rpSubscribePaypalButton.html'
		};
	}
})();