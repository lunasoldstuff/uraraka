(function () {
  'use strict';

  function rpAppLocationService($location, $window, $route) {
    return function (e, _url, search, reload, replace) {
      let url = _url;
      if (e !== null && e.ctrlKey) {
        url = search ? url + '?' + search : url;

        console.log('[rpAppLocationService] search: ' + search);
        console.log('[rpAppLocationService] url: ' + url);

        $window.open(url);
      } else {
        console.log('[rpAppLocationService] url: ' + url);
        console.log('[rpAppLocationService] $location.path(): ' + $location.path());
        console.log('[rpAppLocationService] search: ' + search);
        console.log('[rpAppLocationService] reload: ' + reload);
        console.log('[rpAppLocationService] replace: ' + replace);

        if (reload && $location.path() === '/' && url === '/') {
          console.log('[rpAppLocationService] reload frontpage route.reload()');
          $route.reload();
        }

        $location.search(search);

        $location.path(url, reload);


        if (replace) {
          $location.replace();
        }
      }
    };
  }

  angular.module('rpApp')
    .factory('rpAppLocationService', [
      '$location',
      '$window',
      '$route',
      rpAppLocationService
    ]);
}());
