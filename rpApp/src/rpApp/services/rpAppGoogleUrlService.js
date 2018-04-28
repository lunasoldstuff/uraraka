(function() {
	'use strict';

	angular.module('rpApp').factory('rpAppGoogleUrlService', [
		'rpAppGoogleUrlResourceService',
		rpAppGoogleUrlService
	]);

	function rpAppGoogleUrlService(rpAppGoogleUrlResourceService) {
		return function(longUrl, callback) {
			console.log('[rpAppGoogleUrlService] longUrl: ' + longUrl);
			rpAppGoogleUrlResourceService.save({
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