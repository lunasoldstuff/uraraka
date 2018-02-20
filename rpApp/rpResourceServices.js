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









rpResourceServices.factory('rpSubmitResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/submit');
	}
]);

rpResourceServices.factory('rpNeedsCaptchaResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/needs_captcha');
	}
]);

rpResourceServices.factory('rpNewCaptchaResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/new_captcha');
	}
]);

rpResourceServices.factory('rpCaptchaResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/captcha/:iden');
	}
]);

rpResourceServices.factory('rpSearchResourceService', ['$resource',
	function($resource) {
		return $resource('/api/search/:sub', {
			sub: 'all',
			sort: 'relevance',
			after: '',
			before: '',
			restrict_sr: true,
			t: 'all',
			type: 'sr',
			limit: 24
		});
	}
]);

/*
	rp api.
 */

rpResourceServices.factory('rpSettingsResourceService', ['$resource',
	function($resource) {
		return $resource('/settingsapi');
	}
]);

rpResourceServices.factory('rpShareEmailResourceService', ['$resource',
	function($resource) {
		return $resource('/mail/share');
	}
]);

rpResourceServices.factory('rpFeedbackResourceService', ['$resource',
	function($resource) {
		return $resource('/mail/feedback');
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