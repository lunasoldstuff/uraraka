'use strict';

var rpFilters = angular.module('rpFilters', []);



rpFilters.filter('rp_get_image_url', ['$filter', function($filter) {
	return function(post) {

		var imageUrl;
		var url = post.data.url;

		if (
			angular.isDefined(post) &&
			angular.isDefined(post.data) &&
			angular.isDefined(post.data.preview) &&
			angular.isDefined(post.data.preview.images) &&
			angular.isDefined(post.data.preview.images[0]) &&
			angular.isDefined(post.data.preview.images[0].source) &&
			angular.isDefined(post.data.preview.images[0].source.url)

		) {
			imageUrl = post.data.preview.images[0].source.url;

		}

		//Check url next
		if (angular.isUndefined(imageUrl)) {
			if (
				url.substr(url.length - 4) === '.jpg' || url.substr(url.length - 5) === '.jpeg' ||
				url.substr(url.length - 4) === '.png' || url.substr(url.length - 4) === '.bmp'
			) {
				imageUrl = url;
			}
		}

		//Finally check the thumbnail
		if (angular.isDefined(post) && angular.isUndefined(imageUrl)) {
			//http://blog.osteele.com/posts/2007/12/cheap-monads/
			imageUrl = ((post || {}).data || {}).thumbnail;
		}

		//remove amp; from url
		if (angular.isDefined(imageUrl)) {
			imageUrl = $filter('rp_remove_amp')(imageUrl);
		}

		if (angular.isDefined(post)) {
			console.log('[rp_get_image_url] getImageUrl(), title: ' + post.data.title + ' imageUrl: ' + imageUrl);

		} else {
			console.log('[rp_get_image_url] getIamgeUrl(), post undefined, url: ' + url + ' imageUrl: ' + imageUrl);

		}


		return imageUrl;

	};
}]);

rpFilters.filter('rp_remove_amp', function() {
	return function removeAmp(url) {
		var ampRe = /amp;/g;
		return url.replace(ampRe, '');
	};
});

rpFilters.filter('rp_reddit_score', [function() {
	return function(s) {
		if (s > 10000) {
			s = s / 1000;
			s = s.toPrecision(3);
			s = s + 'k';
		}
		return s;
	};
}]);

rpFilters.filter('rp_upper_case', [function() {
	return function(s) {
		console.log('[rp_upper_case] s: ' + s);
		return angular.isDefined(s) ? s.toUpperCase() : null;
	};
}]);

rpFilters.filter('rp_https', [function() {
	return function(url) {
		var httpRe = /^http:/;

		if (httpRe.test(url)) {
			url = url.replace(/^http:/, 'https:');
		}

		return url;
	};
}]);

//used by search form to show error message if subreddit contains spaces.
rpFilters.filter('rp_contains_spaces', [function() {
	return function(s) {
		var spacesRe = /\s/;
		console.log('[rp_contains_spaces] s: ' + s + ', spacesRe.test(s): ' + spacesRe.test(s));
		return spacesRe.test(s);
		//alternative
		// return s.indexOf(' ') !== -1;

	};
}]);

rpFilters.filter('rp_open_link_new_window', [function() {
	return function(html) {
		if (html) {
			return html.replace(/&lt;a/g, '&lt;a target="_blank"');
		}
	};
}]);

rpFilters.filter('rp_youtube_time_to_seconds', [function() {
	return function(time) {

		var clockTimeRe = /^(?:([\d]+)h)?(?:([\d]+)m)?(?:([\d]+)s)?$/i;

		var groups = clockTimeRe.exec(time);

		if (groups) {

			var hours = parseInt(groups[1]) || 0;
			var minutes = parseInt(groups[2]) || 0;
			var seconds = parseInt(groups[3]) || 0;

			return hours * 60 * 60 + minutes * 60 + seconds;
		}

		return 0;

	};
}]);

rpFilters.filter('rp_hijack_reddit_link', [function() {
	return function(url) {
		//Fix links for reddituploads

		var redditUploadRe = /^https?:\/\/(?:i\.){1}(?:redditmedia|reddituploads){1}(?:.com){1}/i;
		var ampRe = /amp;/g;

		if (redditUploadRe.test(url)) {
			url = url.replace(ampRe, '');
		}

		var redditRe = /^(?:https?:\/\/)?(?:www\.)?(?:np\.)?(?:(?:reddit\.com)|(\/?r\/)|(\/?u\/)){1,2}([\S]+)?$/i;

		var isRedditLink = redditRe.test(url);

		if (isRedditLink) {

			// console.log('[rpFilters rp_hijack_reddit_link] url: ' + url);

			var groups = redditRe.exec(url);

			// console.log('[rpFilters rp_hijack_reddit_link] groups: ' + groups.length + ' [' + groups.toString() + ']');

			var newUrl = "";

			for (var i = 1; i < groups.length; i++) {
				if (groups[i] !== undefined)
					newUrl += groups[i];
			}

			// console.log('[rpFilters rp_hijack_reddit_link] newUrl: ' + newUrl);

			return newUrl;

		} else {
			return url;
		}

	};
}]);

