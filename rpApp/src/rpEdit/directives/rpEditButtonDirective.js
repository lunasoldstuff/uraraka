(function () {
  'use strict';

  function rpEditButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpEdit/views/rpEditButton.html',
      controller: 'rpEditButtonCtrl',
      scope: {
        parentCtrl: '='

      }

    };
  }

  angular.module('rpEdit')
    .directive('rpEditButton', rpEditButton);
}());
