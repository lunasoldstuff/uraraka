'use strict';

(function () {
	'use strict';

	angular.module('rpGotoSubreddit').directive('rpGotoSubreddit', [rpGotoSubreddit]);

	function rpGotoSubreddit() {
		return {
			restrict: 'E',
			templateUrl: 'rpGotoSubreddit/views/rpGotoSubreddit.html',
			controller: 'rpGotoSubredditCtrl'
		};
	}
})();