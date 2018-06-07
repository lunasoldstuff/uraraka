(function () {
  'use strict';

  function rpMediaYoutubeCtrl($scope, $rootScope, $sce, $filter) {
    const YOUTUBE_RE = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w-]+)/i;
    const YOUTUBE_ALT_RE = /^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)(\?t=[\w]+)?/i;
    const YOUTUBE_TIMESTAMP_RE = /\?t=[\w+]+/i;

    $scope.playerVars = {
      autoplay: 1
    };

    let groups;
    groups = YOUTUBE_RE.exec($scope.url);
    if (!groups) groups = YOUTUBE_ALT_RE.exec($scope.url);

    if (groups) {
      console.log('[rpMediaYoutubeCtrl] groups: ' + groups);

      // $scope.thumbnailUrl = 'https://img.youtube.com/vi/' + groups[1] + '/default.jpg';
      $scope.thumbnailUrl = $filter('rpMediaGetImageUrlFilter')($scope.post);

      if (angular.isUndefined($scope.thumbnailUrl)) {
        $scope.thumbnailUrl = 'https://img.youtube.com/vi/' + groups[1] + '/hqdefault.jpg';
      }

      let embedUrl = 'https://www.youtube.com/embed/' + groups[1] + '?autoplay=1';

      if (groups[2]) {
        if (YOUTUBE_TIMESTAMP_RE.test(groups[2])) {
          console.log('[rpMediaYoutubeCtrl] groups[2]: ' + groups[2]);
          let time = $filter('rpMediaYoutubeTimeToSecondsFilter')(groups[2].replace('?t=', ''));
          embedUrl += '&start=' + time;
          $scope.playerVars.start = time;
          console.log(`[rpMediaYoutubeCtrl()] time ${time}`);
        }
      }

      console.log('[rpMediaYoutubeCtrl] embedUrl: ' + embedUrl);

      $scope.embedUrl = $sce.trustAsResourceUrl(embedUrl + '&enablejsapi=1');
      $scope.videoId = groups[1];
    }

    $scope.showYoutubeVideo = false;

    $scope.show = function () {
      $scope.showYoutubeVideo = true;
    };

    $scope.hide = function () {
      $scope.showYoutubeVideo = false;
    };

    $scope.$on('youtube.player.ready', function (e, player) {
      console.log('[rpMediaYoutubeCtrl] player.ready');
      if (jQuery(player.getIframe())
        .parents()
        .find('.rp-slideshow')
        .length > 0) {
        $rootScope.$emit('rp_slideshow_video_start');
      }
    });

    $scope.$on('youtube.player.ended', function (e, player) {
      console.log('[rpMediaYoutubeCtrl] player.ended');
      if (jQuery(player.getIframe())
        .parents()
        .find('.rp-slideshow')
        .length > 0) {
        $rootScope.$emit('rp_slideshow_video_end');
      }
    });
  }

  angular.module('rpMediaYoutube')
    .controller('rpMediaYoutubeCtrl', [
      '$scope',
      '$rootScope',
      '$sce',
      '$filter',
      rpMediaYoutubeCtrl
    ]);
}());
