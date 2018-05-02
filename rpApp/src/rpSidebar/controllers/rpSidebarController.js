(function () {
  'use strict';

  function rpSidebarCtrl($scope, $rootScope, rpSubredditsService) {
    var deregisterSubredditsAboutUpdated;
    $scope.about = rpSubredditsService.about.data;

    deregisterSubredditsAboutUpdated = $rootScope.$on('subreddits_about_updated', function () {
      console.log('[rpSidebarCtrl] subreddits_about_updated');
      $scope.about = rpSubredditsService.about.data;
    });

    $scope.$on('$destroy', function () {
      deregisterSubredditsAboutUpdated();
    });
  }

  angular.module('rpSidebar')
    .controller('rpSidebarCtrl', [
      '$scope',
      '$rootScope',
      'rpSubredditsService',
      rpSidebarCtrl
    ]);
}());
