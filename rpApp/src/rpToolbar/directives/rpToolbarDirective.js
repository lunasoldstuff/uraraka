(function () {
  'use strict';

  function rpToolbar() {
    return {
      restrict: 'E',
      templateUrl: 'rpToolbar/views/rpToolbar.html',
      controller: 'rpToolbarCtrl'

    };
  }

  angular.module('rpToolbar')
    .directive('rpToolbar', [rpToolbar]);
}());
