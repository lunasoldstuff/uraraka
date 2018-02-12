(function() {
	'use strict';
	angular.module('rpEdit').directive('rpEditButton', rpEditButton);

	function rpEditButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpEditButton.html',
			controller: 'rpEditButtonCtrl',
			scope: {
				parentCtrl: '='

			}

		};
	}

})();