(function () {
  'use strict';

  function rpReplyButtonCtrl($scope) {
    $scope.parentCtrl.isReplying = false;

    $scope.toggleReplying = function () {
      console.log('[rpReplyButtonCtrl], toggleReplying()');
      $scope.parentCtrl.isReplying = !$scope.parentCtrl.isReplying;
    };
  }

  angular.module('rpReply')
    .controller('rpReplyButtonCtrl', [
      '$scope',
      rpReplyButtonCtrl
    ]);
}());
