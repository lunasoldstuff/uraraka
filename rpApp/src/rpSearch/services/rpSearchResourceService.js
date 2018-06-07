(function () {
  'use strict';

  function rpSearchResourceService($resource) {
    return $resource('/api/search/:sub', {
      sub: 'all',
      sort: 'relevance',
      after: '',
      before: '',
      restrict_sr: true,
      t: 'all',
      type: 'sr',
      limit: 24
    });
  }

  angular.module('rpSearch')
    .factory('rpSearchResourceService', [
      '$resource',
      rpSearchResourceService
    ]);
}());
