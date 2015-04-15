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

redditPlusDirectives.directive('rpThread', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'partials/rpThread',
		scope: {
			comments: "="
		},
		// controller: 'threadCtrl'
	};
});

redditPlusDirectives.directive('rpComment', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			comment: "="
		},
		templateUrl: 'partials/rpComment',
		link: function (scope, element, attrs) {
			if (scope.comment.data.replies) {
				$compile("<rp-thread comments='comment.data.replies.data.children'></rp-thread>")(scope, function(cloned, scope) {
					element.append(cloned);
				});
			}
		}
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
				console.log('album_image_change');
				element.children('.rp-imgur-album-progress').show();
			});

		}
	};
});