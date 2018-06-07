(function () {
  'use strict';


  function img($timeout) {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        var width = parseInt(element.width());
        var height = parseInt(element.height());
        console.log('[img] link');
        element.on('load', function () {
          element.removeClass('landscape');
          element.removeClass('portrait');
          element.removeClass('square');

          $timeout(function () {
            element.show();
            console.log('[img] link(), width: ' + width + ', height: ' + height);

            if (width === height) {
              element.addClass('square');
            } else if (width > height) {
              element.addClass('landscape');
            } else {
              element.addClass('portrait');
            }
          }, 0);
        });
      }
    };
  }

  angular.module('rpApp')
    .directive('img', [
      '$timeout',
      img
    ]);
}());
