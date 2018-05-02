(function () {
  'use strict';

  function rpSettings() {
    return {
      restrict: 'C',
      templateUrl: 'rpSettings/views/rpSettings.html',
      controller: 'rpSettingsCtrl'
    };
  }

  angular.module('rpSettings')
    .directive('rpSettings', [rpSettings]);
}());
