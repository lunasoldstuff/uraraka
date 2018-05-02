(function () {
  'use strict';

  function rpSubmitText() {
    return {
      restrict: 'C',
      templateUrl: 'rpSubmit/views/rpSubmitText.html',
      controller: 'rpSubmitCtrl'
    };
  }

  angular.module('rpSubmit')
    .directive('rpSubmitText', [rpSubmitText]);
}());
