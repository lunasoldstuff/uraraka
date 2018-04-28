'use strict';

(function () {
	'use strict';

	angular.module('rpMediaTwitter').directive('rpMediaTwitter', [rpMediaTwitter]);

	function rpMediaTwitter() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaTwitter/views/rpMediaTwitter.html',
			controller: 'rpMediaTwitterCtrl'
		};
	}
})();