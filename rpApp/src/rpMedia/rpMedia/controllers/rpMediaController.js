(function () {
  'use strict';

  function rpMediaCtrl(
    $scope,
    $timeout,
    $rootScope,
    rpSettingsService
  ) {
    var deregisterSettingsChanged;

    function calcWarning() {
      if ($scope.nsfwOverride === true) {
        return false;
      }

      if (rpSettingsService.settings.over18) {
        if ($scope.post) {
          if ($scope.post.data.title.toLowerCase()
            .indexOf('nsfw') > 0) {
            $scope.showWarning = true;
            $scope.warningText = 'nsfw';
          }

          if ($scope.post.data.title.toLowerCase()
            .indexOf('nsfl') > 0) {
            $scope.showWarning = true;
            $scope.warningText = 'nsfl';
          }

          if ($scope.post.data.title.toLowerCase()
            .indexOf('gore') > 0) {
            $scope.showWarning = true;
            $scope.warningText = 'gore';
          }

          if (!$scope.warningText && $scope.post.data.link_flair_text) {
            $scope.warningText = $scope.post.data.link_flair_text;
          }

          if ($scope.post.data.over_18) {
            $scope.showWarning = true;

            $scope.showWarning = rpSettingsService.settings.over18;

            if (!$scope.warningText) {
              $scope.warningText = 'over 18';
            }
          }
        }
      } else {
        $scope.showWarning = false;
      }
      return null;
    }

    $scope.showMedia = function () {
      $scope.showWarning = false;
    };

    if (angular.isDefined($scope.post)) {
      console.log('[rpMediaCtrl] post.data.id: ' + $scope.post.data.id);
    }
    calcWarning();

    deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
      calcWarning();
    });

    $scope.$on('$destroy', function () {
      deregisterSettingsChanged();
    });
  }

  angular.module('rpMedia')
    .controller('rpMediaCtrl', [
      '$scope',
      '$timeout',
      '$rootScope',
      'rpSettingsService',
      rpMediaCtrl
    ]);
}());
