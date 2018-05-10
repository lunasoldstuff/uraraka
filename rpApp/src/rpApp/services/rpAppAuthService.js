(function () {
  'use strict';

  function rpAppAuthService($rootScope, rpSettingsService) {
    var appAuthService = {
      isAuthenticated: false,

      setIdentity(identity) {
        appAuthService.identity = identity;
      },

      setAuthenticated(isAuthenticated) {
        console.log(`[rpAppAuthService()] setAuthenticated(), isAuthenticated: ${isAuthenticated}`);
        appAuthService.isAuthenticated = isAuthenticated === 'true';
      }
    };

    return appAuthService;
  }

  angular.module('rpApp')
    .factory('rpAppAuthService', [
      '$rootScope',
      'rpSettingsService',
      rpAppAuthService
    ]);
}());
