(function () {
  'use strict';

  function rpPostResourceService($resource) {
    return $resource('/api/subreddit/:sub/:sort');
  }

  angular.module('rpPost')
    .factory('rpPostResourceService', [
      '$resource',
      rpPostResourceService
    ]);
}());
