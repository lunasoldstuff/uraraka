(function() {
	'use strict';

	angular.module('rpApp').factory('rpAppGoogleUrlService', [
		'rpGoogleUrlResourceService',
		rpAppGoogleUrlService
	]);

	function rpAppGoogleUrlService(rpGoogleUrlResourceService) {
		return function(longUrl, callback) {
			console.log('[rpAppGoogleUrlService] longUrl: ' + longUrl);
			rpGoogleUrlResourceService.save({
				longUrl: longUrl
			}, function(data) {

				if (typeof data === Error) {
					callback(data, null);
				} else {
					console.log('[rpAppGoogleUrlService] data: ' + console.log(JSON.stringify(data)));
					callback(null, data);
				}

			});
		};
	}

})();