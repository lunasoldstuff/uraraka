var redditPlusDirectives = angular.module('redditPlusDirectives', []);

redditPlusDirectives.directive('rpPost', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/rpPost'
  };
});

redditPlusDirectives.directive('rpImgurAlbum', function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/rpImgurAlbum',
		controller: 'imgurAlbumCtrl'
	};
});

redditPlusDirectives.directive('rpMedia', function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMedia',
	};
});