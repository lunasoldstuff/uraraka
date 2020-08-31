(function () {
  'use strict';

  function rpAppTitleService() {
    let titleChangeService = {
      titles: {
        page: 'Uraraka',
        toolbar: ''
      },
      getTitles() {
        return titleChangeService.titles;
      },
      changePageTitle(newTitle) {
        if (newTitle === 'frontpage') {
          titleChangeService.titles.page = 'Uraraka';
        } else {
          titleChangeService.titles.page = 'Uraraka: ' + newTitle;
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

  angular.module('rpApp')
    .factory('rpAppTitleService', [
      rpAppTitleService
    ]);
}());
