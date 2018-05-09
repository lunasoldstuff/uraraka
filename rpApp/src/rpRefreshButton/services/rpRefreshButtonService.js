(function () {
  'use strict';

  function rpRefreshButtonService($rootScope, rpSettingsResourceService, rpToastService) {
    let refreshButtonService = {
      isSpinning: false,
      startSpinning() {
        refreshButtonService.isSpinning = true;
      },
      stopSpinning() {
        refreshButtonService.isSpinning = false;
      }
    };

    return refreshButtonService;
  }

  angular
    .module('rpRefreshButton')
    .factory(
      'rpRefreshButtonService',
      rpRefreshButtonService
    );
}());
