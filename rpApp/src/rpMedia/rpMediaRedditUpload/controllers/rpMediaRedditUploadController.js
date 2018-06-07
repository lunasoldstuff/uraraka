(function () {
  'use strict';

  function rpMediaRedditUploadCtrl($scope, $filter) {
    // reddit image upload urls have extra 'amp;' garbage in the url, just need to remove it.
    $scope.imageUrl = $filter('rpMediaRemoveAmpFilter')($scope.url);
  }

  angular.module('rpMediaRedditUpload')
    .controller('rpMediaRedditUploadCtrl', [
      '$scope',
      '$filter',
      rpMediaRedditUploadCtrl
    ]);
}());
