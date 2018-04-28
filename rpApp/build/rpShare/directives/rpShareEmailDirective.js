'use strict';

(function () {
	'use strict';

	angular.module('rpShare').directive('rpShareEmail', [rpShareEmail]);

	function rpShareEmail() {
		return {
			restrict: 'C',
			templateUrl: 'rpShare/views/rpShareEmail.html',
			controller: 'rpShareEmailCtrl'
		};
	}
})();