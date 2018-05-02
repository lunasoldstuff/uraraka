(function () {
  'use strict';

  function rpToolbarSelectButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpToolbarSelect/views/rpToolbarSelectButton.html',
      controller: 'rpToolbarSelectButtonCtrl',
      scope: {
        config: '='
      }
    };
  }
  angular.module('rpToolbarSelect')
    .directive('rpToolbarSelectButton', [rpToolbarSelectButton]);
}());
