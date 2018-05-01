(function () {
  'use strict';

  function rpPlusCtrl(
    $scope,
    $rootScope,
    $timeout,
    $mdDialog,
    $mdBottomSheet,
    rpPlusSubscriptionService,
    rpAppAuthService
  ) {
    var deregisterPlusSubscriptionUpdate;
    console.log('[rpPlusCtrl]');

    $scope.isAuthenticated = rpAppAuthService.isAuthenticated;

    deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function (e, isSubscribed) {
      $scope.isSubscribed = isSubscribed;
    });

    function checkSubscription() {
      rpPlusSubscriptionService.isSubscribed(function (isSubscribed) {
        $scope.isSubscribed = isSubscribed;
      });
    }

    $scope.toggleShowForm = function (e) {
      console.log('[rpPlusCtrl] showForm()');
      $scope.showForm = !$scope.showForm;
    };

    $scope.closeDialog = function (e) {
      $mdDialog.hide();
      $mdBottomSheet.hide();
    };

    $scope.subscribing = false;
    $scope.subscribe = function () {
      $timeout(function () {
        $scope.subscribing = true;
        rpPlusSubscriptionService.subscribe();
      }, 0);
    };

    $scope.$on('$destroy', function () {
      deregisterPlusSubscriptionUpdate();
    });

    checkSubscription();
  }

  angular.module('rpPlus')
    .controller('rpPlusCtrl', ['$scope',
      '$rootScope',
      '$timeout',
      '$mdDialog',
      '$mdBottomSheet',
      'rpPlusSubscriptionService',
      'rpAppAuthService',
      rpPlusCtrl
    ]);
}());
