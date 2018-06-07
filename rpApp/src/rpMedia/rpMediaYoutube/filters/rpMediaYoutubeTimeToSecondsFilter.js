(function () {
  'use strict';


  function rpMediaYoutubeTimeToSecondsFilter() {
    return function (time) {
      const CLOCK_TIME_RE = /^(?:([\d]+)h)?(?:([\d]+)m)?(?:([\d]+)s)?$/i;
      var groups = CLOCK_TIME_RE.exec(time);

      if (groups) {
        let hours = parseInt(groups[1], 10) || 0;
        let minutes = parseInt(groups[2], 10) || 0;
        let seconds = parseInt(groups[3], 10) || 0;

        return (hours * 60 * 60) + (minutes * 60) + seconds;
      }

      return 0;
    };
  }

  angular.module('rpMediaYoutube')
    .filter('rpMediaYoutubeTimeToSecondsFilter', [
      rpMediaYoutubeTimeToSecondsFilter
    ]);
}());
