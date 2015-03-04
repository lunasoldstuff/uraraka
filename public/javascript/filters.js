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

/*
  returns true if the url is an imgur gallery
 */
.filter('is_gallery', function(){
  return function(url) {
    return url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0 || url.substring(url.lastIndexOf('/')+1).indexOf(',') > 0;
  };
});
