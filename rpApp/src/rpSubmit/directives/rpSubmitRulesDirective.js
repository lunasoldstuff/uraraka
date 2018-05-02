(function () {
  'use strict';

  function rpSubmitRules() {
    return {
      restirct: 'E',
      templateUrl: 'rpSubmit/views/rpSubmitRules.html',
      controller: 'rpSubmitRulesCtrl'

    };
  }

  angular.module('rpSubmit')
    .directive('rpSubmitRules', [rpSubmitRules]);
}());
