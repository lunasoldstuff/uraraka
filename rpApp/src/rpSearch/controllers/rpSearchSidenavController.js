(function () {
  'use strict';

  function rpSearchSidenavCtrl(
    $scope,
    $rootScope,
    rpSearchFormService
  ) {
    var deregisterSearchFormVisibility;
    console.log('[rpSearchSdienavCtrl]');
    $scope.isSearchOpen = rpSearchFormService.isVisible;

    $scope.toggleSearchOpen = function (e) {
      console.log('[rpSearchSdienavCtrl] toggleSearchOpen()');
      $scope.isSearchOpen = !$scope.isSearchOpen;
    };

    deregisterSearchFormVisibility = $rootScope.$on('rp_search_form_visibility', function (e, isSearchOpen) {
      $scope.isSearchOpen = isSearchOpen;
    });

    $scope.$on('$destroy', function () {
      deregisterSearchFormVisibility();
    });
  }

  angular.module('rpSearch')
    .controller('rpSearchSidenavCtrl', [
      '$scope',
      '$rootScope',
      'rpSearchFormService',
      rpSearchSidenavCtrl
    ]);
}());
