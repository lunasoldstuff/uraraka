(function() {
	'use strict';

	angular.module('rpArticle').controller('rpArticleSortCtrl', rpArticleSortCtrl);

	function rpArticleSortCtrl($scope, $rootScope, $routeParams) {

		$scope.sorts = [{
			label: 'best',
			value: 'confidence'
		}, {
			label: 'top',
			value: 'top'
		}, {
			label: 'new',
			value: 'new'
		}, {
			label: 'hot',
			value: 'hot'
		}, {
			label: 'controversial',
			value: 'controversial'
		}, {
			label: 'old',
			value: 'old'
		}, {
			label: 'q&a',
			value: 'qa'
		}, ];

		if (angular.isDefined($routeParams.sort)) {
			for (var i = 0; i < $scope.sorts.length; i++) {
				if ($scope.sorts[i].value === $routeParams.sort) {
					$scope.articleSort = $scope.sorts[i];
					break;
				}
			}
		}

		if (angular.isUndefined($scope.articleSort)) {
			$scope.articleSort = {
				label: 'best',
				value: 'confidence'
			};
		}

		$scope.selectSort = function() {
			$rootScope.$emit('rp_sort_click', $scope.articleSort.value);

		};

	}

})();