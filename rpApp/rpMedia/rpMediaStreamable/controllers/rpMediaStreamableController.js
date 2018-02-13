(function() {
	'use strict';
	angular.module('rpMediaStreamable').controller('rpMediaStreamableCtrl', [
		'$scope',
		'$sce',
		'$filter',
		rpMediaStreamableCtrl
	]);

	function rpMediaStreamableCtrl($scope, $sce, $filter) {
		console.log('[rpMediaStreamableCtrl]');

		$scope.imageUrl = $filter('rp_get_image_url')($scope.post);

		// $scope.showVideo = true;
		$scope.showVideo = false;

		$scope.show = function() {
			$scope.showVideo = true;
		};

		$scope.hide = function() {
			$scope.showVideo = false;
		};

	}

})();