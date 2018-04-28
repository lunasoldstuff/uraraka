'use strict';

(function () {
	'use strict';

	angular.module('rpSearch').controller('rpSearchTimeFilterCtrl', ['$scope', '$rootScope', 'rpSearchService', rpSearchTimeFilterCtrl]);

	function rpSearchTimeFilterCtrl($scope, $rootScope, rpSearchService) {

		$scope.type = rpSearchService.params.type;

		console.log('[rpSearchTimeFilterCtrl] $scope.type: ' + $scope.type);

		$scope.selectTime = function (value) {
			$rootScope.$emit('search_time_click', value);
		};
	}
})();