'use strict';

(function () {
	'use strict';

	angular.module('rpCaptcha').factory('rpCaptchaNewResourceService', ['$resource', rpCaptchaNewResourceService]);

	function rpCaptchaNewResourceService($resource) {
		return $resource('/api/uauth/new_captcha');
	}
})();