(function () {
  'use strict';

  function rpSidebarCtrl(
    $scope,
    rpSubredditsService
  ) {
    this.about = rpSubredditsService.getAbout();
  }

  angular.module('rpSidebar')
    .controller('rpSidebarCtrl', [
      '$scope',
      'rpSubredditsService',
      rpSidebarCtrl
    ]);
}());
