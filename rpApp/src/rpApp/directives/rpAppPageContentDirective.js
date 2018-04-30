(function () {
  'use strict';

  // TODO: Scroll listeners should be debounced
  // TODO: is this stuff still necessary?

  function rpAppPageContent($rootScope) {
    return {
      restrict: 'C',
      link: function (scope, element, attrs) {
        var step = 16;
        var deregisterScrollUp;
        var deregisterScrollDown;

        function stepUp() {
          if (parseInt(element.css('top'), 10) < 0) {
            element.css('top', '+=' + step);
          }
        }

        function stepDown() {
          if (parseInt(element.css('top'), 10) > -48) {
            element.css('top', '-=' + step);
          }
        }

        function moveUp() {
          if (parseInt(element.css('top'), 10) < 0) {
            element.css('top', 0);
          }
        }

        function moveDown() {
          if (parseInt(element.css('top'), 10) > -48) {
            element.css('top', -48);
          }
        }

        deregisterScrollUp = $rootScope.$on('scroll_down', function () {
          stepDown();
        });

        deregisterScrollDown = $rootScope.$on('scroll_up', function () {
          stepUp();
        });

        scope.$on('$destroy', function () {
          deregisterScrollUp();
          deregisterScrollDown();
        });
      }
    };
  }

  angular.module('rpApp')
    .directive('rpAppPageContent', [
      '$rootScope',
      rpAppPageContent
    ]);
}());
