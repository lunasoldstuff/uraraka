(function () {
  'use strict';

  function rpSidenavContent(
    $templateCache,
    $timeout,
    $mdMedia
  ) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'rpSidenav/views/rpSidenavContent.html',
      link: function (scope, elem, attrs) {
        let blockFirst = false;

        $timeout(function () {
          scope.showSidenav = $mdMedia('gt-md');
        }, 0);
        scope.$watch(function () {
          return $mdMedia('gt-md');
        }, function (showSidenav) {
          console.log(`[rpSidenavContent] link() watcher, showSidenav: ${showSidenav}`);

          if (blockFirst) {
            $timeout(function () {
              // used for the animation, if we use ng-if social buttons won't reload after show/hide
              scope.showSidenav = showSidenav;
            }, 0);
          } else {
            blockFirst = true;
            // used for the ng-if, otherwise sidenav appears breifly before animating in.
            scope.sidenav = true;
          }
        });
      }
    };
  }

  angular.module('rpSidenav')
    .directive('rpSidenavContent', [
      '$templateCache',
      '$timeout',
      '$mdMedia',
      rpSidenavContent
    ]);
}());
