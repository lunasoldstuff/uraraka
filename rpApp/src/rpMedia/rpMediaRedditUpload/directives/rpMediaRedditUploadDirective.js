(function () {
  'use strict';

  function rpMediaRedditUpload() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaRedditUpload/views/rpMediaRedditUpload.html',
      controller: 'rpMediaRedditUploadCtrl'
    };
  }

  angular.module('rpMediaRedditUpload')
    .directive('rpMediaRedditUpload', [rpMediaRedditUpload]);
}());
