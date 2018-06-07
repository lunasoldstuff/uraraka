(function () {
  'use strict';

  function rpMessageComment(
    $compile,
    $rootScope,
    $templateCache,
    RecursionHelper
  ) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        message: '=',
        depth: '='
      },
      template: $templateCache.get('rpMessage/rpMessage/views/rpMessageComment.html'),
      compile: function (element) {
        return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {

        });
      },
      controller: 'rpMessageCommentCtrl'
    };
  }

  angular.module('rpMessage')
    .directive('rpMessageComment', ['$compile',
      '$rootScope',
      '$templateCache',
      'RecursionHelper',
      rpMessageComment
    ]);
}());
