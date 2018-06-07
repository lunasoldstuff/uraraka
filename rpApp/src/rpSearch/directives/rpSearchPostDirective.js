(function () {
  'use strict';

  function rpSearchPost() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchPost.html'
    };
  }

  angular.module('rpSearch')
    .directive('rpSearchPost', [rpSearchPost]);
}());
