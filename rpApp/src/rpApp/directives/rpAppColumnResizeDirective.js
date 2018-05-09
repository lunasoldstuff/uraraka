(function () {
  'use strict';

  function rpAppColumnResize(
    $rootScope,
    $window,
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
          console.log('[rpAppColumnResize] isFullscreen(): ' + ($window.innerWidth === screen.width && $window.innerHeight ===
            screen.height));
          return $window.innerWidth === screen.width && $window.innerHeight === screen.height;
        }

        mediaCheck.init({
          scope: scope,
          media: [{
            mq: '(max-width: 759px)',
            enter: function (mq) {
              if (!isFullscreen()) {
                scope.columns = [1];
                emitWindowResize(1);
              }
            }
          }, {
            mq: '(min-width: 760px) and (max-width: 1279px)',
            enter: function (mq) {
              if (!isFullscreen()) {
                scope.columns = [1, 2];
                emitWindowResize(2);
              }
            }
          }, {
            mq: '(min-width: 1280px) and (max-width: 1659px)',
            enter: function (mq) {
              if (!isFullscreen()) {
                scope.columns = [1, 2, 3];
                emitWindowResize(3);
              }
            }
          }, {
            mq: '(min-width: 1660px)',
            enter: function (mq) {
              if (!isFullscreen()) {
                scope.columns = [1, 2, 3, 4];
                emitWindowResize(4);
              }
            }
          }]
        });
      }
    };
  }

  angular.module('rpApp')
    .directive('rpAppColumnResize', [
      '$rootScope',
      '$window',
      'debounce',
      'mediaCheck',
      rpAppColumnResize
    ]);
}());
