(function () {
  'use strict';

  function rpSubreddits() {
    return {
      restrict: 'E',
      templateUrl: 'rpSubreddits/views/rpSubreddits.html',
      controller: 'rpSubredditsCtrl'
    };
  }

  angular.module('rpSubreddits')
    .directive('rpSubreddits', [rpSubreddits]);
}());
