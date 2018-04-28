(function () {
  'use strict';

  angular
    .module('rpSearch')
    .factory('rpSearchFormService', [
      '$rootScope',
      'rpToolbarButtonVisibilityService',
      rpSearchFormService
    ]);

  function rpSearchFormService($rootScope, rpToolbarButtonVisibilityService) {
    var rpSearchFormService = {};

    rpSearchFormService.isVisible = false;

    rpSearchFormService.show = function () {
      rpSearchFormService.isVisible = true;
      $rootScope.$emit('rp_search_form_visibility', true);
    };

    rpSearchFormService.hide = function () {
      rpSearchFormService.isVisible = false;
      $rootScope.$emit('rp_search_form_visibility', false);
    };

    var deregisterHideAllButtons = $rootScope.$on('rp_hide_all_buttons', function () {
      rpSearchFormService.hide();
    });

    return rpSearchFormService;
  }
}());
