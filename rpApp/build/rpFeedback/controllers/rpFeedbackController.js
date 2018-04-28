'use strict';

(function () {
  'use strict';

  angular.module('rpFeedback').controller('rpFeedbackCtrl', ['$scope', '$rootScope', 'rpAppTitleChangeService', 'rpToolbarButtonVisibilityService', rpFeedbackCtrl]);

  function rpFeedbackCtrl($scope, $rootScope, rpAppTitleChangeService, rpToolbarButtonVisibilityService) {
    console.log('[rpFeedbackCtrl] load');

    if (!$scope.isDialog) {
      rpToolbarButtonVisibilityService.hideAll();
      $rootScope.$emit('rp_tabs_hide');
      rpAppTitleChangeService('send feedback', true, true);
    }

    $scope.isFeedback = true;

    $scope.formatting = false;
    $scope.toggleFormatting = function () {
      $scope.formatting = !$scope.formatting;
    };
  }
})();