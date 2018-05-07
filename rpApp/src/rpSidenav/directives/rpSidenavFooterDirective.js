(function () {
  'use strict';


  function rpSidenavFooter($rootScope) {
    return {
      restrict: 'C',
      link: function (scope, element, attrs) {
        var step = 16;

        var deregisterScrollUp;
        var deregisterScrollDown;
        var deregisterTabsShow;
        var deregisterTabsHide;

        function stepDown() {
          if (parseInt(element.css('margin-bottom'), 10) < 48) {
            element.css('margin-bottom', '+=' + step);
          }
        }

        function stepUp() {
          if (parseInt(element.css('margin-bottom'), 10) !== 0) {
            element.css('margin-bottom', '-=' + step);
          }
        }

        function moveDown() {
          if (parseInt(element.css('margin-bottom'), 10) < 48) {
            element.css('margin-bottom', 48);
          }
        }

        function moveUp() {
          if (parseInt(element.css('margin-bottom'), 10) !== 0) {
            element.css('margin-bottom', 0);
          }
        }

        deregisterScrollUp = $rootScope.$on('scroll_up', function () {
          console.log('[rpSidenavFooter] onScrollUp()');
          stepDown();
        });

        deregisterScrollDown = $rootScope.$on('scroll_down', function () {
          stepUp();
        });

        scope.$on('$destroy', function () {
          deregisterScrollUp();
          deregisterScrollDown();
        });
      }
    };
  }

  angular.module('rpSidenav')
    .directive('rpSidenavFooter', [
      '$rootScope',
      rpSidenavFooter
    ]);
}());
