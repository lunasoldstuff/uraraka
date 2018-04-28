(function() {
	'use strict';
	angular.module('rpDelete').directive('rpDeleteButton', rpDeleteButton);

	function rpDeleteButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpDelete/views/rpDeleteButton.html',
			controller: 'rpDeleteButtonCtrl',
			scope: {
				parentCtrl: '='

			}

		};
	}
})();