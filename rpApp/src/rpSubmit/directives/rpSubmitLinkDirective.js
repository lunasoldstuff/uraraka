(function () {
  'use strict';

  function rpSubmitLink() {
    return {
      restrict: 'C',
      templateUrl: 'rpSubmit/views/rpSubmitLink.html',
      controller: 'rpSubmitCtrl'
    };
  }

  angular.module('rpSubmit')
    .directive('rpSubmitLink', [rpSubmitLink]);
}());
