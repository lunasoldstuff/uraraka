(function () {
  'use strict';


  function rpArticleDialogCtrl(
    $scope,
    $rootScope,
    $location,
    $filter,
    $mdDialog,
    $mdBottomSheet,
    rpSettingsService,
    post,
    article,
    comment,
    subreddit
  ) {
    var deregisterLocationChangeSuccess;
    $scope.dialog = true;

    $scope.post = post;
    $scope.article = article;
    $scope.comment = comment;
    $scope.subreddit = subreddit;

    console.log('[rpArticleDialogCtrl]');
    console.log('[rpArticleDialogCtrl] $scope.article: ' + $scope.article);
    console.log('[rpArticleDialogCtrl] $scope.subreddit: ' + $scope.subreddit);
    console.log('[rpArticleDialogCtrl] $scope.comment: ' + $scope.comment);

    if (!angular.isUndefined($scope.post)) {
      console.log('[rpArticleDialogCtrl] $scope.post.data.title: ' + $scope.post.data.title);
    }

    // Close the dialog if user navigates to a new page.
    deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
      $mdDialog.hide();
      $mdBottomSheet.hide();
    });

    $scope.$on('destroy', function () {
      deregisterLocationChangeSuccess();
    });
  }

  angular.module('rpArticle')
    .controller('rpArticleDialogCtrl', [
      '$scope',
      '$rootScope',
      '$location',
      '$filter',
      '$mdDialog',
      '$mdBottomSheet',
      'rpSettingsService',
      'post',
      'article',
      'comment',
      'subreddit',
      rpArticleDialogCtrl
    ]);
}());
