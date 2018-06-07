(function () {
  'use strict';

  function rpProgressService() {
    let progressService = {
      isVisible: false,
      showProgress() {
        progressService.isVisible = true;
      },
      hideProgress() {
        progressService.isVisible = false;
      }
    };

    return progressService;
  }

  angular
    .module('rpProgress')
    .factory('rpProgressService', [rpProgressService]);
}());
