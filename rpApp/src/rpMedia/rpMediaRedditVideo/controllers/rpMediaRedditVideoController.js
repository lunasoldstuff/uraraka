(function () {
  'use strict';

  function rpMediaRedditVideoCtrl(
    $scope,
    $sce
  ) {
    console.log(`[rpMediaRedditVideoCtrl] $scope.post.data.secure_media.is_gif: ${$scope.post.data.secure_media.reddit_video.is_gif}`);
    console.log(`[rpMediaRedditVideoCtrl] $scope.post.data.secure_media.hls_url: ${$scope.post.data.secure_media.reddit_video.hls_url}`);
    $scope.videoUrl = $scope.post.data.secure_media.reddit_video.hls_url;

    $scope.config = {
      sources: [{
        src: $sce.trustAsResourceUrl('https://v.redd.it/ddftn2onm4y01/HLSPlaylist.m3u8'),
        type: 'application/vnd.apple.mpegURL'
      }, {
        src: $sce.trustAsResourceUrl('https://v.redd.it/ddftn2onm4y01/DASH_600_K'),
        type: 'video/mp4'
      },
      {
        src: $sce.trustAsResourceUrl('https://v.redd.it/ddftn2onm4y01/DASH_2_4_M'),
        type: 'video/mp4'
      },
      {
        src: $sce.trustAsResourceUrl('https://v.redd.it/ddftn2onm4y01/DASHPlaylist.mpd'),
        type: 'application/dash+xml'
      }
      ],
      tracks: [{
        src: $sce.trustAsResourceUrl('https://v.redd.it/ddftn2onm4y01/HLSPlaylist.m3u8'),
        type: 'application/vnd.apple.mpegURL'
      }],
      theme: {
        url: '/bower_components/videogular-themes-default/videogular.css'
      },
      plugins: {
        poster: 'https://i.redditmedia.com/g_OdOfDhFohxOibC_okeM1-L6KL8qGiEh8q0msDn_L8.png?s=ba098c3a00e7470b28eac6df68f573dd'
      }
    };
  }

  angular.module('rpMediaRedditVideo')
    .controller('rpMediaRedditVideoCtrl', [
      '$scope',
      '$sce',
      rpMediaRedditVideoCtrl
    ]);
}());
