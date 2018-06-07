(function () {
  'use strict';

  function rpAppColumnResize(
    $rootScope,
    $window,
    $mdSidenav,
    debounce,
    mediaCheck
  ) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var emitWindowResize = function (cols) {
          $rootScope.$emit('rp_window_resize', cols);
        };

        function isFullscreen() {
          console.log('[rpAppColumnResize] isFullscreen(): ' +
              ($window.innerWidth === $window.screen.width &&
                $window.innerHeight === $window.screen.height));
          return (
            $window.innerWidth === $window.screen.width &&
            $window.innerHeight === $window.screen.height
          );
        }

        mediaCheck.init({
          scope: scope,
          media: [
            {
              mq: '(max-width: 759px)',
              enter: function (mq) {
                if (!isFullscreen()) {
                  scope.columns = [1];
                  emitWindowResize(1);
                }
              }
            },
            {
              mq: '(min-width: 760px) and (max-width: 1279px)',
              enter: function (mq) {
                if (!isFullscreen()) {
                  scope.columns = [1, 2];
                  emitWindowResize(2);
                }
              }
            },
            {
              mq: '(min-width: 1280px) and (max-width: 1659px)',
              enter: function (mq) {
                if (!isFullscreen()) {
                  $mdSidenav('left').close();
                  scope.columns = [1, 2, 3];
                  emitWindowResize(3);
                }
              }
            },
            {
              mq: '(min-width: 1660px)',
              enter: function (mq) {
                if (!isFullscreen()) {
                  scope.columns = [1, 2, 3, 4];
                  emitWindowResize(4);
                }
              }
            }
          ]
        });
      }
    };
  }

  angular
    .module('rpApp')
    .directive('rpAppColumnResize', [
      '$rootScope',
      '$window',
      '$mdSidenav',
      'debounce',
      'mediaCheck',
      rpAppColumnResize
    ]);
}());
