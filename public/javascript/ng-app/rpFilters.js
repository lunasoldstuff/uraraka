'use strict';

var rpFilters = angular.module('rpFilters', []);

rpFilters.filter('rp_gilded_alt', function() {
	return function(data) {
		var alt;
		// if (data.gilded === 1)
		// 	alt = "a redditor has gifted reddit gold to ";
		// else
		// 	alt = "redditors have gifted " + data.gilded + " months of reddit gold to ";
		
		// 	return alt + data.author + " for this submission";
		// 	
		
		return "yeah, "+ data.author + " got gold for this";
		
		

	};
});

rpFilters.filter('rp_link_id', function() {
	return function(link) {

		if (link) {
			
			var linkIdRe = /^\/r\/(?:[\w]+)\/comments\/([\w]+)/i;
			var groups = linkIdRe.exec(link);

			return groups[1];

		} return 0;

	};
});

rpFilters.filter('rp_is_comment', function() {
	return function(name) {
		return (name.substr(0, 3) === 't1_');
	};
});

rpFilters.filter('rp_name_to_id36', function() {
	return function(name) {
		return name.substr(3);
	};
});

/*
	Replaces <a> tags in the comment body with <rp-comment-media> directives.
 */
rpFilters.filter('rp_load_comment_media', function(){
	return function(commentBody) {

		return commentBody.replace(/<a/g, "<a class=\"rp-comment-media\"");

	};
});


/*
	HTML Content Related Filters
 */
rpFilters.filter('rp_clean_title', ['$log', 
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

rpFilters.filter('rp_unescape_embed', ['$sce', function($sce){
  return function(val) {
  	if (typeof val !== 'undefined') {
		var return_val = (angular.element('<div>' + val + '</div>').text());
		return $sce.trustAsHtml(decodeURIComponent(return_val));
  	}
  };
}]);

rpFilters.filter('rp_unescape_html', ['$sce', function($sce){
  return function(val) {
	return angular.element('<div>' + $sce.trustAsHtml(val) + '</div>').text();
  };
}]);

rpFilters.filter('rp_trusted', ['$sce', function ($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}]);

// rpFilters.filter('rp_unsafe', ['$sce', function ($sce) {
// 	return function (val) {
// 		return $sce.trustAsHtml(decodeURIComponent(val));
// 	};
// }]);

rpFilters.filter('rp_media_type', function() {
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