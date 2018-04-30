(function () {
  'use strict';

  function rpDeleteButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpDelete/views/rpDeleteButton.html',
      controller: 'rpDeleteButtonCtrl',
      scope: {
        parentCtrl: '='

      }

    };
  }

  angular.module('rpDelete')
    .directive('rpDeleteButton', rpDeleteButton);
}());
