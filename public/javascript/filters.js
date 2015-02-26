angular.module('redditPlusFilters', []).filter('subreddit_url', function() {
  return function(input) {
    return input.substring(input.search('/r/'));
  };
});

angular.module('redditPlusFilters', []).filter('imgur_url', function() {
  return function(input) {
    var url = input.url;
    var domain = input.domain;

    if (domain.substr(domain.length-9) == "imgur.com") {
    	if(input.media) {
    		return "http://i.imgur.com/xsND2e2.jpg";
	    } else {
			if (url.substr(url.length-4) != '.jpg') return url + '.jpg';
			return url;
	    }	
    } 
	return input.thumbnail;
  };
});