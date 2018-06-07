(function () {
  'use strict';

  function video($rootScope, $timeout) {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        console.log('[video] link');
        element.on('canplay', function () {
          element.removeClass('landscape');
          element.removeClass('portrait');
          element.removeClass('square');

          $timeout(function () {
            var width = parseInt(element.width(), 10);
            var height = parseInt(element.height(), 10);

            element.show();

            console.log('[video] link(), width: ' + width + ', height: ' + height);

            if (width === height) {
              element.addClass('square');
            } else if (width > height) {
              element.addClass('landscape');
            } else {
              element.addClass('portrait');
            }
          }, 0);
        });

        element.on('play', function () {
          console.log('[rpAppVideoDirective] play');
          $rootScope.$emit('rp_slideshow_video_start');
        });

        element.on('timeupdate', function () {
          if (element.prop('currentTime') > element.prop('duration') - 0.5) {
            $rootScope.$emit('rp_slideshow_video_end');
            element.off('timeupdate');
          }
        });
      }
    };
  }

  angular.module('rpApp').directive('video', ['$rootScope', '$timeout', video]);
}());
