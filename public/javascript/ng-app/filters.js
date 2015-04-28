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

redditPlusFilters.filter('image_url', function() {
  return function(data) {
	var url;

	if (data.url)
		url = data.url;
	else
		url = data;

	if (url.substr(url.length-4) == '.jpg' ||
	  url.substr(url.length-4) == '.png' ||
	  url.substr(url.length-4) == '.bmp' ) {
	  return url;
	}

	if (data.domain) {
		if (data.domain.substr(data.domain.length-9) == 'imgur.com') {
		  url = url.replace('?', '');
		  if (url.substr(url.length-4) != '.jpg') {
			if (url.substr(url.length-1) == '/')
			  url = url.substring(0, url.length-1);
			return url + '.jpg';
		  }
				return url;
		}
	}

	if (url.indexOf('zippy.gfycat.com') > 0) {
		return url.replace('zippy.', '');
	}

	return url;
  };
});

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

redditPlusFilters.filter('video_url', function(){
  return function(data, type){
	var url = data.url;
	var domain = data.domain;
	var video_url = url;

	if (domain.substr(domain.length-9) == 'imgur.com') {
	  if(url.substr(url.length-5) == '.gifv')
		return url.substring(0, url.length-5) + type;

	} else if (domain == 'gfycat.com') {
		return url.replace('zippy.gfycat.com', 'gfycat.com') + type;
	} else
		return url;
  };
});

redditPlusFilters.filter('is_video', function() {
  return function(data) {
	var url = data.url;

	//check if there is media data and if type is video
	if (url.substr(url.length-5) == '.gifv')
	  return true;
	if (data.media) {
	  if (data.media.oembed.type == 'video')
		return true;
	}
	return false;
  };
});

redditPlusFilters.filter('is_gif', function() {
  return function(data) {
	var url = data.url;
	if (url.indexOf('.gif') > 0 && url.indexOf('.gifv') == -1)
	  return true;
	return false;
  };
});

redditPlusFilters.filter('thumbnail', function(){
  return function(data) {
	if (data.thumbnail)
	  return data.thumbnail;
	if (data.media && data.media.oembed.thumbnail_url)
		return data.media.oembed.thumbnail_url;
	//if a gfycat thumb still hasn't got a thumbnail_url
	if (data.domain == "gfycat.com") {
		var id = data.url.substr(data.url.lastIndexOf('/')+1);
		if (id.indexOf('.') > 0) {
			id = id.substring(0, id.indexOf('.'));
		}
		return "https://thumbs.gfycat.com/" + id + "-thumb100.jpg";
	}
	return '/self';
  };
});

/*
  returns true if the url is an imgur gallery
 */
redditPlusFilters.filter('is_gallery', function(){
  return function(url) {
	return url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0 || url.substring(url.lastIndexOf('/')+1).indexOf(',') > 0;
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

redditPlusFilters.filter('test_media_regex', function(){
	return function(url) {
		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv))?(\?.*)?$/i;
		var imgurAlbumRe = /^https?:\/\/(?:i\.|m\.)?imgur\.com\/(?:a|gallery)\/([\w]+)(\..+)?(?:\/)?(?:#?\w*)?$/i;
		var youtubeRe = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i;
		var youtubeAltRe = /^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)/i;
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;

		var groups = [];

		if (imgurRe.test(url)){
			groups = imgurRe.exec(url);
			// console.log("imgur url: " + url);
			// console.log("imgur groups: " + groups);
			return 'imgur';
		}
		if (imgurAlbumRe.test(url)){
			groups = imgurAlbumRe.exec(url);
			// console.log("imgur album groups: " + groups);
			return 'imgur album';
		}
		if (youtubeRe.test(url)){
			groups = youtubeRe.exec(url);
			console.log("youtube groups: " + groups);
			return 'youtube';
		}
		if (youtubeAltRe.test(url))
			return 'youtube alt';
		if (twitterRe.test(url)) {
			groups = twitterRe.exec(url);
			console.log('twitter groups: ' + groups);
			return 'twitter';
		}
		
		return 'n.o.t.a.';
	};
});

redditPlusFilters.filter('rp_media_type', function() {
	return function(url) {
		/*
			Determine the media type.
		 */
		
		// console.log('[rp_media_type filter] url: ' + url);

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv))?(\?.*)?$/i;
		var imgurAlbumRe = /^https?:\/\/(?:i\.|m\.)?imgur\.com\/(?:a|gallery)\/([\w]+)(\..+)?(?:\/)?(?:#?\w*)?(?:\?\_[\w]+\=[\w]+)?$/i;
		var youtubeRe = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i;
		var youtubeAltRe = /^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)/i;
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
		var gfycatRe = /^https?:\/\/(?:[\w]+.)?gfycat\.com\/(\w+)(?:\.gif)?/i;

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

	};
});

redditPlusFilters.filter('rp_media_imgur_url', function() {
	return function(url) {

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv))?(\?.*)?$/i;
		var groups = imgurRe.exec(url);
		var extension = groups[2] || '.jpg';

		return groups[1] ? 'http://i.imgur.com/' + groups[1] + extension : url; 

	};
});

redditPlusFilters.filter('rp_media_imgur_thumbnail_url', function() {
	return function(url) {

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv))?(\?.*)?$/i;
		var groups = imgurRe.exec(url);

		var extension = groups[2] || '.jpg';		

		if (groups[1] && groups[2]) {
			return "http://i.imgur.com/" + groups[1] + 'l' + extension;
		} else {
			return url;
		}
		
	};
});

redditPlusFilters.filter('rp_media_imgur_webm_url', function() {
	return function(url) {

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv))?(\?.*)?$/i;
		var groups = imgurRe.exec(url);

		if (groups[1]) {
			return "http://i.imgur.com/" + groups[1] + '.webm';
		} else {
			return url;
		}
	};
});

redditPlusFilters.filter('rp_media_imgur_mp4_url', function() {
	return function(url) {

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv))?(\?.*)?$/i;
		var groups = imgurRe.exec(url);

		if (groups[1]) {
			return "http://i.imgur.com/" + groups[1] + '.mp4';
		} else {
			return url;
		}
	};
});

redditPlusFilters.filter('rp_media_gfycat_thumbnail_url', function() {
	return function(url) {

		var gfycatRe = /^https?:\/\/(?:[\w]+.)?gfycat\.com\/(\w+)(?:\.gif)?/i;
		var groups = gfycatRe.exec(url);

		return 'http://thumbs.gfycat.com/' + groups[1] + '-poster.jpg';

	};
});

redditPlusFilters.filter('rp_media_gfycat_image_url', function() {
	return function(url) {

		var gfycatRe = /^https?:\/\/(?:[\w]+.)?gfycat\.com\/(\w+)(?:\.gif)?/i;
		var groups = gfycatRe.exec(url);

		return 'http://gfycat.com/' + groups[1] + '.gif';

	};
});

redditPlusFilters.filter('rp_media_gfycat_webm_url', function() {
	return function(url) {

		var gfycatRe = /^https?:\/\/(?:[\w]+.)?gfycat\.com\/(\w+)(?:\.gif)?/i;
		var groups = gfycatRe.exec(url);

		return 'http://zippy.gfycat.com/' + groups[1] + '.webm';

	};
});