'use strict';

var rpResourceServices = angular.module('rpResourceServices', ['ngResource']);

/*
	Snoocore Refresh Token Api Endpoints
 */





/*
	Subreddit information, About Subreddit.
 */


/*
	Mark all user messages as read.
 */




/*
	Subscribe to subreddit.
 */


/*
	[auth] Get User information
 */


/*
	Get a listing by name
 */


/*
	Get subreddits
 */





/*
	Gets posts for a given subreddit.
 */









/*
	rp api.
 */






/*
	Gets an imgur albums information.
 */



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

rpResourceServices.factory('rpPaypalCreateBillingAgreeement', ['$resource',
	function($resource) {
		return $resource('/paypal/createBillingAgreement');
	}
]);

rpResourceServices.factory('rpPaypalBillingAgreeement', ['$resource',
	function($resource) {
		return $resource('/paypal/billingAgreement');
	}
]);

rpResourceServices.factory('rpPaypalUpdateBillingAgreeement', ['$resource',
	function($resource) {
		return $resource('/paypal/updateBillingAgreement');
	}
]);

rpResourceServices.factory('rpPaypalCancelBillingAgreeement', ['$resource',
	function($resource) {
		return $resource('/paypal/cancelBillingAgreement');
	}
]);