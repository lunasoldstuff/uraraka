(function () {
  'use strict';

  function rpSubredditsAboutResourceService($resource) {
    return $resource('/api/about/:sub');
  }

  angular.module('rpSubreddits')
    .factory('rpSubredditsAboutResourceService', [
      '$resource',
      rpSubredditsAboutResourceService
    ]);
}());
