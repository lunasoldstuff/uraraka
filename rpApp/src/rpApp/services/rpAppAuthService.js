(function () {
  'use strict';

  function rpAppAuthService($rootScope, rpSettingsService) {
    return {
      isAuthenticated: false,

      setIdentity(identity) {
        rpAppAuthService.identity = identity;
      },

      setAuthenticated(authenticated) {
        rpAppAuthService.isAuthenticated = authenticated === 'true';
        $rootScope.$emit('authenticated');
      }
    };
  }

  angular.module('rpApp')
    .factory('rpAppAuthService', [
      '$rootScope',
      'rpSettingsService',
      rpAppAuthService
    ]);
}());
