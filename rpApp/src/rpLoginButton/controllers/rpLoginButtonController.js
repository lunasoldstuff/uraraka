(function () {
  'use strict';

  var deregisterRouteUpdate;

  function rpLoginButtonCtrl($scope, $location, rpAppAuthService) {
    console.log('[rpLoginButtonCtrl] $scope.path: ' + $scope.path);

    $scope.isAuthenticated = rpAppAuthService.isAuthenticated;

    $scope.safePath = $scope.path ? encodeURIComponent($scope.path) : encodeURIComponent($location.path());

    deregisterRouteUpdate = $scope.$on('$locationChangeSuccess', function () {
      $scope.safePath = encodeURIComponent($location.path());
      console.log('[rpLoginButtonCtrl] onLocationChangeSuccess, $scope.safePath: ' + $scope.safePath);
    });

    $scope.$on('$destroy', function () {
      deregisterRouteUpdate();
    });
  }

  angular.module('rpLoginButton')
    .controller('rpLoginButtonCtrl', [
      '$scope',
      '$location',
      'rpAppAuthService',
      rpLoginButtonCtrl
    ]);
}());
