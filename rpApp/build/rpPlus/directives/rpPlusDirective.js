'use strict';

(function () {
	'use strict';

	angular.module('rpPlus').directive('rpPlus', [rpPlus]);

	function rpPlus() {
		return {
			restrict: 'E',
			templateUrl: 'rpPlus/views/rpPlus.html',
			controller: 'rpPlusCtrl'
		};
	}
})();