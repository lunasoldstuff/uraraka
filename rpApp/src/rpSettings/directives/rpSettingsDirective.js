(function () {
  'use strict';

  function rpSettings() {
    return {
      restrict: 'C',
      templateUrl: 'rpSettings/views/rpSettings.html',
      controller: 'rpSettingsCtrl',
      controllerAs: 'settingsCtrl'
    };
  }

  angular.module('rpSettings')
    .directive('rpSettings', [rpSettings]);
}());
