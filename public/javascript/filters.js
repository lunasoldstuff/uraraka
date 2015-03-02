'use strict';

angular.module('redditPlusFilters', []).filter('subreddit_url', function() {
  return function(input) {
    return input.substring(input.search('/r/'));
  };
})

.filter('imgur_url', function() {
  return function(data) {
    var url = data.url;
    var domain = data.domain;

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

.filter('imgur_embed', function() {
  return function(input) {
    return unescape(input.media.oembed.html);
  };
});