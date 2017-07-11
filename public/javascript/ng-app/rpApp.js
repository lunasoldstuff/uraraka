'use strict';

/* App Module */

var rpApp = angular.module('rpApp', [
    'ngRoute',
    'ngMaterial',
    'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'ngCookies',
    'linkify',
    'angularMoment',
    'RecursionHelper',
    'rt.debounce',
    'mediaCheck',
    'angular-google-adsense',
    'angular-inview',
    'rpUtilServices',
    'rpImgurUtilServices',
    'rpResourceServices',
    'rpFilters',
    'rpDirectives',
    'rpMediaDirectives',
    'rpControllers',
    'rpPostControllers',
    'rpUserControllers',
    'rpMessageControllers',
    'rpArticleControllers',
    'rpCommentControllers',
    'rpMediaControllers',
    'rpProgressControllers',
    'rpCaptchaControllers',
    'rpSettingsControllers',
    'rpSearchControllers',
    'rpShareControllers',
    'rpSubmitControllers',
    'rpScoreControllers',
    'rpReplyFormControllers',
    'rpDeleteControllers',
    'rpSaveControllers',
    'rpHideControllers',
    'rpOpenNewControllers',
    'rpGildControllers',
    'rpEditFormControllers',
    'rpLinkControllers',
    'rpTabsControllers',
    'rpFeedbackControllers',
    'rpRedditApiServices',
    'rpTemplates',

]);

/*
	Uncomment to enable digest cycle timer
 */
// rpApp.config(function($rootScopeProvider) {
// 	$rootScopeProvider.digestTtl(15);
// });

rpApp.run(['$animate', function ($animate) {
    $animate.enabled(true);
}]);

rpApp.constant('angularMomentConfig', {
    preprocess: 'unix',
    timezone: 'utc'
});

// rpApp.run(['$rootScope', function ($rootScope) {
//     $rootScope.$on('$routeChangeStart', function (event, next, current) {
//         console.log('[rpApp] on $routeChangeStart, next: ' + JSON.stringify(next));
//         console.log('[rpApp] on $routeChangeStart, next.originalPath: ' + next.originalPath);
//         console.log('[rpApp] on $routeChangeStart, current: ' + current);




//     });
// }]);

rpApp.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
        return {
            'responseError': function (response) {
                console.log('[http error interceptor]');
                if (response.status === 401 || response.status === 403 || response.status === 500) {
                    console.log('[http error interceptor] redirect to error page');
                    $location.path('/error');
                }
                return $q.reject(response);
            }
        };
    }]);
}]);

rpApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        $routeProvider.

            when('/feedback', {
                templateUrl: 'rpFeedbackCard.html',
                controller: 'rpFeedbackCtrl'
            })

            .when('/share/email', {
                templateUrl: 'rpShareEmailCard.html',
                controller: 'rpShareEmailCtrl'
            })

            .when('/submitLink', {
                templateUrl: 'rpSubmitLinkCard.html',
                controller: 'rpSubmitCtrl'
            })

            .when('/submitText', {
                templateUrl: 'rpSubmitTextCard.html',
                controller: 'rpSubmitCtrl'
            })

            .when('/:sub/search', {
                templateUrl: 'rpSearch.html',
                controller: 'rpSearchCtrl'
            })

            .when('/search', {
                templateUrl: 'rpSearch.html',
                controller: 'rpSearchCtrl'
            })

            .when('/settings', {
                templateUrl: 'rpSettings.html',
                controller: 'rpSettingsCtrl'
            })

            .when('/message', {
                templateUrl: 'rpMessage.html',
                controller: 'rpMessageCtrl'
            })

            .when('/message/compose', {
                templateUrl: 'rpMessageComposeCard.html',
                controller: 'rpMessageComposeCtrl'
            })

            .when('/message/:where', {
                templateUrl: 'rpMessage.html',
                controller: 'rpMessageCtrl'
            })

            .when('/u/:username', {
                templateUrl: 'rpUser.html',
                controller: 'rpUserCtrl'
            })

            .when('/u/:username/:where', {
                templateUrl: 'rpUser.html',
                controller: 'rpUserCtrl'
            })

            .when('/user/:username', {
                templateUrl: 'rpUser.html',
                controller: 'rpUserCtrl'
            })

            .when('/user/:username/:where', {
                templateUrl: 'rpUser.html',
                controller: 'rpUserCtrl'
            })

            .when('/r/:subreddit/comments/:article/:slug/:comment', {
                templateUrl: 'rpArticleCard.html',
                controller: 'rpArticleCtrl'
            })

            .when('/r/:subreddit/comments/:article/:comment', {
                templateUrl: 'rpArticleCard.html',
                controller: 'rpArticleCtrl'
            })

            .when('/r/:subreddit/comments/:article', {
                templateUrl: 'rpArticleCard.html',
                controller: 'rpArticleCtrl'
            })

            .when('/r/:sub/:sort', {
                templateUrl: 'rpPosts.html',
                controller: 'rpPostsCtrl'
            })

            .when('/error/:status/:message', {
                templateUrl: 'rpRouteError.html',
            })

            .when('/error/:status', {
                templateUrl: 'rpRouteError.html',
            })

            .when('/error', {
                templateUrl: 'rpRouteError.html'
            })

            .when('/facebookComplete', {
                templateUrl: 'rpFacebookComplete.html'
            })

            .when('/r/:sub', {
                templateUrl: 'rpPosts.html',
                controller: 'rpPostsCtrl'
            })

            .when('/:sort', {
                templateUrl: 'rpPosts.html',
                controller: 'rpPostsCtrl'
            })

            // .when('/hot', {
            //     templateUrl: 'rpPosts.html',
            //     controller: 'rpPostsCtrl'
            // })
            // .when('/new', {
            //     templateUrl: 'rpPosts.html',
            //     controller: 'rpPostsCtrl'
            // })
            // .when('/rising', {
            //     templateUrl: 'rpPosts.html',
            //     controller: 'rpPostsCtrl'
            // })
            // .when('/controversial', {
            //     templateUrl: 'rpPosts.html',
            //     controller: 'rpPostsCtrl'
            // })
            // .when('/top', {
            //     templateUrl: 'rpPosts.html',
            //     controller: 'rpPostsCtrl'
            // })
            // .when('/gilded', {
            //     templateUrl: 'rpPosts.html',
            //     controller: 'rpPostsCtrl'
            // })
            .when('/', {
                templateUrl: 'rpPosts.html',
                controller: 'rpPostsCtrl'
            })

            .otherwise({
                templateUrl: 'rpRouteError.html'
            });

        $locationProvider.html5Mode(true);
        // $locationProvider.hashPrefix('!');
    }
]);

rpApp.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        // .primaryPalette('blue')
        // .primaryPalette('deep-orange')
        .primaryPalette('indigo')
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('deep-orange', {
            'default': 'A200'
        });

    $mdThemingProvider.theme('indigo').primaryPalette('indigo').accentPalette('pink', {
        'default': 'A200'
    });
    $mdThemingProvider.theme('green').primaryPalette('green').accentPalette('orange', {
        'default': 'A200'
    });
    $mdThemingProvider.theme('deep-orange').primaryPalette('deep-orange').accentPalette('cyan', {
        'default': '500'
    });
    $mdThemingProvider.theme('red').primaryPalette('red').accentPalette('blue', {
        'default': 'A200'
    });
    $mdThemingProvider.theme('pink').primaryPalette('pink').accentPalette('teal', {
        'default': '500'
    });
    $mdThemingProvider.theme('purple').primaryPalette('purple').accentPalette('teal', {
        'default': '500'
    });

    $mdThemingProvider.alwaysWatchTheme(true);

}]);

rpApp.config(['$mdIconProvider', function ($mdIconProvider) {
    console.log('[rpApp] load svg icon sprite');
    $mdIconProvider.defaultIconSet('../../icons/sprite/sprite.svg');
}]);

/*
	http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
 */
rpApp.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;


    $location.path = function (path, reload) {
        console.log('[rpApp rpLocation] path: ' + path + ', reload: ' + reload);

        if (reload === false) {
            var lastRoute = $route.current;

            console.log('[rpApp rpLocation] LISTENER SET');

            var un = $rootScope.$on('$locationChangeSuccess', function () {
                console.log('[rpApp rpLocation] $locationChangeSuccess (LISTENER UNSET)');
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };

}]);


// rpApp.run(['$rootScope', function($rootScope) {
// 	var $oldDigest = $rootScope.$digest;
// 	var $newDigest = function() {
// 		console.time("$digest");
// 		$oldDigest.apply($rootScope);
// 		console.timeEnd("$digest");
// 	};
// 	$rootScope.$digest = $newDigest;
// }]);


/*
empty digest cycle listener
 */
// rpApp.run(['$rootScope', function($rootScope) {
// 	$rootScope.$watch(function() {
// 		console.log('[height digest cycle]');
// 	});
// }]);
