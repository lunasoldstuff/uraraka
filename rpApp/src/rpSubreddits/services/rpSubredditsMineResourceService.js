(function () {
  'use strict';

  function rpSubredditsMineResourceService($resource) {
    return $resource('/api/uauth/subreddits/mine/:where', {
      where: 'subscriber',
      limit: 50,
      after: ''
    });
  }

  angular.module('rpSubreddits')
    .factory('rpSubredditsMineResourceService', [
      '$resource',
      rpSubredditsMineResourceService
    ]);
}());
