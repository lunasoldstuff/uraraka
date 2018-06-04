(function () {
  'use strict';

  function rpMediaRedditVideo($window, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaRedditVideo/views/rpMediaRedditVideo.html',
      controller: 'rpMediaRedditVideoCtrl',
      link: function (scope, element, attrs) {
        $timeout(() => {
          let dashUrl;
          if (scope.post.data.crosspost_parent_list) {
            dashUrl =
              scope.post.data.crosspost_parent_list[0].secure_media.reddit_video
                .dash_url;
          } else {
            dashUrl = scope.post.data.secure_media.reddit_video.dash_url;
          }

          console.log(`[rpMediaRedditVideo] link() dashUrl: ${dashUrl}`);

          let corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
          let url = corsAnywhere.concat(dashUrl);
          let idSelector = '#video-'.concat(scope.post.data.name);
          let videoElement = document.querySelector(idSelector);
          console.log(`[rpMediaRedditVideo] videoElement: ${videoElement}`);

          let player = $window.dashjs.MediaPlayer().create();

          videoElement.addEventListener(
            'play',
            () => {
              console.log('[rpMediaRedditVideo] initialize dash player');
              player.initialize(videoElement, url, false);
            },
            true
          );
        }, 0);
      }
    };
  }

  angular
    .module('rpMediaRedditVideo')
    .directive('rpMediaRedditVideo', [
      '$window',
      '$timeout',
      rpMediaRedditVideo
    ]);
}());
