(function () {
  'use strict';

  function rpArticleContextButtonMenu() {
    return {
      restrict: 'E',
      templateUrl: 'rpArticle/views/rpArticleContextButtonMenu.html',
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
    .directive('rpArticleContextButtonMenu', rpArticleContextButtonMenu);
}());
