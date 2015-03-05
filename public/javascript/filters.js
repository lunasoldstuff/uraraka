'use strict';

angular.module('redditPlusFilters', []).filter('subreddit_url', function() {
  return function(input) {
    return input.substring(input.search('/r/'));
  };
})

.filter('image_url', function() {
  return function(data) {
    var url = data.url;
    var domain = data.domain;

    if (url.substr(url.length-4) == '.jpg')
      return url;

    if (domain.substr(domain.length-9) == 'imgur.com') {
      if (url.substr(url.length-4) != '.jpg') 
        return url + '.jpg';
			return url;
    } 
	return data.thumbnail;
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
        return url.replace('gfycat.com', 'zippy.gfycat.com') + type;
    } else
        return url + type;
  };
})

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

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

.filter('unescape_html', ['$log', function($log){
  return function(val) {
    var return_val = (angular.element('<div>' + decodeURIComponent(val) + '</div>').text());
    return decodeURIComponent(return_val);
  };
}])

.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(decodeURIComponent(val));
    };
}])

.filter('media_type', function() {
  return function(data) {
    var url = data.url;
    
    if (url.substr(url.length-4) != '.jpg') 
      return 'image';

    if (url.substr(url.length-5) == '.gifv')
      return 'video';
    
    if (data.media) {
      if (data.media.oembed.type == 'video') {
        if (data.media_embed)
          return 'embed';
        else
          return 'video';
      }
    }
    return 'image';
  };
})

/*
  returns true if the url is an imgur gallery
 */
.filter('is_gallery', function(){
  return function(url) {
    return url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0 || url.substring(url.lastIndexOf('/')+1).indexOf(',') > 0;
  };
});