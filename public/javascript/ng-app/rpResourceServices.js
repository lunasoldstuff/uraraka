'use strict';

var rpResourceServices = angular.module('rpResourceServices', ['ngResource']);

rpResourceServices.factory('rpUserRefreshTokenResource', ['$resource',
	function($resource) {
		return $resource('/auth/usertoken');
	}
]);

rpResourceServices.factory('rpServerRefreshTokenResourceService', ['$resource',
	function($resource) {
		return $resource('/auth/servertoken');
	}
]);


/*
	rp api.
 */

rpResourceServices.factory('rpSettingsResourceService', ['$resource',
	function($resource) {
		return $resource('/settings');
	}
]);

rpResourceServices.factory('rpShareEmailResourceService', ['$resource',
	function($resource) {
		return $resource('/share');
	}
]);

/*
	Gets an imgur albums information.
 */

rpResourceServices.factory('rpImgurAlbumResourceService', ['$resource',
	function($resource) {
		return $resource('https://api.imgur.com/3/album/:id', {}, {
			get: {
				headers: {
					'Authorization': 'Client-ID a912803498adcd4'
				}
			}
		});
	}
]);

rpResourceServices.factory('rpImgurGalleryResourceService', ['$resource',
	function($resource) {
		return $resource(' https://api.imgur.com/3/gallery/:id', {}, {
			get: {
				headers: {
					'Authorization': 'Client-ID a912803498adcd4'
				}
			}
		});
	}
]);

rpResourceServices.factory('rpTweetResourceService', ['$resource',
	function($resource) {
		return $resource('/twitter/status/:id');
	}
]);

rpResourceServices.factory('rpGoogleUrlResourceService', ['$resource',
	function($resource) {

		return $resource('https://www.googleapis.com/urlshortener/v1/url', {
			key: 'AIzaSyCie8StCg7EAAOECOjLa3qEMocvi7YhQfU'
		});

	}
]);
