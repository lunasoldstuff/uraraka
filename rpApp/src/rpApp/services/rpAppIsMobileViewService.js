(function () {
  'use strict';

  function rpAppIsMobileViewService($window) {
    const LAYOUT_XS = 600;

    var appIsMobileViewService = {
      isMobileView() {
        return $window.innerWidth <= LAYOUT_XS;
      }
    };

    return appIsMobileViewService;
  }

  angular.module('rpApp')
    .factory('rpAppIsMobileViewService', [
      '$window',
      rpAppIsMobileViewService
    ]);
}());
