(function () {
  'use strict';

  function rpAppAuthService($rootScope, rpSettingsService) {
    var appAuthService = {
      isAuthenticated: false,

      setIdentity(identity) {
        this.identity = identity;
      },

      setAuthenticated(authenticated) {
        this.isAuthenticated = authenticated === 'true';
        $rootScope.$emit('authenticated');
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
