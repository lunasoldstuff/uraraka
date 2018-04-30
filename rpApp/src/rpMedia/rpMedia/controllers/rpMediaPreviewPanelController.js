(function () {
  'use strict';

  function rpMediaPreviewPanelCtrl($scope, mdPanelRef, rpSettingsService, post) {
    $scope.post = post;
    $scope.theme = rpSettingsService.settings.theme;
    console.log('[rpMediaPreviewPanelCtrl] $scope.theme: ' + $scope.theme);

    $scope.close = function (e) {
      console.log('[rpMediaImagePanelCtrl] close()');
      mdPanelRef.close()
        .then(function () {
          mdPanelRef.destroy();
        });
    };
  }

  angular.module('rpMedia')
    .controller('rpMediaPreviewPanelCtrl', [
      '$scope',
      'mdPanelRef',
      'rpSettingsService',
      'post',
      rpMediaPreviewPanelCtrl
    ]);
}());
