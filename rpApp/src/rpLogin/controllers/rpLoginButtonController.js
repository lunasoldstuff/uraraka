(function () {
  'use strict';

  function rpLoginButtonCtrl($scope, $location) {
    var deregisterRouteUpdate;
    console.log('[rpLoginButtonCtrl] $scope.path: ' + $scope.path);

    $scope.safePath = $scope.path
      ? encodeURIComponent($scope.path)
      : encodeURIComponent($location.path());

    deregisterRouteUpdate = $scope.$on('$locationChangeSuccess', function () {
      $scope.safePath = encodeURIComponent($location.path());
      console.log('[rpLoginButtonCtrl] onLocationChangeSuccess, $scope.safePath: ' +
          $scope.safePath);
    });

    $scope.$on('$destroy', function () {
      deregisterRouteUpdate();
    });
  }

  angular
    .module('rpLogin')
    .controller('rpLoginButtonCtrl', [
      '$scope',
      '$location',
      rpLoginButtonCtrl
    ]);
}());
