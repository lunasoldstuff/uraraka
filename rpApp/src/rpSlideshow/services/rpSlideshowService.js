(function () {
  'use strict';

  function rpSlideshowService() {
    let slideshowService = {
      settings: {
        isActive: false
      },

      getSettings() {
        return slideshowService.settings;
      },

      isActive() {
        return slideshowService.settings.isActive;
      },

      startSlideshow() {
        slideshowService.settings.isActive = true;
      },

      endSlideshow() {
        slideshowService.settings.isActive = false;
      }
    };

    return slideshowService;
  }

  angular
    .module('rpSlideshow')
    .factory('rpSlideshowService', [rpSlideshowService]);
}());
