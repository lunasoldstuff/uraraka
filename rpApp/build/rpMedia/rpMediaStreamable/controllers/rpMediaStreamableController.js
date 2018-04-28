'use strict';

(function () {
	'use strict';

	angular.module('rpMediaStreamable').controller('rpMediaStreamableCtrl', ['$scope', '$sce', '$filter', rpMediaStreamableCtrl]);

	function rpMediaStreamableCtrl($scope, $sce, $filter) {
		console.log('[rpMediaStreamableCtrl]');

		$scope.imageUrl = $filter('rpMediaGetImageUrlFilter')($scope.post);

		// $scope.showVideo = true;
		$scope.showVideo = false;

		$scope.show = function () {
			$scope.showVideo = true;
		};

		$scope.hide = function () {
			$scope.showVideo = false;
		};
	}
})();