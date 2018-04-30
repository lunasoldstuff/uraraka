(function () {
  'use strict';

  function rpIdentityService(rpAppAuthService, rpAppRedditApiService) {
    var callbacks = [];
    var gettingIdentity = false;

    return {
      identity: null,

      reloadIdentity(callback) {
        rpIdentityService.identity = null;
        rpIdentityService.getIdentity(callback);
      },

      getIdentity(callback) {
        console.log('[rpIdentityService] getIdentity()');

        if (rpAppAuthService.isAuthenticated) {
          if (rpIdentityService.identity !== null) {
            console.log('[rpIdentityService] getIdentity(), have identity');
            callback(rpIdentityService.identity);
          } else {
            callbacks.push(callback);

            if (gettingIdentity === false) {
              gettingIdentity = true;

              console.log('[rpIdentityService] getIdentity(), requesting identity');

              rpAppRedditApiService.redditRequest('get', '/api/v1/me', {

              }, function (data) {
                rpIdentityService.identity = data;
                gettingIdentity = false;

                for (let i = 0; i < callbacks.length; i++) {
                  callbacks[i](rpIdentityService.identity);
                }

                callbacks = [];
              });
            }
          }
        } else {
          callback(null);
        }
      }

    };
  }

  angular.module('rpApp')
    .factory('rpIdentityService', [
      'rpAppAuthService',
      'rpAppRedditApiService',
      rpIdentityService
    ]);
}());
