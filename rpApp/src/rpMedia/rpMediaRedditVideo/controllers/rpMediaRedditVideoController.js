(function () {
  'use strict';

  function rpMediaRedditVideoCtrl(
    $scope,
    $window
  ) {
    var dashUrl = $scope.post.data.secure_media.reddit_video.dash_url;
    var corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
    var url = corsAnywhere + dashUrl;

    var player = $window.dashjs.MediaPlayer()
      .create();
    player.initialize(document.querySelector('#videoPlayer'), url, true);
  }

  angular.module('rpMediaRedditVideo')
    .controller('rpMediaRedditVideoCtrl', [
      '$scope',
      '$window',
      rpMediaRedditVideoCtrl
    ]);
}());
