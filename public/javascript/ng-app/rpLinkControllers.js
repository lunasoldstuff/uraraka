'use strict';

var rpLinkControllers = angular.module('rpLinkControllers', []);

rpLinkControllers.controller('rpLinkCtrl', ['$scope', '$mdDialog', 'rpLocationUtilService',
  function($scope, $mdDialog, rpLocationUtilService) {
    console.log('[rpLinkCtrl]');

    $scope.isMine = $scope.identity ? $scope.post.data.author === $scope.identity.name : false;

    /**
    * CONTOLLER API
    */
    $scope.thisController = this;

    this.completeDeleting = function(id) {
      console.log('[rpLinkCtrl] completeDeleting()');
      $scope.parentCtrl.completeDeleting(id);

    };

    this.completeReplying = function(data) {
      console.log('[rpLinkCtrl] completeReplying()');
      $scope.postComment = data.json.data.things[0];
      $scope.post.data.num_comments++;
    };

    $scope.showComments = function(e) {
      console.log('[rpPostsCtrl] showComments(), e.ctrlKey:' + e.ctrlKey);

      if ($scope.commentsDialog && !e.ctrlKey) {
        $mdDialog.show({
          controller: 'rpArticleDialogCtrl',
          templateUrl: 'partials/rpArticleDialog',
          targetEvent: e,
          locals: {
            post: $scope.post
          },
          clickOutsideToClose: true,
          openFrom: '#' + $scope.post.data.name,
          closeTo: '#' + $scope.post.data.name,
          escapeToClose: false

        });

      } else {
        rpLocationUtilService(e, '/r/' + $scope.post.data.subreddit + '/comments/' + $scope.post.data.id, '', true, false);
      }
    };

  }
]);
