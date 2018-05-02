(function () {
  'use strict';

  function rpPlusSubscriptionService(
    $rootScope,
    $window,
    rpAppAuthService,
    rpPlusPaypalCreateBillingAgreeement,
    rpPlusPaypalBillingAgreeement,
    rpPlusPaypalCancelBillingAgreeement,
    rpPlusPaypalUpdateBillingAgreeement,
    rpToastService,
    rpSettingsService

  ) {
    var callbacks = [];
    var gettingBillingAgreement = false;

    var plusSubscriptionService = {
      billingAgreement: null,
      isSubscribed(callback) {
        callback(true);
      },
      // Reenable if we want to restore subscription scheme.
      // isSubscribed(callback) {
      // rpPlusSubscriptionService.getBillingAgreement(function(data) {
      // console.log('[rpPlusSubscriptionService] isSubscribed(), billingAgreement: ' + rpPlusSubscriptionService.billingAgreement);
      // callback(!!rpPlusSubscriptionService.billingAgreement);
      // });
      // },
      getBillingAgreement(callback) {
        console.log('[rpPlusSubscriptionService] getBillingAgreement()');

        if (rpAppAuthService.isAuthenticated) {
          if (this.billingAgreement !== null) {
            callback(this.billingAgreement);
          } else {
            callbacks.push(callback);
            gettingBillingAgreement = true;

            rpPlusPaypalBillingAgreeement.get({}, function (data) {
              console.log('[rpPlusSubscriptionService] getBillingAgreement(), data: ' + JSON.stringify(data));
              if (data.error) {
                console.log('[rpPlusSubscriptionService] error retrieving subscription from server');
              } else {
                gettingBillingAgreement = false;
                plusSubscriptionService.updateBillingAgreement(data.billingAgreement);

                for (let i = 0; i < callbacks.length; i++) {
                  callbacks[i](data.billingAgreement);
                }

                callbacks = [];
              }
            });
          }
        } else {
          callback(null);
        }
      },
      subscribe(email, token, callback) {
        console.log('[rpPlusSubscriptionService] subscribe()');

        rpPlusPaypalCreateBillingAgreeement.get(function (data) {
          for (let i = 0; i < data.links.length; i++) {
            if (data.links[i].rel === 'approval_url') {
              // redirect
              $window.open(data.links[i].href, '_self');
              break;
            }
          }
        });
      },
      cancel(callback) {
        rpPlusPaypalCancelBillingAgreeement.get({}, function (data) {
          if (data.error) {
            console.log('[rpPlusSubscriptionService] cancel(), data.error: ' + JSON.stringify(data.error));
            callback(data.error);
          } else {
            console.log('[rpPlusSubscriptionService] cancel(), subscription cancelled, data: ' + JSON.stringify(data));
            rpToastService('subscription cancelled', 'sentiment_dissatisfied');
            plusSubscriptionService.updateBillingAgreement(null);

            callback();
          }
        }, function (error) {
          rpToastService('something went wrong cancelling your subscription', 'sentiment_dissatisfied');
          console.log('[rpPlusSubscriptionService] cancel(), error: ' + JSON.stringify(error));
          callback(error);
        });
      },
      updateBillingAgreement(billingAgreement) {
        this.billingAgreement = billingAgreement;
        $rootScope.$emit('rp_plus_subscription_update', !!this.billingAgreement);
      }
    };

    console.log('[rpPlusSubscriptionService]');
    return plusSubscriptionService;
  }

  angular.module('rpPlus')
    .factory('rpPlusSubscriptionService', [
      '$rootScope',
      '$window',
      'rpAppAuthService',
      'rpPlusPaypalCreateBillingAgreeement',
      'rpPlusPaypalBillingAgreeement',
      'rpPlusPaypalCancelBillingAgreeement',
      'rpPlusPaypalUpdateBillingAgreeement',
      'rpToastService',
      'rpSettingsService',
      rpPlusSubscriptionService
    ]);
}());
