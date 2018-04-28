(function() {
	'use strict';
	angular.module('rpEdit').controller('rpEditFormCtrl', [
		'$scope',
		'$timeout',
		'rpEditService',
		rpEditFormCtrl
	]);

	function rpEditFormCtrl($scope, $timeout, rpEditService) {

		$scope.formatting = false;

		$scope.submit = function() {
			console.log('[rpEditFormCtrl] submit(), $scope.editText: ' + $scope.editText);
			$scope.inputIsDisabled = true;

			$scope.isSubmitting = true;
			//$timeout(angular.noop, 0);

			rpEditService($scope.editText, $scope.redditId, function(err, data) {
				if (err) {
					console.log('[rpEditFormCtrl] err');

				} else {
					$scope.parentCtrl.completeEditing();

				}

			});

		};

		$scope.toggleFormatting = function() {
			$scope.formatting = !$scope.formatting;
		};
	}
})();