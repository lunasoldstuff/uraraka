'use strict';

(function () {
	'use strict';

	angular.module('rpSpeedDial').directive('rpSpeedDial', [rpSpeedDial]);

	function rpSpeedDial() {
		return {
			restirct: 'E',
			templateUrl: 'rpSpeedDial/views/rpSpeedDial.html',
			controller: 'rpSpeedDialCtrl'
		};
	}
})();