(function() {
	'use strict';
	angular.module('rpRefreshButton').controller('rpRefreshButtonCtrl', [
		'$scope',
		'$rootScope',
		rpRefreshButtonCtrl
	]);

	function rpRefreshButtonCtrl($scope, $rootScope) {
		console.log('[rpRefreshButtonCtrl] load');
		$scope.refresh = function() {
			console.log('[rpRefreshButtonCtrl] refresh()');
			$rootScope.$emit('rp_refresh');
		};
	}
})();