(function () {
  'use strict';

  function rpAppAuthService($rootScope, rpSettingsService) {
    var appAuthService = {
      isAuthenticated: false,

      setIdentity(identity) {
        appAuthService.identity = identity;
      },

      setAuthenticated(isAuthenticated) {
        appAuthService.isAuthenticated = isAuthenticated;
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
