(function () {
  'use strict';

  function rpShareEmailCtrl(
    $scope,
    $rootScope,
    $routeParams,
    rpIdentityService,
    rpAppTitleService,
    rpToolbarButtonVisibilityService
  ) {
    console.log('[rpShareCtrl]');

    rpIdentityService.getIdentity(function (identity) {
      console.log('[rpShareEmailCtrl] identity: ' + JSON.stringify(identity));
      $scope.identity = identity;

      if ($routeParams.shareTitle) {
        $scope.shareTitle = $routeParams.shareTitle;
      }

      if ($routeParams.shareLink) {
        $scope.shareLink = $routeParams.shareLink;
      }

      if (!$scope.dialog) {
        rpToolbarButtonVisibilityService.hideAll();
      }

      if (!$scope.dialog) {
        rpAppTitleService.changeTitles('share via email');
      }
    });
  }

  angular
    .module('rpShare')
    .controller('rpShareEmailCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      'rpIdentityService',
      'rpAppTitleService',
      'rpToolbarButtonVisibilityService',
      rpShareEmailCtrl
    ]);
}());
