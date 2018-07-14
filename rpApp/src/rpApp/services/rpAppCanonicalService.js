(function () {
  'use strict';

  function rpAppCanonicalService($rootScope, $location) {
    const BASE = 'https://www.reddup.co';

    let canonicalService = {
      data: {
        canonicalUrl: 'https://www.reddup.co/'
      },

      getCanonicalData() {
        return this.data;
      },

      setCanonicalUrl() {
        let path = $location.path();
        if (path.substr(-1) !== '/') path += '/';
        this.data.canonicalUrl = BASE + path;
        console.log(`[rpAppCanonicalService] setCanonicalUrl(), this.data.canonicalUrl: ${this.data.canonicalUrl}`);
      }
    };

    $rootScope.$on('$routeChangeSuccess', function (e, current) {
      console.log('[rpAppCanonicalService] onRouteChangeSuccess, $location.path: ' +
          $location.path());
      canonicalService.setCanonicalUrl();
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
