'use strict';

(function () {
	'use strict';

	angular.module('rpMedia').filter('rpMediaTypeFilter', [rpMediaTypeFilter]);

	function rpMediaTypeFilter() {
		return function (url) {
			/*
   	Determine the media type.
    */

			console.log('[rpMediaTypeFilter filter] url: ' + url);

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
			} else mediaType = null;

			console.log('[rpMediaTypeFilter filter] mediaType: ' + mediaType);

			return mediaType;
		};
	}
})();