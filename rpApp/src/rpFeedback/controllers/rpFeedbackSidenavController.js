(function () {
  'use strict';

  function rpFeedbackSidenavCtrl(
    $scope,
    $mdDialog,
    rpSettingsService,
    rpAppLocationService,
    rpAppAuthService,
    rpToastService,
    rpAppIsMobileViewService
  ) {
    console.log('[rpFeedbackSidenavCtrl] load');

    $scope.showFeedback = function (e) {
      console.log('[rpFeedbackSidenavCtrl] showFeedback()');
      // if (rpAppAuthService.isAuthenticated) {

      if ((rpSettingsService.getSetting('submitDialog') && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
        $mdDialog.show({
          controller: 'rpFeedbackDialogCtrl',
          templateUrl: 'rpFeedback/views/rpFeedbackDialog.html',
          targetEvent: e,
          clickOutsideToClose: false,
          escapeToClose: false
        });
      } else {
        rpAppLocationService(e, '/feedback', '', true, false);
      }
    };
  }

  angular.module('rpFeedback')
    .controller('rpFeedbackSidenavCtrl', [
      '$scope',
      '$mdDialog',
      'rpSettingsService',
      'rpAppLocationService',
      'rpAppAuthService',
      'rpToastService',
      'rpAppIsMobileViewService',
      rpFeedbackSidenavCtrl
    ]);
}());
