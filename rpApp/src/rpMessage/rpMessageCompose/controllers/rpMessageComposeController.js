(function () {
  'use strict';

  function rpMessageComposeCtrl(
    $scope,
    $rootScope,
    $mdDialog,
    $routeParams,
    rpAppLocationService,
    rpSubredditsService,
    rpAppTitleService,
    rpToolbarButtonVisibilityService
  ) {
    console.log('[rpMessageCompose] $scope.dialog: ' + $scope.dialog);
    console.log('[rpMessageCompose] $routeParams.shareTitle: ' + $routeParams.shareTitle);
    console.log('[rpMessageCompose] $routeParams.shareLink: ' + $routeParams.shareLink);

    $scope.formatting = false;

    if ($routeParams.shareTitle) {
      $scope.shareTitle = $routeParams.shareTitle;
    }

    if ($routeParams.shareLink) {
      $scope.shareLink = $routeParams.shareLink;
    }

    if (!$scope.dialog) {
      rpToolbarButtonVisibilityService.hideAll();
    }

    $scope.title =
      angular.isDefined($scope.shareLink) && $scope.shareLink !== null ?
        'share a link with a reddit user' :
        'send a message';

    if (!$scope.dialog) {
      rpAppTitleService.changeTitles($scope.title);
    }

    $scope.toggleFormatting = function () {
      $scope.formatting = !$scope.formatting;
    };
  }

  angular
    .module('rpMessageCompose')
    .controller('rpMessageComposeCtrl', [
      '$scope',
      '$rootScope',
      '$mdDialog',
      '$routeParams',
      'rpAppLocationService',
      'rpSubredditsService',
      'rpAppTitleService',
      'rpToolbarButtonVisibilityService',
      rpMessageComposeCtrl
    ]);
}());
