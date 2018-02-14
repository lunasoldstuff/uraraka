(function() {
	'use strict';
	angular.module('rpPost').controller('rpPostSortCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		rpPostSortCtrl
	]);

	function rpPostSortCtrl(
		$scope,
		$rootScope,
		$routeParams
	) {

		$scope.sorts = [{
			label: 'hot',
			value: 'hot'
		}, {
			label: 'new',
			value: 'new'
		}, {
			label: 'rising',
			value: 'rising'
		}, {
			label: 'controversial',
			value: 'controversial'
		}, {
			label: 'top',
			value: 'top'
		}, {
			label: 'gilded',
			value: 'gilded'
		}];

		initValue();

		$scope.selectSort = function() {
			$rootScope.$emit('rp_post_sort_click', $scope.postSort.value);
		};

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
			console.log('[rpPostSortCtrl] onRouteChange');
			initValue();
		});


		function initValue() {
			console.log('[rpPostSortCtrl] initValue(), $routeParams.sort: ' + $routeParams.sort);

			var sort;

			if (angular.isDefined($routeParams.sort)) {
				for (var i = 0; i < $scope.sorts.length; i++) {
					if ($scope.sorts[i].value === $routeParams.sort) {
						sort = $scope.sorts[i];
						break;
					}
				}
			}

			if (angular.isUndefined(sort)) {
				sort = {
					label: 'hot',
					value: 'hot'
				};
			}

			$scope.postSort = sort;

		}

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});

	}
})();