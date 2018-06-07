(function () {
  'use strict';

  function rpDialogCloseButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpDialogCloseButton/views/rpDialogCloseButton.html',
      controller: 'rpDialogCloseButtonCtrl'
    };
  }

  angular.module('rpDialogCloseButton')
    .directive('rpDialogCloseButton', [rpDialogCloseButton]);
}());
