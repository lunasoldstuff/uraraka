(function () {
  'use strict';

  function rpMediaGfycatCtrl($scope, $http, $timeout) {
    const PREFIX = 'https://';
    const GFYCAT_RE = /(^https?:\/\/[\w]?\.?)?gfycat\.com\/(\w+)(\.gif)?/i;
    var groups = GFYCAT_RE.exec($scope.url);

    console.log('[rpMediaGyfcatCtrl] $scope.url: ' + $scope.url);


    if (groups[3] && groups[3] === '.gif') {
      $scope.gfycatType = 'image';
    } else {
      $scope.gfycatType = 'video';
    }

    $scope.showGif = false;


    if (groups) {
      let gfycatApiUrl = 'https://api.gfycat.com/v1test/gfycats/' + groups[2];

      $http({
        method: 'GET',
        url: gfycatApiUrl
      })
        .then(function successCallback(response) {
          console.log('[rpMediaGfycatCtrl] response: ' + JSON.stringify(response));
          console.log('[rpMediaGfycatCtrl] response.gfyItem.gfyName: ' + response.data.gfyItem.gfyName);

          $scope.dataId = response.data.gfyItem.gfyName;

          $scope.thumbnailUrl = 'https://thumbs.gfycat.com/' + $scope.dataId + '-poster.jpg';

          if ($scope.gfycatType === 'image') {
            $scope.imageUrl = PREFIX + 'gfycat.com/' + $scope.dataId + '.gif';
          } else if ($scope.gfycatType === 'video') {
            $scope.zippyVideoUrl = 'https://zippy.gfycat.com/' + $scope.dataId + '.webm';
            $scope.fatVideoUrl = 'https://fat.gfycat.com/' + $scope.dataId + '.webm';
            $scope.giantVideoUrl = 'https://giant.gfycat.com/' + $scope.dataId + '.webm';
            $scope.thumbsVideoUrl = 'https://thumbs.gfycat.com/' + $scope.dataId + '-mobile.mp4';
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }

    $scope.show = function () {
      $scope.showGif = true;
    };

    $scope.hide = function () {
      $scope.showGif = false;
    };

    $timeout(function () {
      $scope.showVideo = true;
    }, 500);
  }

  angular.module('rpMediaGfycat')
    .controller('rpMediaGfycatCtrl', [
      '$scope',
      '$http',
      '$timeout',
      rpMediaGfycatCtrl
    ]);
}());
