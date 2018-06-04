(function () {
  'use strict';

  function rpAppTitleService() {
    let titleChangeService = {
      titles: {
        page: 'reddup',
        toolbar: ''
      },
      getTitles() {
        return titleChangeService.titles;
      },
      changePageTitle(newTitle) {
        if (newTitle === 'frontpage') {
          titleChangeService.titles.page = 'reddup';
        } else {
          titleChangeService.titles.page = 'reddup: ' + newTitle;
        }
      },
      changeToolbarTitle(newTitle) {
        titleChangeService.titles.toolbar = newTitle;
      },
      changeTitles(newTitle) {
        titleChangeService.changePageTitle(newTitle);
        titleChangeService.changeToolbarTitle(newTitle);
      }
    };

    return titleChangeService;
  }

  angular
    .module('rpSlideshow')
    .factory('rpSlideshowActiveService', [rpSlideshowActiveService]);
}());
