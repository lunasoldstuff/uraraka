'use strict';

var rpLinkControllers = angular.module('rpLinkControllers', []);

rpLinkControllers.controller('rpLinkCtrl', ['$scope', '$filter', '$mdDialog', 'rpLocationUtilService',
  function($scope, $filter, $mdDialog, rpLocationUtilService) {
    console.log('[rpLinkCtrl]');

    $scope.isComment = $filter('rp_is_comment')($scope.post.data.name);
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

      if ($scope.commentsDialog && !e.ctrlKey) {

        $mdDialog.show({
          controller: 'rpArticleDialogCtrl',
          templateUrl: 'partials/rpArticleDialog',
          targetEvent: e,
          locals: {

            link: $scope.post,
            isComment: $scope.isComment,

          },
          clickOutsideToClose: true,
          openFrom: '#' + $scope.post.data.name,
          closeTo: '#' + $scope.post.data.name,
          escapeToClose: false

        });

      } else {
        var linkId = $scope.isComment ? $filter('rp_name_to_id36')($scope.post.data.link_id) : $scope.post.data.id;
        rpLocationUtilService(e, '/r/' + $scope.post.data.subreddit + '/comments/' + linkId, '', true, false);

      }
    };

  // $scope.showContext = function(e) {
  //   console.log('[rpLinkCtrl] showContext()');
  //
  //   if ($scope.commentsDialog && !e.ctrlKey) {
  //
  //     var id = post.data.link_id || post.data.name;
  //
  //     rpByIdUtilService(id, function(err, data) {
  //
  //       if (err) {
  //         console.log('[rpUserCtrl] err');
  //       } else {
  //         data.comment = post.data.id;
  //         data.context = 8;
  //         $mdDialog.show({
  //           controller: 'rpArticleDialogCtrl',
  //           templateUrl: 'partials/rpCommentsDialog',
  //           targetEvent: e,
  //           locals: {
  //             post: data.data.children[0]
  //           },
  //           clickOutsideToClose: true,
  //           escapeToClose: false
  //
  //         });
  //
  //       }
  //
  //     });
  //
  //   } else {
  //
  //     rpLocationUtilService(e, '/r/' + post.data.subreddit +
  //       '/comments/' +
  //       $filter('rp_name_to_id36')(post.data.link_id) +
  //       '/' + post.data.id + '/', 'context=8', true, false);
  //   }
  // };
  }


]);
