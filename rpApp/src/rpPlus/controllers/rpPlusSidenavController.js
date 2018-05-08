(function () {
  'use strict';

  function rpPlusSidenavCtrl(
    $scope,
    $rootScope,
    $mdDialog,
    rpSettingsService,
    rpAppLocationService,
    rpAppIsMobileViewService,
    rpPlusSubscriptionService

  ) {
    var deregisterPlusSubscriptionUpdate;
    console.log('[rpPlusSidenavCtrl] load');

    function checkSubscription() {
      rpPlusSubscriptionService.isSubscribed(function (isSubscribed) {
        $scope.isSubscribed = isSubscribed;
      });
    }

    $scope.showPlus = function (e) {
      if ((rpSettingsService.getSetting('settingsDialog') && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
        $mdDialog.show({
          controller: 'rpSettingsDialogCtrl',
          templateUrl: 'rpSettings/views/rpSettingsDialog.html',
          clickOutsideToClose: true,
          escapeToClose: true

        });
      } else {
        rpAppLocationService(e, '/settings', 'selected=1', true, false);
      }
    };

    deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function (e, isSubscribed) {
      $scope.isSubscribed = isSubscribed;
    });

    checkSubscription();

    $scope.$on('$destroy', function () {
      deregisterPlusSubscriptionUpdate();
    });
  }

  angular.module('rpPlus')
    .controller('rpPlusSidenavCtrl', ['$scope',
      '$rootScope',
      '$mdDialog',
      'rpSettingsService',
      'rpAppLocationService',
      'rpAppIsMobileViewService',
      'rpPlusSubscriptionService',
      rpPlusSidenavCtrl
    ]);
}());
