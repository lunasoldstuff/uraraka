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
    rpPlusSubscriptionService,
    rpAppTitleService,
    rpAppDescriptionService
  ) {
    let appCtrl = this;

    var deregisterSlideshowEnd;
    var deregisterSlideshowStart;
    var deregisterRouteChangeSuccess;
    var deregisterHandleDescriptionChange;
    var deregisterHandleTitleChange;

    console.log('[rpAppCtrl] $attrs.isAuthenticated: ' + $attrs.isAuthenticated);
    console.log('[rpAppCtrl] $attrs.userAgent: ' + $attrs.userAgent);
    console.log('[rpAppCtrl] $cookies');

    appCtrl.settings = rpSettingsService.getSettings();
    appCtrl.slideshowActive = false;
    appCtrl.titles = rpAppTitleService.getTitles();
    appCtrl.descriptionService = rpAppDescriptionService;

    // init isAuthenticated
    console.log('[rpAppCtrl] typeof $attrs.isAuthenticated: ' + typeof $attrs.isAuthenticated);
    console.log('[rpAppCtrl] $attrs.isAuthenticated: ' + $attrs.isAuthenticated);
    appCtrl.isAuthenticated = ($attrs.isAuthenticated === 'true');
    rpAppAuthService.setAuthenticated($attrs.isAuthenticated);

    // init user agent
    rpAppUserAgentService.setUserAgent($attrs.userAgent);

    // TODO: These might be better off in the sidenav controller themselves.
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

    // TODO: eliminate these events
    deregisterSlideshowStart = $rootScope.$on('rp_slideshow_start', () => {
      console.log('[rpAppCtrl] slideshow start');
      appCtrl.slideshowActive = true;
    });

    deregisterSlideshowEnd = $rootScope.$on('rp_slideshow_end', () => {
      console.log('[rpAppCtrl] slideshow end');
      appCtrl.slideshowActive = false;
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
      'rpAppTitleService',
      'rpAppDescriptionService',
      rpAppCtrl
    ]);
}());
