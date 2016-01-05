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
	Mark all user messages as read.
 */
rpResourceServices.factory('rpReadAllMessagesResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/read_all_messages');
	}
]);

/*
	[auth] Get User information
 */
rpResourceServices.factory('rpIdentityResourceService',
	function($resource) {
		return $resource('/api/uauth/me');
	}
);

/*
	Get a listing by name
 */
rpResourceServices.factory('rpByIdResourceService', ['$resource',
	function($resource) {
		return $resource('/api/by_id/:name');
	}
]);

// rpResourceServices.factory('rpUserResourceService', ['$resource',
// 	function($resource) {
// 		return $resource('/api/user/:username/:where', {
// 			username: '',
// 			where: 'overview',
// 			sort: 'new',
// 			after: 'none',
// 			t: 'none'
// 		});
// 	}
// ]);

rpResourceServices.factory('rpCommentsResourceService', ['$resource',
	function($resource) {
		return $resource('/api/comments/:subreddit/:article', {
			sort: 'confidence'
		});
	}
]);

rpResourceServices.factory('rpMoreChildrenResourceService', ['$resource',
	function($resource) {
		return $resource('/api/morechildren', {
			sort: 'confidence'
		});
	}
]);

rpResourceServices.factory('rpMessageResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/message/:where', {
			after: 'none'
		});
	}
]);

rpResourceServices.factory('rpGildResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/gild');
	}
]);

rpResourceServices.factory('rpVoteResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/vote/');
	}
]);

rpResourceServices.factory('rpDeleteResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/del/');
	}
]);

rpResourceServices.factory('rpEditResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/editusertext');
	}
]);

rpResourceServices.factory('rpSaveResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/save/');
	}
]);

rpResourceServices.factory('rpUnsaveResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/unsave/');
	}
]);

rpResourceServices.factory('rpCommentResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/comment');
	}
]);

rpResourceServices.factory('rpMessageComposeResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/compose');
	}
]);

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