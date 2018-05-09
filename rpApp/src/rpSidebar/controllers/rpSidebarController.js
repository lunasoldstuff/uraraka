(function () {
  'use strict';

  function rpSidebarCtrl(
    $scope,
    $rootScope,
    rpSubredditsService
  ) {
    this.about = rpSubredditsService.getAbout();
  }

  angular.module('rpSidebar')
    .controller('rpSidebarCtrl', [
      '$scope',
      '$rootScope',
      'rpSubredditsService',
      rpSidebarCtrl
    ]);
}());
