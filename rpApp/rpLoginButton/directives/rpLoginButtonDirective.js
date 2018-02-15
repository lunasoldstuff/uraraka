(function() {
	'use strict';
	angular.module('rpLoginButton').directive('rpLoginButton', [rpLoginButton]);

	function rpLoginButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpLoginButton/views/rpLoginButton.html',
			controller: 'rpLoginButtonCtrl',
			scope: {
				path: '@path'
			}
		};
	}
})();