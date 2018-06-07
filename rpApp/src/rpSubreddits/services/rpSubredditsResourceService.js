(function () {
  'use strict';

  function rpSubredditsResourceService($resource) {
    return $resource('/api/subreddits/:where', {
      where: 'default',
      limit: 50
    });
  }

  angular.module('rpSubreddits')
    .factory('rpSubredditsResourceService', [
      '$resource',
      rpSubredditsResourceService
    ]);
}());
