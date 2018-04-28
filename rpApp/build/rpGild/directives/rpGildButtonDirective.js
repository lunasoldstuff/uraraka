'use strict';

(function () {
	'use strict';

	angular.module('rpGild').directive('rpGildButton', rpGildButton);

	function rpGildButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpGild/views/rpGildButton.html',
			controller: 'rpGildButtonCtrl',
			scope: {
				redditId: '=',
				gilded: '='
			}
		};
	}
})();