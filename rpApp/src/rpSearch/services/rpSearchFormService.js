(function () {
  'use strict';


  function rpSearchFormService($rootScope, rpToolbarButtonVisibilityService) {
    var deregisterHideAllButtons = $rootScope.$on('rp_hide_all_buttons', function () {
      rpSearchFormService.hide();
    });

    return {
      isVisible: false,
      show() {
        this.isVisible = true;
        $rootScope.$emit('rp_search_form_visibility', true);
      },
      hide() {
        this.isVisible = false;
        $rootScope.$emit('rp_search_form_visibility', false);
      }

    };
  }

  angular
    .module('rpSearch')
    .factory('rpSearchFormService', [
      '$rootScope',
      'rpToolbarButtonVisibilityService',
      rpSearchFormService
    ]);
}());
