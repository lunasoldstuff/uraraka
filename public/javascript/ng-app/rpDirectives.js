var rpDirectives = angular.module('rpDirectives', []);

rpDirectives.directive('rpGildButton', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpGildButton',
		controller: 'rpGildButtonCtrl',
		scope: {
			id: '=',
			gilded: '='
		}
	};
});

rpDirectives.directive('rpSaveButton', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpSaveButton',
		controller: 'rpSaveButtonCtrl',
		scope: {
			id: "=",
			saved: "="
		}
	};
});

rpDirectives.directive('rpDelete', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpDelete',
		controller: 'rpDeleteCtrl',
		scope: {
			id: '=',
			parentCtrl: '=',
			type: '='
		}
	};
});

rpDirectives.directive('rpReplyForm', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpReplyForm',
		controller: 'rpReplyFormCtrl',
		scope: {
			id: "=",
			parentCtrl: "=",
			post: "="
			
		}
	};
});

rpDirectives.directive('rpScore', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpScore',
		controller: 'rpScoreCtrl',
		scope: {
			score: "=",
			id: "=",
			likes: "="
		}
		
	};
});

rpDirectives.directive('rpPost', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpPost',
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

rpDirectives.directive('rpSearchPost', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpSearchPost'
	};
});

rpDirectives.directive('rpSearchLink', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpSearchLink'
	};
});

rpDirectives.directive('rpSearchSub', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpSearchSub'
	};
});

rpDirectives.directive('rpArticle', function() {
	return {
		restrict: 'C',
		templateUrl: 'partials/rpArticle',
		controller: 'rpArticleCtrl',
		// replace: true,
		scope: {
			post: "=",
			dialog: "="
		}
	};
});

rpDirectives.directive('rpSettings', function() {
	return {
		restrict: 'C',
		templateUrl: 'partials/rpSettings',
		controller: 'rpSettingsCtrl'
	};
});

rpDirectives.directive('rpSubmitText', function() {
	return {
		restrict: 'C',
		templateUrl: 'partials/rpSubmitText'
	};
});

rpDirectives.directive('rpSubmitLink', function() {
	return {
		restrict: 'C',
		templateUrl: 'partials/rpSubmitLink'
	};
});

rpDirectives.directive('rpMessageCompose', function() {

	return {
		restrict: 'C',
		templateUrl: 'partials/rpMessageCompose',
		controller: 'rpMessageComposeCtrl'
	};

});

rpDirectives.directive('rpCaptcha', function() {

	return {
		restrict: 'E',
		templateUrl: 'partials/rpCaptcha',
		controller: 'rpCaptchaCtrl'
	};

});

rpDirectives.directive('rpFormatting', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpFormatting',
		controller: 'rpFormattingCtrl'
	};
	
});

// rpComment Directive for use with rpCommentCtrl
rpDirectives.directive('rpComment', function($compile, $rootScope, RecursionHelper) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			comment: "=",
			cid: "=",
			depth: "=",
			post: "=",
			sort: "=",
			parent: "=",
			identity: "="
		},
		templateUrl: 'partials/rpComment',
		controller: 'rpCommentCtrl',
		compile: function(element) {
			return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {

			});
		}
	};
});

rpDirectives.directive('rpMessageComment', function($compile, $rootScope, RecursionHelper) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			message: "=",
			depth: "=",
			identity: "="
		},
		templateUrl: 'partials/rpMessageComment',
		compile: function(element) {
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
		templateUrl: 'partials/rpCommentMedia'
		// controller: 'rpCommentMediaCtrl'
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

			scope.$on('album_image_change', function() {
				element.children('.rp-media-imgur-album-progress').show();
			});

		}
	};
});

rpDirectives.directive('rpContent', ['$rootScope', function($rootScope) {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {

			var lastScrollTop = 0;

			element.on('scroll', function() {

				var st = element.scrollTop();

				if (st > lastScrollTop)
					$rootScope.$emit('scroll_up');
				else
					$rootScope.$emit('scroll_down');

				lastScrollTop = st;

			});
		}
	};
}]);

rpDirectives.directive('rpFab', ['$rootScope', function($rootScope) {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {

			var speed = 1;

			var deregisterScrollUp = $rootScope.$on('scroll_up', function() {
				if (parseInt(element.children('ul').css('bottom')) > -100)
					element.children('ul').css('bottom', '-=25');
				else
					element.children('ul').css('bottom', '-100px');

			});

			var deregisterScrollDown = $rootScope.$on('scroll_down', function() {
				if (parseInt(element.children('ul').css('bottom')) < 0)
					element.children('ul').css('bottom', '+=25');
				else
					element.children('ul').css('bottom', '0px');

			});

			scope.$on('$destroy', function() {
				deregisterScrollUp();
				deregisterScrollDown();
			});

		}
	};
}]);

rpDirectives.directive('rpFocusMe', ['$timeout', '$parse', function($timeout, $parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.rpFocusMe);
			console.log('[rpFocusMe] link function load, model: ' + model);

			scope.$watch(model, function(value) {
				console.log('[rpFocusMe] $watch, value: ' + value);

				if (value === true) {
					$timeout(function() {
						element[0].focus();
					});
				}

			});

			element.bind('blur', function() {
				console.log('[rpFocusMe] blur');
				scope.$apply(model.assign(scope, false));

			});

		}
	};
}]);

rpDirectives.directive('rpToolbarSelectButton', [function() {
	return {
		restrict: 'A',

		link: function(scope, element, attrs) {
			var select = attrs.rpToolbarSelectButton;
			console.log('[rpToolbarSelectButton] select: ' + select);

			element.click(function() {
				console.log('[rpToolbarSelectButton] click()');
				console.log('[rpToolbarSelectButton] click(), select: ' + select);
				angular.element(select).trigger('click');

			});

		}
	};
}]);

rpDirectives.directive('rpInfiniteScroll', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',

		link: function(scope, element, attrs) {

			var scrollDiv = attrs.rpInfiniteScrollDiv;
			var scrollDistance = attrs.rpInfiniteScrollDistance;

			console.log('[rpInfiniteScroll] loaded, element.height(): ' + element.height() + ' scrollDiv: ' + scrollDiv + ', scrollDistance: ' + scrollDistance);

			element.on('scroll', function() {
				// console.log('[rpInfiniteScroll] onScroll(), element.scrollTop(): ' + element.scrollTop());
				// console.log('[rpInfiniteScroll] loaded, scrollDiv Height:' + angular.element(scrollDiv).height());

				if (!scope.noMorePosts) {

					if (angular.element(scrollDiv).outerHeight() - element.scrollTop() <= element.outerHeight() * scrollDistance) {
						console.log('[rpInfiniteScroll] call loadMorePosts');
						scope.morePosts();

					}

				}

			});
		}
	};
}]);
