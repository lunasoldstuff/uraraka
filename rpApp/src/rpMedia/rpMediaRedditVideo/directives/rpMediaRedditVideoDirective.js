(function () {
  'use strict';

  function rpMediaRedditVideo($window, $timeout, rpSlideshowService) {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaRedditVideo/views/rpMediaRedditVideo.html',
      controller: 'rpMediaRedditVideoCtrl',
      link: function (scope, element, attrs) {
        console.log(`[rpMediaRedditVideo] scope.slideshow: ${scope.slideshow}`);

        $timeout(() => {
          let dashUrl;

          dashUrl = (
            (
              (((((scope || {}).post || {}).data || {}).crosspost_parent_list ||
                {})[0] || {}).secure_media || {}
            ).reddit_video || {}
          ).dash_url;

          if (angular.isUndefined(dashUrl)) {
            dashUrl = (
              ((((scope || {}).post || {}).data || {}).secure_media || {})
                .reddit_video || {}
            ).dash_url;
          }

          if (angular.isUndefined(dashUrl)) {
            dashUrl = (
              ((((scope || {}).post || {}).data || {}).preview || {})
                .reddit_video_preview || {}
            ).dash_url;
          }

          // if (scope.post.data.crosspost_parent_list) {
          //   dashUrl =
          //     scope.post.data.crosspost_parent_list[0].secure_media.reddit_video
          //       .dash_url;
          // } else {
          //   dashUrl = scope.post.data.secure_media.reddit_video.dash_url;
          // }

          console.log(`[rpMediaRedditVideo] link() dashUrl: ${dashUrl}`);

          let corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
          let url = corsAnywhere.concat(dashUrl);
          let idSelector = '#video-'.concat(scope.post.data.name);
          let videoElement = element.children('video')[0];
          console.log(`[rpMediaRedditVideo] videoElement: ${videoElement}`);

          let player = $window.dashjs.MediaPlayer().create();

          if (scope.slideshow) {
            player.initialize(videoElement, url, true);
          } else {
            videoElement.addEventListener(
              'play',
              () => {
                console.log('[rpMediaRedditVideo] initialize dash player');
                player.initialize(videoElement, url, false);
              },
              true
            );
          }
        }, 0);
      }
    };
  }

  angular
    .module('rpMediaRedditVideo')
    .directive('rpMediaRedditVideo', [
      '$window',
      '$timeout',
      'rpSlideshowService',
      rpMediaRedditVideo
    ]);
}());
