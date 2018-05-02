(function () {
  'use strict';

  function rpPostFrontpageResourceService($resource) {
    return $resource('/api/:sort', {
      sort: 'hot',
      after: 'none',
      t: 'none',
      limit: 'limit'
    });
  }

  angular.module('rpPost')
    .factory('rpPostFrontpageResourceService', [
      '$resource',
      rpPostFrontpageResourceService
    ]);
}());
