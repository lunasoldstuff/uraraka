(function () {
  'use strict';

  function rpErrorCtrl(
    $scope,
    $rootScope,
    $routeParams,
    rpAppTitleChangeService,
    rpToolbarButtonVisibilityService,
    rpProgressService
  ) {
    rpProgressService.hideProgress();
    rpToolbarButtonVisibilityService.hideAll();
    rpAppTitleChangeService('oops', true, true);

    $scope.status = parseInt($routeParams.status, 10) || 404;
    $scope.message = $routeParams.message;

    console.log('[rpErrorCtrl] $routeParams: ' + JSON.stringify($routeParams));
    console.log('[rpErrorCtrl] $routeParams.status: ' + $routeParams.status);
    console.log('[rpErrorCtrl] $scope.status: ' + $scope.status);

    if (!$scope.message) {
      if ($scope.status === 404) {
        $scope.message = "Did not find the page you're looking four-oh-four.";
      } else if ($scope.status === 403) {
        $scope.message = 'Page is forbidden :/ Maybe you have to message the mods for permission.';
      } else {
        $scope.message = 'Oops an error occurred.';
      }
    }
  }

  angular
    .module('rpError')
    .controller('rpErrorCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      'rpAppTitleChangeService',
      'rpToolbarButtonVisibilityService',
      'rpProgressService',
      rpErrorCtrl
    ]);
}());
