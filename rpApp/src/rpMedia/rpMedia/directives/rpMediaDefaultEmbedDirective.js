(function () {
  'use strict';

  function rpMediaDefaultEmbed($compile) {
    return {
      restrict: 'E',
      scope: {
        oembed: '='

      },
      compile: function (scope, elem) {
        console.log('[rpMediaDefaultEmbed] compile function, scope.oembed: ' + scope.oembed);
        console.log('[rpMediaDefaultEmbed] compile function, scope.post.data.media.oembed.html: ' + scope.post.data
          .media.oembed.html);
      },
      link: function (scope) {
        console.log('[rpMediaDefaultEmbed] link, scope.oembed: ' + scope.oembed);
      }
    };
  }

  angular.module('rpMedia')
    .directive('rpMediaDefaultEmbed', [
      '$compile',
      rpMediaDefaultEmbed
    ]);
}());
