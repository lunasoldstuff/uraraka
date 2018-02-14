(function() {
	'use strict';
	angular.module('rpSearch').controller('rpSearchSidenavCtrl', [
		'$scope',
		'$rootScope',
		'rpSearchFormUtilService',
		rpSearchSidenavCtrl
	]);

	function rpSearchSidenavCtrl(
		$scope,
		$rootScope,
		rpSearchFormUtilService
	) {
		$scope.isOpen = rpSearchFormUtilService.isVisible;

		$scope.toggleOpen = function(e) {
			$scope.isOpen = !$scope.isOpen;
		};

		var deregisterSearchFormVisibility = $rootScope.$on('rp_search_form_visibility', function(e, isOpen) {
			$scope.isOpen = isOpen;
		});

		$scope.$on('$destroy', function() {
			deregisterSearchFormVisibility();
		});

	}
})();