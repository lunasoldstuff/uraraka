(function () {
  'use strict';

  function rpAppCleanTitleFilter() {
    return function (text) {
      return angular.isDefined(text) ? text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/gi, ' ') :
        text;
    };
  }

  angular.module('rpApp')
    .filter('rpAppCleanTitleFilter', [rpAppCleanTitleFilter]);
}());
