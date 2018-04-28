(function() {
	'use strict';
	angular.module('rpMedia').filter('rpMediaYoutubeTimeToSecondsFilter', [
		rpMediaYoutubeTimeToSecondsFilter
	]);

	function rpMediaYoutubeTimeToSecondsFilter() {
		return function(time) {

			var clockTimeRe = /^(?:([\d]+)h)?(?:([\d]+)m)?(?:([\d]+)s)?$/i;

			var groups = clockTimeRe.exec(time);

			if (groups) {

				var hours = parseInt(groups[1]) || 0;
				var minutes = parseInt(groups[2]) || 0;
				var seconds = parseInt(groups[3]) || 0;

				return hours * 60 * 60 + minutes * 60 + seconds;
			}

			return 0;

		};
	}
})();