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
		templateUrl: 'partials/rpMedia',
		scope: {
			url: '='
		},
		controller: 'mediaCtrl'
	};
});

redditPlusDirectives.directive('rpMediaImgur', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaImgur'

	};
});

redditPlusDirectives.directive('rpMediaImgurAlbum', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaImgurAlbum',
		controller: 'rpMediaImgurAlbumCtrl'

	};
});

redditPlusDirectives.directive('rpMediaYoutube', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaYoutube',
		controller: 'rpMediaYoutubeCtrl'

	};
});

// redditPlusDirectives.directive('rpMediaImgurAlbum', function(){
// 	return {
// 		restrict: 'E',
// 		templateUrl: 'partials/media/rpMediaImgurAlbum'

// 	};
// });

redditPlusDirectives.directive('rpTweet', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpTweet',
		controller: 'tweetCtrl'
	};
});

/*
	rpComment directive with recursion helper so it can include itself.
 */
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
	Display links and media in comments.
 */
redditPlusDirectives.directive('rpCommentMedia', function() {
	return {
		restrict: 'C',
		scope: {
			href: "@"
		},
		transclude: true,
		replace: true,
		// link: function(scope, element, attrs) {
		// 	console.log('[rpCommentMedia] link function, href: ' + attrs.href);
		// 	// attrs.href
		// },
		templateUrl: 'partials/rpCommentMedia',
		controller: 'commentMediaCtrl'
	};
});

/*
	use this comile directive instead of ng-bind-html in comment template becase we add our rpCommentMedia
	directive and unless the html is compiled again angular won't pick up on it.
	SO Question: 
	http://stackoverflow.com/questions/17417607/angular-ng-bind-html-unsafe-and-directive-within-it
 */

redditPlusDirectives.directive('compile', ['$compile', '$sce',
	function($compile, $sce) {
		return {
			link: function(scope, element, attrs) {
				var ensureCompileRunsOnce = scope.$watch(function(scope) {
					return $sce.parseAsHtml(attrs.compile)(scope);
				},
				function(value) {
					// when the parsed expression changes assign it into the current DOM
					element.html(value);

					// compile the new DOM and link it to the current scope.
					$compile(element.contents())(scope);

					// Use un-watch feature to ensure compilation happens only once.
					ensureCompileRunsOnce();
				});
			}
		};
	}
]);

/*
	Shows and Hides the circular progress indicator on album images.
 */
redditPlusDirectives.directive('rpMediaImgurAlbumWrapper', function() {
	return {

		restrict: 'C',

		link: function(scope, element, attrs) {

			element.children('img').load(function() { 
				element.children('.rp-media-imgur-album-progress').hide();
			});
			
			scope.$on('album_image_change', function(){
				element.children('.rp-media-imgur-album-progress').show();
			});

		}
	};
});