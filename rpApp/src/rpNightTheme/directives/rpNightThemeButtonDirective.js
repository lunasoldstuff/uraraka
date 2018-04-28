(function () {
  'use strict';

  function rpNightThemeButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpNightTheme/views/rpNightThemeButton.html',
      controller: 'rpNightThemeButtonCtrl',
      link: function (scope, elem, attrs) {
        console.log('[rpMightThemeButton] link()');
        if ('rpToolbarOverflowMenu' in attrs) {
          elem.find('.md-icon-button').removeClass('md-icon-button');
        }
      }
    };
  }

  angular.module('rpNightTheme').directive('rpNightThemeButton', [rpNightThemeButton]);
}());
