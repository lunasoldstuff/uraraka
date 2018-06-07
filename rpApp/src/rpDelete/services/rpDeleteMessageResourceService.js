(function () {
  'use strict';

  function rpDeleteMessageResourceService($resource) {
    return $resource('/api/uauth/del_msg/');
  }

  angular.module('rpDelete')
    .factory('rpDeleteMessageResourceService', [
      '$resource',
      rpDeleteMessageResourceService
    ]);
}());
