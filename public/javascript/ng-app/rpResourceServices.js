'use strict';

var rpResourceServices = angular.module('rpResourceServices', ['ngResource']);

/*
	Snoocore Refresh Token Api Endpoints
 */

rpResourceServices.factory('rpUserRefreshTokenResourceService', ['$resource',
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
	Subreddit information, About Subreddit.
 */

rpResourceServices.factory('rpSubredditAboutResourceService', ['$resource',
	function($resource) {
		return $resource('/api/about/:sub');
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

rpResourceServices.factory('rpReadMessageResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/read_message');
	}
]);

/*
	Subscribe to subreddit.
 */
rpResourceServices.factory('rpSubbscribeResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/subscribe');
	}
]);

/*
	[auth] Get User information
 */
rpResourceServices.factory('rpIdentityResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/me');
	}
]);

/*
	Get a listing by name
 */
rpResourceServices.factory('rpByIdResourceService', ['$resource',
	function($resource) {
		return $resource('/api/by_id/:name');
	}
]);

/*
	Get subreddits
 */
rpResourceServices.factory('rpSubredditsResourceService', ['$resource',
	function($resource) {
		return $resource('/api/subreddits/:where', {
			where: 'default',
			limit: 50
		});
	}
]);



rpResourceServices.factory('rpSubredditsMineResourceService', ['$resource',
	function($resource) {
		return $resource('/api/uauth/subreddits/mine/:where', {
			where: 'subscriber',
			limit: 50,
			after: ""
		});
	}
]);

/*
	Gets posts for a given subreddit.
 */

rpResourceServices.factory('rpPostsResourceService', ['$resource',
	function($resource) {
		return $resource('/api/subreddit/:sub/:sort');
	}
]);

rpResourceServices.factory('rpFrontpageResourceService', ['$resource',
	function($resource) {
		return $resource('/api/:sort', {
			sort: 'hot',
			after: 'none',
			t: 'none',
			limit: 'limit'
		});
	}
]);

rpResourceServices.factory('rpUserResourceService', ['$resource',
	function($resource) {
		return $resource('/api/user/:username/:where', {
			username: '',
			where: 'overview',
			sort: 'new',
			after: 'none',
			t: 'none'
		});
	}
]);

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