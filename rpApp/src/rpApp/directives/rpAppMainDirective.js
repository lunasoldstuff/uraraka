(function () {
  'use strict';

  function rpAppMain($animate) {
    return {
      restrict: 'C',
      link: function (scope, element, attrs) {
        $animate.on('enter', element[0], function callback(animationElement, phase) {
          if (animationElement.hasClass('rp-app-main')) {
            console.log('[rpAppMain] .rp-app-main animation');
            console.log('[rpAppMain] animate enter listener, phase: ' + phase);
            if (phase === 'close') {
              console.log('[rpAppMain] broadcast md-resize-textarea...');
              scope.$broadcast('md-resize-textarea');
            }
          }
        });
      }
    };
  }

  angular.module('rpApp')
    .directive('rpAppMain', [
      '$animate',
      rpAppMain
    ]);
}());
