(function () {
  'use strict';

  function rpProgress() {
    return {
      restrict: 'E',
      templateUrl: 'rpProgress/views/rpProgress.html',
      controller: 'rpProgressCtrl',
      controllerAs: 'progressCtrl'
    };
  }

  angular.module('rpProgress')
    .directive('rpProgress', rpProgress);
}());
