'use strict';

var rpEditFormControllers = angular.module('rpEditFormControllers', []);

rpEditFormControllers.controller('rpEditButtonCtrl', ['$scope',
	function($scope) {
		console.log('[rpEditButtonCtrl]');

		$scope.parentCtrl.isEditing = false;

		$scope.toggleEditing = function() {
			$scope.parentCtrl.isEditing = !$scope.parentCtrl.isEditing;
		};

	}
]);

rpEditFormControllers.controller('rpEditFormCtrl', [
	'$scope',
	'rpEditUtilService',

	function($scope, rpEditUtilService) {

		$scope.submit = function() {
			console.log('[rpEditFormCtrl] submit(), $scope.editText: ' + $scope.editText);
			$scope.inputIsDisabled = true;

			$scope.isSubmitting = true;

			rpEditUtilService($scope.editText, $scope.redditId, function(err, data) {
				if (err) {
					console.log('[rpEditFormCtrl] err');

				} else {
					$scope.parentCtrl.completeEditing();

				}

			});
		};
	}
]);