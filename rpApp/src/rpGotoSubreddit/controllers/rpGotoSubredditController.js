(function () {
  'use strict';

  function rpGotoSubredditCtrl($scope) {
    console.log('[rpGotoSubredditCtrl] load');
    console.log('[rpGotoSubredditCtrl] load $scope.settings.animations: ' + $scope.settings.animations);
    $scope.isGotoSubredditOpen = false;

    $scope.toggleGotoSubredditOpen = function (e) {
      console.log('[rpGotoSubredditCtrl] toggleGotoSubredditOpen()');
      $scope.isGotoSubredditOpen = !$scope.isGotoSubredditOpen;
    };
  }

  angular.module('rpGotoSubreddit')
    .controller('rpGotoSubredditCtrl', [
      '$scope',
      rpGotoSubredditCtrl
    ]);
}());
