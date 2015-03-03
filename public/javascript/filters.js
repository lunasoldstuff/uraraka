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
    	if(data.media) {
    		return 'http://i.imgur.com/xsND2e2.jpg';
	    } else {
			if (url.substr(url.length-4) != '.jpg') return url + '.jpg';
			return url;
	    }	
    } 
	return data.thumbnail;
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

.filter('imgur_embed', function() {
  return function(input) {
    return unescape(input.media.oembed.html);
  };
});

