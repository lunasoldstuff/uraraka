(function () {
  'use strict';

  function rpPlusSubscription() {
    return {
      restrict: 'E',
      templateUrl: 'rpPlus/views/rpPlusSubscription.html',
      controller: 'rpPlusSubscriptionCtrl'
    };
  }

  angular.module('rpPlus')
    .directive('rpPlusSubscription', [rpPlusSubscription]);
}());
