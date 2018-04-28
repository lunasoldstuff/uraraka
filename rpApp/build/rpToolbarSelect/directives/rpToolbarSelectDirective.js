'use strict';

(function () {
	'use strict';

	angular.module('rpToolbarSelect').directive('rpToolbarSelect', [rpToolbarSelect]);

	function rpToolbarSelect() {
		return {
			restrict: 'E',
			templateUrl: 'rpToolbarSelect/views/rpToolbarSelect.html',
			controller: 'rpToolbarSelectCtrl',
			scope: {
				type: "="
			}
		};
	}
})();