(function() {
	'use strict';
	angular.module('rpSearch').controller('rpSearchTimeFilterCtrl', [
		'$scope',
		'$rootScope',
		'rpSearchUtilService',
		rpSearchTimeFilterCtrl
	]);

	function rpSearchTimeFilterCtrl($scope, $rootScope, rpSearchUtilService) {

		$scope.type = rpSearchUtilService.params.type;

		console.log('[rpSearchTimeFilterCtrl] $scope.type: ' + $scope.type);

		$scope.selectTime = function(value) {
			$rootScope.$emit('search_time_click', value);
		};
	}

})();