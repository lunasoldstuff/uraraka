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
    rpAppTitleService,
    rpAppDescriptionService,
    rpSlideshowService,
    rpAppCanonicalService
  ) {
    let appCtrl = this;

    var deregisterSlideshowEnd;
    var deregisterSlideshowStart;

    console.log('[rpAppCtrl] $attrs.isAuthenticated: ' + $attrs.isAuthenticated);
    console.log('[rpAppCtrl] $attrs.userAgent: ' + $attrs.userAgent);

    appCtrl.settings = rpSettingsService.getSettings();
    appCtrl.slideshow = rpSlideshowService.getSettings();
    appCtrl.titles = rpAppTitleService.getTitles();
    appCtrl.descriptionService = rpAppDescriptionService;
    appCtrl.canonicalData = rpAppCanonicalService.getCanonicalData();
    console.log(`[rpAppCtrl] appCtrl.canonicalData.canonicalUrl: ${
      appCtrl.canonicalData.canonicalUrl
    }`);

    // init isAuthenticated
    console.log('[rpAppCtrl] typeof $attrs.isAuthenticated: ' +
        typeof $attrs.isAuthenticated);
    appCtrl.isAuthenticated = $attrs.isAuthenticated === 'true';
    rpAppAuthService.setAuthenticated($attrs.isAuthenticated === 'true');

    // init user agent
    rpAppUserAgentService.setUserAgent($attrs.userAgent);

    deregisterSlideshowEnd = $rootScope.$on('rp_slideshow_end', () => {
      console.log('[rpAppCtrl] slideshow end');
      // appCtrl.slideshowActive = false;
      // TODO: Check if this is required
      $timeout(angular.noop, 0);
    });

    $scope.$on('$destroy', function () {
      deregisterSlideshowEnd();
      deregisterSlideshowStart();
    });
  }

  angular
    .module('rpApp')
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
      'rpAppTitleService',
      'rpAppDescriptionService',
      'rpSlideshowService',
      'rpAppCanonicalService',
      rpAppCtrl
    ]);
}());
