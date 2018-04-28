(function() {
	'use strict';
	angular.module('rpCaptcha').factory('rpCaptchaResourceService', [
		'$resource',
		rpCaptchaResourceService
	]);

	function rpCaptchaResourceService($resource) {
		return $resource('/api/uauth/captcha/:iden');
	}
})();