'use strict';

/* App Module */

var rpApp = angular.module('rpApp', [
  'ngRoute',
  'ngMaterial',
  'ngAnimate',
  'ngSanitize',
  'ngMessages',
  'ngCookies',
  'ngResource',
  'linkify',
  'angularMoment',
  'RecursionHelper',
  'rt.debounce',
  'mediaCheck',
  'angular-google-adsense',
  'angular-inview',
  'youtube-embed',
  'rpAds',
  'rpArticle',
  'rpCaptcha',
  'rpComment',
  'rpDelete',
  'rpDialogCloseButton',
  'rpEdit',
  'rpError',
  'rpFeedback',
  'rpFormatting',
  'rpGild',
  'rpGotoSubreddit',
  'rpHide',
  'rpIdentity',
  'rpLayoutButton',
  'rpLink',
  'rpLogin',
  'rpMedia',
  'rpMessage',
  'rpNightTheme',
  'rpOpenNew',
  'rpOverflowMenu',
  'rpPost',
  'rpProgress',
  'rpReddit',
  'rpRefreshButton',
  'rpReply',
  'rpSave',
  'rpScore',
  'rpSearch',
  'rpSettings',
  'rpShare',
  'rpSidebar',
  'rpSidenav',
  'rpSlideshow',
  'rpSocial',
  'rpSpeedDial',
  'rpSubmit',
  'rpSubreddits',
  'rpSubscribe',
  'rpTemplates',
  'rpToast',
  'rpToolbar',
  'rpToolbarSelect',
  'rpUser'
]);

rpApp.run([
  '$animate',
  function ($animate) {
    $animate.enabled(true);
  }
]);

rpApp.constant('angularMomentConfig', {
  preprocess: 'unix',
  timezone: 'utc'
});

rpApp.config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider

      .when('/feedback', {
        templateUrl: 'rpFeedback/views/rpFeedbackCard.html',
        controller: 'rpFeedbackCtrl'
      })

      .when('/share/email', {
        templateUrl: 'rpShare/views/rpShareEmailCard.html',
        controller: 'rpShareEmailCtrl'
      })

      .when('/submitLink', {
        templateUrl: 'rpSubmit/views/rpSubmitLinkCard.html',
        controller: 'rpSubmitCtrl'
      })

      .when('/submitText', {
        templateUrl: 'rpSubmit/views/rpSubmitTextCard.html',
        controller: 'rpSubmitCtrl'
      })

      .when('/:sub/search', {
        templateUrl: 'rpSearch/views/rpSearch.html',
        controller: 'rpSearchCtrl'
      })

      .when('/search', {
        templateUrl: 'rpSearch/views/rpSearch.html',
        controller: 'rpSearchCtrl'
      })

      .when('/settings/:selected', {
        templateUrl: 'rpSettings/views/rpSettings.html',
        controller: 'rpSettingsCtrl',
        controllerAs: 'settingsCtrl'
      })

      .when('/settings', {
        templateUrl: 'rpSettings/views/rpSettings.html',
        controller: 'rpSettingsCtrl',
        controllerAs: 'settingsCtrl'
      })

      .when('/message', {
        templateUrl: 'rpMessage/rpMessage/views/rpMessage.html',
        controller: 'rpMessageCtrl'
      })

      .when('/message/compose', {
        templateUrl:
          'rpMessage/rpMessageCompose/views/rpMessageComposeCard.html',
        controller: 'rpMessageComposeCtrl'
      })

      .when('/message/:where', {
        templateUrl: 'rpMessage/rpMessage/views/rpMessage.html',
        controller: 'rpMessageCtrl'
      })

      .when('/u/:username', {
        templateUrl: 'rpUser/views/rpUser.html',
        controller: 'rpUserCtrl'
      })

      .when('/u/:username/:where', {
        templateUrl: 'rpUser/views/rpUser.html',
        controller: 'rpUserCtrl'
      })

      .when('/user/:username', {
        templateUrl: 'rpUser/views/rpUser.html',
        controller: 'rpUserCtrl'
      })

      .when('/user/:username/:where', {
        templateUrl: 'rpUser/views/rpUser.html',
        controller: 'rpUserCtrl'
      })

      .when('/r/:subreddit/comments/:article/:slug/:comment', {
        templateUrl: 'rpArticle/views/rpArticleCard.html',
        controller: 'rpArticleCtrl',
        controllerAs: 'articleCtrl'
      })

      .when('/r/:subreddit/comments/:article/:comment', {
        templateUrl: 'rpArticle/views/rpArticleCard.html',
        controller: 'rpArticleCtrl',
        controllerAs: 'articleCtrl'
      })

      .when('/r/:subreddit/comments/:article', {
        templateUrl: 'rpArticle/views/rpArticleCard.html',
        controller: 'rpArticleCtrl',
        controllerAs: 'articleCtrl'
      })

      .when('/r/:sub/:sort', {
        templateUrl: 'rpPost/views/rpPost.html',
        controller: 'rpPostCtrl'
      })

      .when('/error/:status/:message', {
        templateUrl: 'rpError/views/rpError.html'
      })

      .when('/error/:status', {
        templateUrl: 'rpError/views/rpError.html'
      })

      .when('/error', {
        templateUrl: 'rpError/views/rpError.html'
      })

      .when('/facebookComplete', {
        // FIXME: invalid path
        templateUrl: 'rpFacebookComplete.html'
      })

      .when('/r/:sub', {
        templateUrl: 'rpPost/views/rpPost.html',
        controller: 'rpPostCtrl'
      })

      .when('/:sort', {
        templateUrl: 'rpPost/views/rpPost.html',
        controller: 'rpPostCtrl'
      })

      .when('/', {
        templateUrl: 'rpPost/views/rpPost.html',
        controller: 'rpPostCtrl'
      })

      .otherwise({
        templateUrl: 'rpError/views/rpError.html'
      });

    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
  }
]);

