'use strict';

(function () {
	'use strict';

	angular.module('rpGild').directive('rpGild', rpGild);

	function rpGild() {
		return {
			restrict: 'E',
			templateUrl: 'rpGild/views/rpGild.html',
			scope: {
				parentCtrl: '=',
				author: '=',
				gilded: '='
			}
		};
	}
})();