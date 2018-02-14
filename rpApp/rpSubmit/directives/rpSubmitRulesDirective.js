(function() {
	'use strict';
	angular.module('rpSubmit').directive('rpSubmitRules', [rpSubmitRules]);

	function rpSubmitRules() {
		return {
			restirct: 'E',
			templateUrl: 'rpSubmit/views/rpSubmitRules.html',
			controller: 'rpSubmitRulesCtrl',

		};
	}
})();