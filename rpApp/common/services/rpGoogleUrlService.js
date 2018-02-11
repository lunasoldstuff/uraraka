(function() {
	angular.module('rpApp').factory('rpGoogleUrlService', rpGoogleUrlService);

	function rpGoogleUrlService(rpGoogleUrlResourceService) {
		return function(longUrl, callback) {
			console.log('[rpGoogleUrlService] longUrl: ' + longUrl);
			rpGoogleUrlResourceService.save({
				longUrl: longUrl
			}, function(data) {

				if (typeof data === Error) {
					callback(data, null);
				} else {
					console.log('[rpGoogleUrlService] data: ' + console.log(JSON.stringify(data)));
					callback(null, data);
				}

			});
		};
	}

})();