(function () {
  'use strict';

  function rpMediaGiphyCtrl($scope, $filter) {
    const GIPHY_RE = /^http:\/\/(?:www\.)?giphy\.com\/gifs\/(.*?)(\/html5)?$/i;
    const GIPHY_ALT_RE = /^http:\/\/(?:www\.)?(?:i\.)?giphy\.com\/([\w]+)(?:.gif)?/i;
    const GIPHY_ALT_2_RE =
      /^https?:\/\/(?:www\.)?(?:media[0-9]?\.)?(?:i\.)?giphy\.com\/(?:media\/)?([\w]+)(?:.gif)?/i;
    var groups;

    if (GIPHY_RE.test($scope.url)) {
      groups = GIPHY_RE.exec($scope.url);
    } else if (GIPHY_ALT_RE.test($scope.url)) {
      groups = GIPHY_ALT_RE.exec($scope.url);
    } else if (GIPHY_ALT_2_RE.test($scope.url)) {
      groups = GIPHY_ALT_2_RE.exec($scope.url);
    }

    $scope.giphyType = (groups[2]) ? 'video' : 'image';

    if (groups) {
      $scope.thumbnailUrl = $filter('rpMediaGetImageUrlFilter')($scope.post);

      if (angular.isUndefined($scope.thumbnailUrl)) {
        $scope.thumbnailUrl = 'http://media.giphy.com/media/' + groups[1] + '/200_s.gif';
      }

      if ($scope.giphyType === 'image') {
        $scope.imageUrl = 'http://media.giphy.com/media/' + groups[1] + '/giphy.gif';
      } else if ($scope.giphyType === 'video') {
        $scope.videoUrl = 'http://media.giphy.com/media/' + groups[1] + '/giphy.mp4';
      }
    }

    $scope.show = function () {
      $scope.showGif = true;
    };

    $scope.hide = function () {
      $scope.showGif = false;
    };
  }

  angular.module('rpMediaGiphy')
    .controller('rpMediaGiphyCtrl', [
      '$scope',
      '$filter',
      rpMediaGiphyCtrl
    ]);
}());
