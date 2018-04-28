'use strict';

(function () {
	'use strict';

	angular.module('rpCaptcha').factory('rpCaptchaService', ['rpAppAuthService', 'rpToastService', 'rpAppRedditApiService', rpCaptchaService]);

	function rpCaptchaService(rpAppAuthService, rpToastService, rpAppRedditApiService) {

		var rpCaptchaService = {};

		rpCaptchaService.needsCaptcha = function (callback) {

			rpAppRedditApiService.redditRequest('get', '/api/needs_captcha', {}, function (data) {

				console.log('[rpCaptchaService] needsCaptcha, data: ' + JSON.stringify(data));
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};

		rpCaptchaService.newCaptcha = function (callback) {

			rpAppRedditApiService.redditRequest('post', '/api/new_captcha', {}, function (data) {
				console.log('[rpCaptchaService] newCaptcha, data: ' + JSON.stringify(data));
				if (data.responseError) {
					callback(data, null);
				} else {
					callback(null, data);
				}
			});
		};

		return rpCaptchaService;
	}
})();