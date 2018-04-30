(function () {
  'use strict';

  function rpAppAuthService($rootScope, rpSettingsService) {
    return {
      isAuthenticated: false,

      setIdentity(identity) {
        this.identity = identity;
      },

      setAuthenticated(authenticated) {
        this.isAuthenticated = authenticated === 'true';
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
