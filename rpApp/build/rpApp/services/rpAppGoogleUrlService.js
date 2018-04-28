'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	'use strict';

	angular.module('rpApp').factory('rpAppGoogleUrlService', ['rpAppGoogleUrlResourceService', rpAppGoogleUrlService]);

	function rpAppGoogleUrlService(rpAppGoogleUrlResourceService) {
		return function (longUrl, callback) {
			console.log('[rpAppGoogleUrlService] longUrl: ' + longUrl);
			rpAppGoogleUrlResourceService.save({
				longUrl: longUrl
			}, function (data) {

				if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === Error) {
					callback(data, null);
				} else {
					console.log('[rpAppGoogleUrlService] data: ' + console.log(JSON.stringify(data)));
					callback(null, data);
				}
			});
		};
	}
})();