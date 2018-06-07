(function () {
  'use strict';

  function rpMediaTwitter() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaTwitter/views/rpMediaTwitter.html',
      controller: 'rpMediaTwitterCtrl'
    };
  }

  angular.module('rpMediaTwitter')
    .directive('rpMediaTwitter', [rpMediaTwitter]);
}());
