(function() {
	'use strict';
	angular.module('rpIdentity').directive('rpIdentity', [rpIdentity]);

	function rpIdentity() {
		return {
			restrict: 'E',
			templateUrl: 'rpIdentity/views/rpIdentity.html',
			controller: 'rpIdentityCtrl'
		};
	}
})();