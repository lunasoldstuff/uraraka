(function () {
  'use strict';

  function rpReplyButton() {
    return {
      restrict: 'E',
      templateUrl: 'rpReply/views/rpReplyButton.html',
      controller: 'rpReplyButtonCtrl',
      scope: {
        parentCtrl: '='
      }
    };
  }


  angular.module('rpReply')
    .directive('rpReplyButton', [rpReplyButton]);
}());
