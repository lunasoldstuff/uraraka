(function () {
  'use strict';

  function rpResizeDrag(
    $rootScope,
    mediaCheck
  ) {
    return {
      restrict: 'C',
      link: function (scope, elem, attr) {
        console.log('[rpResizeDrag]');

        mediaCheck.init({
          scope: scope,
          media: [{
            mq: '(max-width: 600px)',
            enter: function (mq) {
              elem.removeClass('resize-drag');
            }

          }, {
            mq: '(min-width: 601px)',
            enter: function (mq) {
              elem.addClass('resize-drag');
            }
          }]
        });
      }
    };
  }

  angular.module('rpApp')
    .directive('rpResizeDrag', [
      '$rootScope',
      'mediaCheck',
      rpResizeDrag
    ]);
}());