rpFilters.filter('rp_link_id', [function() {
	return function(link) {

		if (link) {

			var linkIdRe = /^\/r\/(?:[\w]+)\/comments\/([\w]+)/i;
			var groups = linkIdRe.exec(link);

			return groups[1];

		}
		return 0;

	};
}]);

rpFilters.filter('rp_is_comment', [function() {
	return function(name) {
		return (name.substr(0, 3) === 't1_');
	};
}]);

rpFilters.filter('rp_name_to_id36', [function() {
	return function(name) {
		return name.substr(3);
	};
}]);

/*
	Replaces <a> tags in the comment body with <rp-comment-media> directives.
 */
rpFilters.filter('rp_load_comment_media', [function() {
	return function(commentBody) {
		// console.log('[rpFilters rp_load_comment_media] typeof commentBody: ' + typeof commentBody);
		// console.log('[rpFilters rp_load_comment_media] commentBody: ' + JSON.stringify(commentBody));
		return commentBody.replace(/<a/g, "<a class=\"rp-comment-media\"");

	};
}]);

rpFilters.filter('rp_open_in_tab', [function() {
	return function(commentBody) {
		// console.log('[rpFilters rp_open_in_tab] typeof commentBody: ' + typeof commentBody);
		// console.log('[rpFilters rp_open_in_tab] commentBody: ' + JSON.stringify(commentBody));
		// return commentBody;
		return commentBody.replace(/<a/g, '<a target="_blank"');

	};
}]);

/*
	HTML Content Related Filters
 */
rpFilters.filter('rp_clean_title', ['$log',
	function($log) {
		return function(text) {
			if (text) {
				text = text
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, "<")
					.replace(/&gt;/g, ">")
					.replace(/&nbsp;/gi, ' ');
			}
			return text;
		};
	}
]);

rpFilters.filter('rp_unescape_embed', ['$sce', function($sce) {
	return function(val) {
		if (typeof val !== 'undefined' && val !== '') {
			var return_val = (angular.element('<div>' + val + '</div>').text());
			// This throws the error
			// return $sce.trustAsHtml(decodeURIComponent(return_val));
			return $sce.trustAsHtml(return_val);
		}
	};
}]);

rpFilters.filter('rp_unescape_html', ['$sce', function($sce) {
	return function(val) {
		// console.log('[rp_unescape_html]');
		return angular.element('<div>' + $sce.trustAsHtml(val) + '</div>').text();
	};
}]);

rpFilters.filter('rp_trusted', ['$sce', function($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}]);

// rpFilters.filter('rp_unsafe', ['$sce', function ($sce) {
// 	return function (val) {
// 		return $sce.trustAsHtml(decodeURIComponent(val));
// 	};
// }]);

rpFilters.filter('rp_media_type', [function() {
	return function(url) {
		/*
			Determine the media type.
		 */

		console.log('[rp_media_type filter] url: ' + url);

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv|webm))?(\?.*)?$/i;
		var imgurAlbumRe = /^https?:\/\/(?:www\.)?(?:i\.|m\.)?imgur\.com\/(?:a|gallery)\/([\w]+)(\..+)?(?:\/)?(?:#?\w*)?(?:\?\_[\w]+\=[\w]+)?$/i;
		var youtubeRe = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i;
		var youtubeAltRe = /^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)/i;
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
		var gfycatRe = /^https?:\/\/(?:[\w]+.)?gfycat\.com\/(\w+)(?:\.gif)?/i;
		var giphyRe = /^http:\/\/(?:www\.)?giphy\.com\/gifs\/(.*?)(\/html5)?$/i;
		var giphyAltRe = /^http:\/\/(?:www\.)?(?:i\.)?giphy\.com\/([\w]+)(?:.gif)?/i;
		var giphyAlt2Re = /^https?:\/\/(?:www\.)?(?:media[0-9]?\.)?(?:i\.)?giphy\.com\/(?:media\/)?([\w]+)(?:.gif)?/i;
		var redditUploadRe = /^https?:\/\/(?:i\.){1}(?:redditmedia|reddituploads){1}(?:.com){1}/i;
		var streamableRe = /^https?:\/\/(streamable){1}(?:.com){1}\/([\w\-]+){1}/i;

		var mediaType = null;

		if (imgurRe.test(url)) {
			mediaType = 'imgur';
		} else if (imgurAlbumRe.test(url)) {
			mediaType = 'imgurAlbum';
		} else if (youtubeRe.test(url) || youtubeAltRe.test(url)) {
			mediaType = 'youtube';
		} else if (twitterRe.test(url)) {
			mediaType = 'twitter';
		} else if (gfycatRe.test(url)) {
			mediaType = 'gfycat';
		} else if (giphyRe.test(url) || giphyAltRe.test(url) || giphyAlt2Re.test(url)) {
			mediaType = 'giphy';
		} else if (redditUploadRe.test(url)) {
			mediaType = 'redditUpload';
		} else if (streamableRe.test(url)) {
			mediaType = 'streamable';
		} else
			mediaType = null;

		console.log('[rp_media_type filter] mediaType: ' + mediaType);

		return mediaType;

	};
}]);