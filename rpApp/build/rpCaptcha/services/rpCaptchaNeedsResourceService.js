'use strict';

(function () {
	'use strict';

	angular.module('rpCaptcha').factory('rpCaptchaNeedsResourceService', ['$resource', rpCaptchaNeedsResourceService]);

	function rpCaptchaNeedsResourceService($resource) {
		return $resource('/api/uauth/needs_captcha');
	}
})();