'use strict';

(function () {
	'use strict';

	angular.module('rpPlus').directive('rpPlusPaypalButton', [rpPlusPaypalButton]);

	function rpPlusPaypalButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpPlus/views/rpPlusPaypalButton.html'
		};
	}
})();