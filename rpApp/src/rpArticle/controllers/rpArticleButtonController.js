(function () {
  'use strict';

  function rpArticleButtonCtrl(
    $scope,
    $rootScope,
    $filter,
    $mdDialog,
    $mdBottomSheet,
    $window,
    rpSettingsService,
    rpAppLocationService,
    rpAppIsMobileViewService

  ) {
    $scope.showArticle = function (e, context) {
      var article;
      var subreddit;
      var comment;
      var anchor;


      console.log('[rpArticleButtonCtrl] $scope.showArticle(), comment: ' + comment);

      if ($scope.post) {
        console.log('[rpArticleButtonCtrl] $scope.showArticle() post, isComment: ' + $scope.isComment);

        article = $scope.isComment ? $filter('rpAppNameToId36Filter')($scope.post.data.link_id) : $scope.post.data.id;
        console.log('[rpArticleButtonCtrl] $scope.showArticle() article: ' + article);

        subreddit = $scope.post.data.subreddit;
        console.log('[rpArticleButtonCtrl] $scope.showArticle() subreddit: ' + subreddit);

        comment = $scope.isComment ? $scope.post.data.id : '';

        anchor = '#' + $scope.post.data.name;
      } else if ($scope.message) { // rpMessageComment...
        console.log('[rpArticleButtonCtrl] $scope.showArticle() message.');
        const MESSAGE_CONTEXT_RE = /^\/r\/([\w]+)\/comments\/([\w]+)\/(?:[\w]+)\/([\w]+)/;
        let groups = MESSAGE_CONTEXT_RE.exec($scope.message.data.context);

        if (groups) {
          subreddit = groups[1];
          article = groups[2];
          comment = groups[3]; // only if we are showing context
        }

        anchor = '#' + $scope.message.data.name;
      }

      console.log('[rpArticleButtonCtrl] $scope.showArticle(), comment: ' + comment);

      function hideBottomSheet() {
        console.log('[rpArticleButtonCtrl] hideBottomSheet()');
        $mdBottomSheet.hide();
      }

      // check if we are in mobile and open in dialog
      if ((rpSettingsService.settings.commentsDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
        console.log('[rpArticleButtonCtrl] anchor: ' + anchor);
        $mdDialog.show({
          controller: 'rpArticleDialogCtrl',
          templateUrl: 'rpArticle/views/rpArticleDialog.html',
          targetEvent: e,
          locals: {
            post: $scope.isComment ? undefined : $scope.post,
            article: article,
            comment: context ? comment : '',
            subreddit: subreddit
          },
          clickOutsideToClose: true,
          escapeToClose: false,
          onRemoving: hideBottomSheet

        });
      } else {
        console.log('[rpArticleButtonCtrl] $scope.showArticle() dont open in dialog.');

        let search = '';
        let url = '/r/' + subreddit + '/comments/' + article;

        if (context) {
          url += '/' + comment + '/';
          search = 'context=8';
        }

        rpAppLocationService(e, url, search, true, false);
      }
    };
  }

  angular.module('rpArticle')
    .controller('rpArticleButtonCtrl', [
      '$scope',
      '$rootScope',
      '$filter',
      '$mdDialog',
      '$mdBottomSheet',
      '$window',
      'rpSettingsService',
      'rpAppLocationService',
      'rpAppIsMobileViewService',
      rpArticleButtonCtrl
    ]);
}());
