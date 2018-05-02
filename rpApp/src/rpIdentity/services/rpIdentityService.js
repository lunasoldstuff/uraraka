(function () {
  'use strict';

  function rpIdentityService(rpAppAuthService, rpAppRedditApiService) {
    var callbacks = [];
    var gettingIdentity = false;

    var identitiyService = {
      identity: null,

      reloadIdentity(callback) {
        rpIdentityService.identity = null;
        rpIdentityService.getIdentity(callback);
      },

      getIdentity(callback) {
        console.log('[rpIdentityService] getIdentity()');

        if (rpAppAuthService.isAuthenticated) {
          if (this.identity !== null) {
            console.log('[rpIdentityService] getIdentity(), have identity');
            callback(this.identity);
          } else {
            callbacks.push(callback);

            if (gettingIdentity === false) {
              gettingIdentity = true;

              console.log('[rpIdentityService] getIdentity(), requesting identity');

              rpAppRedditApiService.redditRequest('get', '/api/v1/me', {

              }, (data) => {
                identitiyService.identity = data;
                gettingIdentity = false;

                for (let i = 0; i < callbacks.length; i++) {
                  callbacks[i](identitiyService.identity);
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

    return identitiyService;
  }

  angular.module('rpApp')
    .factory('rpIdentityService', [
      'rpAppAuthService',
      'rpAppRedditApiService',
      rpIdentityService
    ]);
}());
