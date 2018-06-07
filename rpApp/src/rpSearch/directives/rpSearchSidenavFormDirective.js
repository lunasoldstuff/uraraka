(function () {
  'use strict';

  function rpSearchSidenavForm() {
    return {
      restrict: 'E',
      templateUrl: 'rpSearch/views/rpSearchSidenavForm.html',
      replace: true

    };
  }

  angular.module('rpSearch')
    .directive('rpSearchSidenavForm', [rpSearchSidenavForm]);
}());
