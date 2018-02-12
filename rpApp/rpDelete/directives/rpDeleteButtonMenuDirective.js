(function() {
	'use strict';
	angular.module('rpDelete').directive('rpDeleteButtonMenu', rpDeleteButtonMenu);

	function rpDeleteButtonMenu() {
		return {
			restrict: 'E',
			templateUrl: 'rpDeleteButtonMenu.html',
			controller: 'rpDeleteButtonCtrl',
			scope: {
				parentCtrl: '='

			}

		};
	}

})();