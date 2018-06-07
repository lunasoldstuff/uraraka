(function () {
  'use strict';

  function rpAppGoogleUrlResourceService($resource) {
    return $resource('https://www.googleapis.com/urlshortener/v1/url', {
      key: 'AIzaSyCie8StCg7EAAOECOjLa3qEMocvi7YhQfU'
    });
  }

  angular.module('rpApp')
    .factory('rpAppGoogleUrlResourceService', [
      '$resource',
      rpAppGoogleUrlResourceService
    ]);
}());
