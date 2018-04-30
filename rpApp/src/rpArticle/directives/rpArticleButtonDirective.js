(function () {
  'use strict';

  function rpArticleButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpArticle/views/rpArticleButton.html',
      controller: 'rpArticleButtonCtrl',
      scope: {
        parentCtrl: '=',
        post: '=',
        isComment: '=',
        message: '='
      }
    };
  }

  angular.module('rpArticle')
    .directive('rpArticleButton', rpArticleButton);
}());
