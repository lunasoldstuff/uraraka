(function () {
  'use strict';

  function rpScoreVoteResourceService($resource) {
    return $resource('/api/uauth/vote/');
  }

  angular.module('rpScore')
    .factory('rpScoreVoteResourceService', [
      '$resource',
      rpScoreVoteResourceService
    ]);
}());
