(function () {
  'use strict';


  function rpGotoSubreddit() {
    return {
      restrict: 'E',
      templateUrl: 'rpGotoSubreddit/views/rpGotoSubreddit.html',
      controller: 'rpGotoSubredditCtrl'
    };
  }

  angular.module('rpGotoSubreddit')
    .directive('rpGotoSubreddit', [rpGotoSubreddit]);
}());
