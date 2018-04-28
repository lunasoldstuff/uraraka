'use strict';

(function () {
	'use strict';

	angular.module('rpApp').factory('rpAppGoogleUrlResourceService', ['$resource', rpAppGoogleUrlResourceService]);

	function rpAppGoogleUrlResourceService($resource) {

		return $resource('https://www.googleapis.com/urlshortener/v1/url', {
			key: 'AIzaSyCie8StCg7EAAOECOjLa3qEMocvi7YhQfU'
		});
	}
})();