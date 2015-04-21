var redditPlusDirectives = angular.module('redditPlusDirectives', []);

redditPlusDirectives.directive('rpPost', function() {
  return {
	restrict: 'E',
	templateUrl: 'partials/rpPost'
  };
});

redditPlusDirectives.directive('rpImgurAlbum', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpImgurAlbum',
		controller: 'imgurAlbumCtrl'
	};
});

redditPlusDirectives.directive('rpMedia', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMedia'
	};
});

redditPlusDirectives.directive('rpTweet', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpTweet',
		controller: 'tweetCtrl'
	};
});

redditPlusDirectives.directive('rpComment', function($compile, $rootScope, RecursionHelper) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			comment: "=",
			depth: "=",
			post: "=",
			sort: "="
		},
		templateUrl: 'partials/rpComment',
		compile: function(element){
			return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
			
			});
		},
		controller: 'commentCtrl'
	};
});


/*
	Determine how to display links and media in comments
 */
redditPlusDirectives.directive('rpCommentMedia', function() {
	return {
		restrict: 'C',
		scope: {
			url: ""
		},
		templateUrl: 'partials/rpCommentMedia',
		controller: 'commentMediaCtrl'
	};
});

/*
	Shows and Hides the circular progress indicator on album images.
 */

redditPlusDirectives.directive('rpImgurAlbumImageWrapper', function() {
	return {

		restrict: 'C',

		link: function(scope, element, attrs) {

			element.children('img').load(function() { 
				element.children('.rp-imgur-album-progress').hide();
			});
			
			scope.$on('album_image_change', function(){
				element.children('.rp-imgur-album-progress').show();
			});

		}
	};
});