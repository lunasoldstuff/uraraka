(function () {
  'use strict';

  function rpUserResourceService($resource) {
    return $resource('/api/user/:username/:where', {
      username: '',
      where: 'overview',
      sort: 'new',
      after: 'none',
      t: 'none'
    });
  }

  angular.module('rpUser')
    .factory('rpUserResourceService', [
      '$resource',
      rpUserResourceService
    ]);
}());
