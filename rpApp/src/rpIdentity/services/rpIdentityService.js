(function () {
  'use strict';

  function rpIdentityService(rpAppAuthService, rpAppRedditApiService) {
    var rpIdentityService = {};
    var callbacks = [];
    var gettingIdentity = false;

    rpIdentityService.identity = null;

    rpIdentityService.reloadIdentity = function (callback) {
      rpIdentityService.identity = null;
      rpIdentityService.getIdentity(callback);
    };

    rpIdentityService.getIdentity = function (callback) {
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

              for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](rpIdentityService.identity);
              }

              callbacks = [];
            });
          }
        }
      } else {
        callback(null);
      }
    };

    return rpIdentityService;
  }

  angular.module('rpApp')
    .factory('rpIdentityService', [
      'rpAppAuthService',
      'rpAppRedditApiService',
      rpIdentityService
    ]);
}());
