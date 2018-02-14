(function() {
	'use strict';
	angular.module('rpSearch').controller('rpSearchSortCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		rpSearchSortCtrl
	]);

	function rpSearchSortCtrl($scope, $rootScope, $routeParams) {
		console.log('[rpSearchSortCtrl] $routeParams.sort: ' + $routeParams.sort);
		$scope.searchSort = $routeParams.sort || 'relevance';

		$scope.selectSort = function(sort) {
			$scope.searchSort = sort;
			$rootScope.$emit('rp_sort_click', sort);
		};

	}
})();