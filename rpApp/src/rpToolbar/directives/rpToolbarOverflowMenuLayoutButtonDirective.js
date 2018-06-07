(function () {
  'use strict';

  function rpToolbarOverflowMenuLayoutButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpToolbar/views/rpToolbarOverflowMenuLayoutButton.html',
      controller: 'rpToolbarOverflowMenuLayoutButtonCtrl',
      controllerAs: 'toolbarOverflowMenuLayoutButtonCtrl'
    };
  }

  angular.module('rpToolbar')
    .directive('rpToolbarOverflowMenuLayoutButton', [rpToolbarOverflowMenuLayoutButton]);
}());
