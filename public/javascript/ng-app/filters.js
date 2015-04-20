'use strict';

angular.module('redditPlusFilters', []).filter('subreddit_url', function() {
  return function(input) {
	return input.substring(input.search('/r/'));
  };
})

.filter('media_type', function($log) {
  return function(data) {

	var url = data.url;
	var domain = data.domain;

	if (data.is_self)
	  return 'self';

	if (data.domain == "twitter.com" && url.indexOf('/status/') > 0)
	  return 'tweet';

	if (data.domain.indexOf('imgur.com') >= 0)
	  if (url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0 ||
		url.substring(url.lastIndexOf('/')+1).indexOf(',') > 0) {
		return 'album';
	  }

	if (url.substr(url.length-4) == '.jpg' || url.substr(url.length-4) == '.png')
	  return 'image';

	if (
			data.domain == "gfycat.com" ||
			url.substr(url.length-5) == '.gifv' ||
			url.substr(url.length-5) == '.webm' ||
			url.substr(url.length-4) == '.mp4' ||
			url.indexOf('.gif') > 0
		)
	  return 'video';

	if (data.media) {
	  if (data.media.oembed.type == 'video') {
		if (data.media_embed)
		  return 'embed';
		else
		  return 'video';
	  }
	}

	if(domain.substr(domain.length-9) == 'imgur.com')
	  return 'image';

	return 'default';
  };
})

// .filter('snudown', function(){
//     return function(data) {
//
//     }
// })

.filter('image_url', function() {
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
})

.filter('video_url', function(){
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
})

.filter('is_video', function() {
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
})

.filter('is_gif', function() {
  return function(data) {
	var url = data.url;
	if (url.indexOf('.gif') > 0 && url.indexOf('.gifv') == -1)
	  return true;
	return false;
  };
})

.filter('thumbnail', function(){
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
})

/*
  returns true if the url is an imgur gallery
 */
.filter('is_gallery', function(){
  return function(url) {
	return url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0 || url.substring(url.lastIndexOf('/')+1).indexOf(',') > 0;
  };
})

.filter('clean', ['$log', function($log){
  return function(text){
	var cleanText = text
	  .replace(/&amp;/g, '&')
	  .replace(/&lt;/g,"<")
	  .replace(/&gt;/g,">")
	  .replace(/&nbsp;/gi,' ');
	return cleanText;
  };
}])

.filter('unescape_embed', ['$sce', function($sce){
  return function(val) {
	var return_val = (angular.element('<div>' + decodeURIComponent(val) + '</div>').text());
	return $sce.trustAsHtml(decodeURIComponent(return_val));
  };
}])

.filter('unescape_html', ['$sce', function($sce){
  return function(val) {
	return angular.element('<div>' + $sce.trustAsHtml(val) + '</div>').text();
  };
}])

.filter('trusted', ['$sce', function ($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}])

.filter('unsafe', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsHtml(decodeURIComponent(val));
	};
}]);