'use strict';

var redditPlusFilters = angular.module('redditPlusFilters', []);

redditPlusFilters.filter('subreddit_url', function() {
  return function(input) {
	return input.substring(input.search('/r/'));
  };
});

/*
	Media and URL related filters.
 */

redditPlusFilters.filter('image_url_comment_media', function() {
	return function(url) {
		if (url.substr(url.length-4) == '.jpg' ||
		  url.substr(url.length-4) == '.png' ||
		  url.substr(url.length-4) == '.bmp' ) {
		  return url;
		}
		else
			return url + ".jpg";
	};
});


/*
	Replaces <a> tags in the comment body with <rp-comment-media> directives.
 */
redditPlusFilters.filter('load_rp_comment_media', function(){
	return function(commentBody) {
		return commentBody.replace("<a", "<a class=\"rp-comment-media\"");
			// .replace('href=', 'url=');

	};
});


/*
	HTML Content Related Filters
 */
redditPlusFilters.filter('clean', ['$log', 
	function($log){
	  return function(text){
		var cleanText = text
		  .replace(/&amp;/g, '&')
		  .replace(/&lt;/g,"<")
		  .replace(/&gt;/g,">")
		  .replace(/&nbsp;/gi,' ');
		return cleanText;
	  };
	}
]);

redditPlusFilters.filter('unescape_embed', ['$sce', function($sce){
  return function(val) {
	var return_val = (angular.element('<div>' + decodeURIComponent(val) + '</div>').text());
	return $sce.trustAsHtml(decodeURIComponent(return_val));
  };
}]);

redditPlusFilters.filter('unescape_html', ['$sce', function($sce){
  return function(val) {
	return angular.element('<div>' + $sce.trustAsHtml(val) + '</div>').text();
  };
}]);

redditPlusFilters.filter('trusted', ['$sce', function ($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}]);

redditPlusFilters.filter('unsafe', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsHtml(decodeURIComponent(val));
	};
}]);

redditPlusFilters.filter('rp_media_type', function() {
	return function(url) {
		/*
			Determine the media type.
		 */
		
		// console.log('[rp_media_type filter] url: ' + url);

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv|webm))?(\?.*)?$/i;
		var imgurAlbumRe = /^https?:\/\/(?:www\.)?(?:i\.|m\.)?imgur\.com\/(?:a|gallery)\/([\w]+)(\..+)?(?:\/)?(?:#?\w*)?(?:\?\_[\w]+\=[\w]+)?$/i;
		var youtubeRe = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i;
		var youtubeAltRe = /^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)/i;
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
		var gfycatRe = /^https?:\/\/(?:[\w]+.)?gfycat\.com\/(\w+)(?:\.gif)?/i;
		var giphyRe = /^http:\/\/(?:www\.)?giphy\.com\/gifs\/(.*?)(\/html5)?$/i;
		var giphyAltRe = /^http:\/\/(?:www\.)?(?:i\.)?giphy\.com\/([\w]+)(?:.gif)?/i;
		var giphyAlt2Re = /^https?:\/\/(?:www\.)?(?:media[0-9]?\.)?(?:i\.)?giphy\.com\/(?:media\/)?([\w]+)(?:.gif)?/i;


		if (imgurRe.test(url))
			return 'imgur';
		else if (imgurAlbumRe.test(url))
			return 'imgurAlbum';
		else if (youtubeRe.test(url) || youtubeAltRe.test(url))
			return 'youtube';
		else if (twitterRe.test(url))
			return 'twitter';
		else if (gfycatRe.test(url))
			return 'gfycat';
		else if (giphyRe.test(url) || giphyAltRe.test(url) || giphyAlt2Re.test(url))
			return 'giphy';

	};
});