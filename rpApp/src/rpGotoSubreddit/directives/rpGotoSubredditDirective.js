(function () {
  'use strict';


  function rpGotoSubreddit() {
    return {
      restrict: 'E',
      templateUrl: 'rpGotoSubreddit/views/rpGotoSubreddit.html',
      controller: 'rpGotoSubredditCtrl',
      controllerAs: 'gotoSubredditCtrl'
    };
  }

  angular.module('rpGotoSubreddit')
    .directive('rpGotoSubreddit', [rpGotoSubreddit]);
}());
