(function () {
  'use strict';

  function rpSlideshowButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpSlideshow/views/rpSlideshowButton.html',
      controller: 'rpSlideshowButtonCtrl',
      link: function (scope, elem, attrs) {
        console.log('[rpSlideshowButton] link()');
        if ('rpToolbarOverflowMenu' in attrs) {
          elem.find('.md-icon-button')
            .removeClass('md-icon-button');
        }
      }
    };
  }

  angular.module('rpSlideshow')
    .directive('rpSlideshowButton', [rpSlideshowButton]);
}());