/**
 * Configure Angular Material Themes.
 */
rpApp.config([
  '$mdThemingProvider',
  function ($mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
      // .primaryPalette('blue')
      // .primaryPalette('deep-orange')
      .primaryPalette('indigo')
      // If you specify less than all of the keys, it will inherit from the
      // default shades
      .accentPalette('deep-orange', {
        default: 'A200'
      });

    $mdThemingProvider
      .theme('indigo')
      .primaryPalette('indigo')
      .accentPalette('pink', {
        default: 'A200'
      });
    $mdThemingProvider
      .theme('green')
      .primaryPalette('green')
      .accentPalette('orange', {
        default: 'A200'
      });
    $mdThemingProvider
      .theme('deep-orange')
      .primaryPalette('deep-orange')
      .accentPalette('cyan', {
        default: '500'
      });
    $mdThemingProvider
      .theme('red')
      .primaryPalette('red')
      .accentPalette('blue', {
        default: 'A200'
      });
    $mdThemingProvider
      .theme('pink')
      .primaryPalette('pink')
      .accentPalette('teal', {
        default: '500'
      });
    $mdThemingProvider
      .theme('purple')
      .primaryPalette('purple')
      .accentPalette('teal', {
        default: '500'
      });

    $mdThemingProvider.alwaysWatchTheme(true);
  }
]);

/**
 * Load SVG sprite sheet
 */
rpApp.config([
  '$mdIconProvider',
  function ($mdIconProvider) {
    console.log('[rpApp] load svg icon sprite');
    $mdIconProvider.defaultIconSet('../../icons/sprite/sprite.svg');
  }
]);

/*
  Override $location.path to allow you to change path without reloading.
  http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
 */
rpApp.run([
  '$route',
  '$rootScope',
  '$location',
  function ($route, $rootScope, $location) {
    let original = $location.path;

    $location.path = function (path, reload) {
      console.log('[rpApp rpLocation] path: ' + path + ', reload: ' + reload);

      if (reload === false) {
        let lastRoute = $route.current;

        console.log('[rpApp rpLocation] LISTENER SET');

        let un = $rootScope.$on('$locationChangeSuccess', function () {
          console.log('[rpApp rpLocation] $locationChangeSuccess (LISTENER UNSET)');
          $route.current = lastRoute;
          un();
        });
      }
      return original.apply($location, [path]);
    };
  }
]);

// rpApp.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
//   $provide.factory('httpInterceptor', function () {
//     return {
//       request: function (config) {
//         console.log('[rpApp] httpInterceptor request, config.url: ' + config.url);
//         return config;
//       }
//     };
//   });
//
//   $httpProvider.interceptors.push('httpInterceptor');
// }]);
