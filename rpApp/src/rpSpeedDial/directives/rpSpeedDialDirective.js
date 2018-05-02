(function () {
  'use strict';

  function rpSpeedDial() {
    return {
      restirct: 'E',
      templateUrl: 'rpSpeedDial/views/rpSpeedDial.html',
      controller: 'rpSpeedDialCtrl'
    };
  }

  angular.module('rpSpeedDial')
    .directive('rpSpeedDial', [rpSpeedDial]);
}());
