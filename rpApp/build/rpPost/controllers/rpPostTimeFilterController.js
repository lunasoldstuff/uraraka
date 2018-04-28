'use strict';

(function () {
	'use strict';

	angular.module('rpPost').controller('rpPostTimeFilterCtrl', ['$scope', '$rootScope', '$routeParams', rpPostTimeFilterCtrl]);

	function rpPostTimeFilterCtrl($scope, $rootScope, $routeParams) {

		$scope.times = [{
			label: 'this hour',
			value: 'hour'
		}, {
			label: 'today',
			value: 'day'
		}, {
			label: 'this week',
			value: 'week'
		}, {
			label: 'this month',
			value: 'month'
		}, {
			label: 'this year',
			value: 'year'
		}, {
			label: 'all time',
			value: 'all'
		}];

		if (angular.isDefined($routeParams.t)) {
			for (var i = 0; i < $scope.times.length; i++) {
				if ($scope.sorts[i].value === $routeParams.t) {
					$scope.postTime = $scope.times[i];
					break;
				}
			}
		}

		if (angular.isUndefined($scope.postTime)) {
			$scope.postTime = {
				label: 'today',
				value: 'day'
			};
		}

		$scope.selectTime = function () {
			$rootScope.$emit('rp_post_time_click', $scope.postTime.value);
		};
	}
})();