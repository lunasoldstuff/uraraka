(function () {
  'use strict';

  var deregisterRouteUpdate;

  function rpLoginButtonCtrl(
    $scope,
    $location
  ) {
    console.log('[rpLoginButtonCtrl] $scope.path: ' + $scope.path);

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
      rpLoginButtonCtrl
    ]);
}());
