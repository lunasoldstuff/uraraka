var rpDirectives = angular.module('rpDirectives', []);

rpDirectives.directive('rpPost', function() {
  return {
	restrict: 'E',
	templateUrl: 'partials/rpPost'
  };
});

rpDirectives.directive('rpUserPost', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpUserPost'
	};
});

rpDirectives.directive('rpUserLink', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpUserLink'
	};
});

rpDirectives.directive('rpUserComment', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpUserComment'
	};
});

rpDirectives.directive('rpComments', function() {
	return {
		restrict: 'C',
		templateUrl: 'partials/rpComments',
		controller: 'rpCommentsCtrl',
		// replace: true,
		scope: {
			post: "="
		}
	};
});

/*
	rpComment directive with recursion helper so it can include itself.
 */
rpDirectives.directive('rpComment', function($compile, $rootScope, RecursionHelper) {
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
		controller: 'rpCommentCtrl'
	};
});

rpDirectives.directive('rpMessageComment', function($compile, $rootScope, RecursionHelper) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			message: "=",
			depth: "="
		},
		templateUrl: 'partials/rpMessageComment',
		compile: function(element){
			return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
			
			});
		},
		controller: 'rpMessageCommentCtrl'
	};
});

/*
	Display links and media in comments.
 */
rpDirectives.directive('rpCommentMedia', function() {
	return {
		restrict: 'C',
		scope: {
			href: "@"
		},
		transclude: true,
		replace: true,
		templateUrl: 'partials/rpCommentMedia',
		controller: 'rpCommentMediaCtrl'
	};
});

/*
	use this comile directive instead of ng-bind-html in comment template becase we add our rpCommentMedia
	directive and unless the html is compiled again angular won't pick up on it.
	SO Question: 
	http://stackoverflow.com/questions/17417607/angular-ng-bind-html-unsafe-and-directive-within-it
 */

rpDirectives.directive('compile', ['$compile', '$sce',
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
rpDirectives.directive('rpMediaImgurAlbumWrapper', function() {
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