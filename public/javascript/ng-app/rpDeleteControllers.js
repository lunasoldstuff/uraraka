'use strict';

var rpDeleteControllers = angular.module('rpDeleteControllers', []);

rpDeleteControllers.controller('rpDeleteButtonCtrl', ['$scope',
	function($scope) {
		$scope.parentCtrl.isDeleting = false;

		$scope.toggleDeleting = function(e) {
			console.log('[rpDeleteButtonCtrl] toggleDeleting()');
			$scope.parentCtrl.isDeleting = !$scope.parentCtrl.isDeleting;
		};

	}
]);

rpDeleteControllers.controller('rpDeleteFormCtrl', ['$scope', 'rpDeleteUtilService',
	function($scope, rpDeleteUtilService) {
		console.log('[rpDeleteFormCtrl]');

		$scope.isDeleteInProgress = false;

		$scope.submit = function() {
			console.log('[rpDeleteCtrl] confirmDelete()');

			$scope.isDeleteInProgress = true;

			rpDeleteUtilService($scope.id, function(err, data) {
				$scope.isDeleteInProgress = false;

				if (err) {
					console.log('[rpDeleteCtrl] err');

				} else {
					$scope.parentCtrl.completeDelete($scope.id);

				}

			});

		};
	}
]);
