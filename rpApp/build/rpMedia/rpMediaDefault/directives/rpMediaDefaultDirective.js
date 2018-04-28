'use strict';

(function () {
	'use strict';

	angular.module('rpMediaDefault').directive('rpMediaDefault', [rpMediaDefault]);

	function rpMediaDefault() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaDefault/views/rpMediaDefault.html',
			controller: 'rpMediaDefaultCtrl'
		};
	}
})();