(function () {
  'use strict';

  function rpAppCanonicalService($rootScope, $location) {
    const BASE = 'https://www.reddup.co';

    let canonicalService = {
      data: {
        canonicalUrl: 'https://www.reddup.co'
      },

      getCanonicalData() {
        return this.data;
      },

      setCanonicalUrl(path) {
        this.data.canonicalUrl = BASE + path;
      }
    };
    $rootScope.$on('$routeChangeSuccess', function (e, current) {
      console.log('[rpAppCanonicalService] onRouteChangeSuccess, current: ' +
          JSON.stringify(current));
      console.log('[rpAppCanonicalService] onRouteChangeSuccess, $location.path: ' +
          $location.path());
      canonicalService.setCanonicalUrl($location.path());
    });

    return canonicalService;
  }

  angular
    .module('rpApp')
    .factory('rpAppCanonicalService', [
      '$rootScope',
      '$location',
      rpAppCanonicalService
    ]);
}());
