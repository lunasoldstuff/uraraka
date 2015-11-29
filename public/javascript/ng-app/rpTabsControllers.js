'use strict';

var rpTabsControllers = angular.module('rpTabsControllers', []);

rpTabsControllers.controller('rpTabsCtrl', ['$scope',
  function($scope) {
    console.log('[rpTabsCtrl]');

    $scope.tabClick = function(tab) {
      console.log('[rpTabsCtrl] tabClick(), tab: ' + tab);
      $scope.parentCtrl.tabClick(tab);
    };

  }

]);
