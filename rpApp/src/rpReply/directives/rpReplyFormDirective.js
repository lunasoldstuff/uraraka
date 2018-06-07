(function () {
  'use strict';

  function rpReplyForm() {
    return {
      restrict: 'E',
      templateUrl: 'rpReply/views/rpReplyForm.html',
      controller: 'rpReplyFormCtrl',
      scope: {
        redditId: '=',
        parentCtrl: '=',
        post: '='


      }
    };
  }

  angular.module('rpReply')
    .directive('rpReplyForm', [rpReplyForm]);
}());
