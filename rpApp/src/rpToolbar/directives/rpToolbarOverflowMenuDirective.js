(function () {
  'use strict';


  function rpToolbarOverflowMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpToolbar/views/rpToolbarOverflowMenu.html',
      link: function (scope, element, attributes) {
        console.log('[rpToolbarOverflowMenu] link()');

        element.find('.md-icon-button')
          .removeClass('md-icon-button');

        console.log('[rpToolbarOverflowMenu] link() element.find(\'.md-icon-button\').size(): ' + element.find('.md-icon-button')
          .size());
      }
    };
  }

  angular.module('rpToolbar')
    .directive('rpToolbarOverflowMenu', [rpToolbarOverflowMenu]);
}());
