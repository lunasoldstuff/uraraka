(function() {
	'use strict';
	angular.module('rpCaptcha').directive('rpCaptcha', rpCaptcha);

	function rpCaptcha() {
		return {
			restrict: 'E',
			templateUrl: 'rpCaptcha/views/rpCaptcha.html',
			controller: 'rpCaptchaCtrl'
		};
	}
})();