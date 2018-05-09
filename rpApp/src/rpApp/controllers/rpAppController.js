(function () {
  /*
    Top level controller.
    controls sidenav toggling. (This might be better suited for the sidenav controller no?)
  */

  function rpAppCtrl(
    $scope,
    $attrs,
    $rootScope,
    $timeout,
    $cookies,
    $compile,
    $filter,
    $mdSidenav,
    $mdMedia,
    rpAppAuthService,
    rpSettingsService,
    rpAppUserAgentService,
    rpPlusSubscriptionService

  ) {
    var deregisterSlideshowEnd;
    var deregisterSlideshowStart;
    var deregisterRouteChangeSuccess;
    var deregisterHandleDescriptionChange;
    var deregisterHandleTitleChange;

    console.log('[rpAppCtrl] $attrs.authenticated: ' + $attrs.authenticated);
    console.log('[rpAppCtrl] $attrs.userAgent: ' + $attrs.userAgent);
    console.log('[rpAppCtrl] $cookies');

    // FIXME: Globals, maybe they would be better off in services?
    $scope.isDocked = true;
    this.settings = rpSettingsService.getSettings();

    $scope.slidehsowActive = false;
    $scope.appTitle = 'reddup';
    $scope.appDescription =
      'A new and exciting reddit web app. The most beautiful and advanced way to browse reddit online.';

    // init authenticated
    $scope.authenticated = $attrs.authenticated === true;
    rpAppAuthService.setAuthenticated($attrs.authenticated);

    // init user agent
    $scope.userAgent = $attrs.userAgent;
    rpAppUserAgentService.setUserAgent($attrs.userAgent);

    // TODO: is this variable used?
    $scope.dynamicTheme = 'redTheme';

    $scope.init = function () {
      console.log('[rpAppCtrl] init(), $attrs.authenticated: ' + $attrs.authenticated);
      console.log('[rpAppCtrl] init(), $attrs.userAgent: ' + $attrs.userAgent);

      // init authenticated
      $scope.authenticated = $attrs.authenticated === 'true';
      rpAppAuthService.setAuthenticated($attrs.authenticated);

      // init user agent
      $scope.userAgent = $attrs.userAgent;
      rpAppUserAgentService.setUserAgent($attrs.userAgent);

      console.log('[rpAppCtrl] $scope.authenticated: ' + $scope.authenticated);

      // check plus subscription as the pasge loads
      rpPlusSubscriptionService.isSubscribed(function (isSubscribed) {
        $scope.isSubscribed = isSubscribed;
      });
    };

    // TODO: These might be better off in the sidenav controller themselves.
    $scope.sidenavIsOpen = function () {
      return $mdSidenav('left')
        .isOpen();
    };

    $scope.toggleLeft = function () {
      $mdSidenav('left')
        .toggle();
    };

    $scope.close = function () {
      $mdSidenav('left')
        .close();
    };

    $scope.isOpenRules = function () {
      return $mdSidenav('right')
        .isOpen();
    };

    $scope.toggleRules = function () {
      $mdSidenav('right')
        .toggle();
    };

    $scope.loadMoreClick = function () {
      $rootScope.$emit('rp_load_more');
    };

    function closeSidenavs() {
      if ($mdSidenav('left')
        .isOpen()) {
        $mdSidenav('left')
          .toggle();
      }

      if ($mdSidenav('right')
        .isOpen()) {
        $mdSidenav('right')
          .toggle();
      }
    }

    deregisterHandleDescriptionChange = $rootScope.$on('rp_description_change', function (e, description) {
      if (description === 'default') {
        $scope.appDescriptionn =
          'A new and exciting reddit web app. The most beautiful and advanced way to browse reddit online.';
      } else {
        $scope.appDescription = $filter('limitTo')(description, 200);
      }
    });

    deregisterHandleTitleChange = $rootScope.$on('rp_title_change_page', function (e, title) {
      if (title === 'frontpage') {
        $scope.appTitle = 'reddup';
      } else {
        $scope.appTitle = 'reddup: ' + title;
      }
    });


    deregisterSlideshowStart = $rootScope.$on('rp_slideshow_start', function () {
      console.log('[rpAppCtrl] slideshow start');
      $scope.slideshowActive = true;
    });

    deregisterSlideshowEnd = $rootScope.$on('rp_slideshow_end', function () {
      console.log('[rpAppCtrl] slideshow end');
      $scope.slideshowActive = false;
      $timeout(angular.noop, 0);
    });

    deregisterRouteChangeSuccess = $scope.$on('$routeChangeSuccess', function () {
      console.log('[rpAppCtrl] $routeChangeSuccess');
      closeSidenavs();
    });


    $scope.$on('$destroy', function () {
      deregisterHandleTitleChange();
      deregisterRouteChangeSuccess();
      deregisterSlideshowEnd();
      deregisterSlideshowStart();
    });
  }

  angular.module('rpApp')
    .controller('rpAppCtrl', [
      '$scope',
      '$attrs',
      '$rootScope',
      '$timeout',
      '$cookies',
      '$compile',
      '$filter',
      '$mdSidenav',
      '$mdMedia',
      'rpAppAuthService',
      'rpSettingsService',
      'rpAppUserAgentService',
      'rpPlusSubscriptionService',
      rpAppCtrl
    ]);
}());
