'use strict';

(function () {
	'use strict';

	angular.module('rpMediaYoutube').directive('rpMediaYoutube', [rpMediaYoutube]);

	function rpMediaYoutube() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaYoutube/views/rpMediaYoutube.html',
			controller: 'rpMediaYoutubeCtrl'
		};
	}
})();