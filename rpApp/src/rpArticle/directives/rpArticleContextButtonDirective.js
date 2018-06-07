(function () {
  'use strict';

  function rpArticleContextButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpArticle/views/rpArticleContextButton.html',
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
    .directive('rpArticleContextButton', rpArticleContextButton);
}());
