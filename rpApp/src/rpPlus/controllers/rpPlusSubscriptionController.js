(function () {
  'use strict';

  function rpPlusSubscriptionCtrl(
    $scope,
    $rootScope,
    moment,
    rpPlusSubscriptionService

  ) {
    var deregisterPlusSubscriptionUpdate;
    console.log('[rpPlusSubscriptionCtrl]');

    function getBillingAgreement() {
      rpPlusSubscriptionService.getBillingAgreement(function (data) {
        $scope.billingAgreement = data;
        if (data) {
          $scope.currentPeriodStart = moment(new Date($scope.billingAgreement.start_date))
            .format('Do MMMM, YYYY');
          $scope.currentPeriodEnd = moment(new Date($scope.billingAgreement.agreement_details.next_billing_date))
            .format('Do MMMM, YYYY');
        }
      });
    }

    $scope.billingAgreement = null;
    $scope.showCancelConfirmation = false;
    $scope.cancelling = false;

    $scope.toggleCancelConfirmation = function (e) {
      $scope.showCancelConfirmation = !$scope.showCancelConfirmation;
    };

    $scope.cancelSubscription = function (e) {
      $scope.cancelling = true;
      console.log('[rpPlusSubscriptionCtrl] cancelSubscription()');
      rpPlusSubscriptionService.cancel(function (error) {
        if (error) {
          console.log('[rpPlusSubscriptionCtrl] cancelSubscription(), error cancelling subscription');
        } else {
          console.log('[rpPlusSubscriptionCtrl] cancelSubscription(), subscription canceled');
        }
        $scope.cancelling = false;
      });
    };

    deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function (e, isSubscribed) {
      getBillingAgreement();
    });

    getBillingAgreement();

    $scope.$on('$destroy', function () {
      deregisterPlusSubscriptionUpdate();
    });
  }

  angular.module('rpPlus')
    .controller('rpPlusSubscriptionCtrl', [
      '$scope',
      '$rootScope',
      'moment',
      'rpPlusSubscriptionService',
      rpPlusSubscriptionCtrl
    ]);
}());
