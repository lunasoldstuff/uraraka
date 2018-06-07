(function () {
  'use strict';

  function rpSearchForm() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchForm.html',
      replace: true
    };
  }

  angular.module('rpSearch')
    .directive('rpSearchForm', [rpSearchForm]);
}());
