(function() {
	'use strict';
	angular.module('rpFeedback').controller('rpFeedbackFormCtrl', [
		'$scope',
		'$timeout',
		'$mdDialog',
		'$window',
		'rpFeedbackService',
		'rpAppLocationService',
		'rpIdentityService',
		rpFeedbackFormCtrl
	]);

	function rpFeedbackFormCtrl(
		$scope,
		$timeout,
		$mdDialog,
		$window,
		rpFeedbackService,
		rpAppLocationService,
		rpIdentityService

	) {
		console.log('[rpFeedbackFormCtrl]');

		$scope.showButtons = true;
		$scope.showSubmit = true;
		$scope.showFeedback = false;
		$scope.feedbackMessage = "";
		$scope.showFeedbackAlert = false;

		function resetForm() {
			$scope.text = "";
			$scope.title = "";
			$scope.showButtons = true;
			$scope.showSubmit = true;
			$scope.feedbackMessage = "";
			$scope.showFeedbackAlert = false;
			angular.element('#feedback-title').focus();
		}

		$scope.submitForm = function() {
			console.log('[rpFeedbackFormCtrl] submitForm()');

			$scope.showProgress = true;
			$scope.showButtons = false;
			$scope.showFeedback = false;
			$scope.feedbackMessage = "";
			$scope.showFeedbackAlert = false;
			$scope.showFeedbackSuccess = false;

			var name;

			rpIdentityService.getIdentity(function(identity) {
				name = identity === null ? 'user not logged in' : identity.name;

				console.log('[rpFeedbackFormCtrl] $scope.title: ' + $scope.title);
				console.log('[rpFeedbackFormCtrl] $scope.text: ' + $scope.text);
				console.log('[rpFeedbackFormCtrl] name: ' + name);

				rpFeedbackService($scope.title, $scope.text, name, function(err, data) {

					if (err) {
						console.log('[rpFeedbackFormCtrl] err');
						console.log('[rpFeedbackFormCtrl] err: ' + JSON.stringify(err));
						$scope.showProgress = false;
						$scope.showSubmit = true;
						$scope.showButtons = true;
						// $timeout(angular.noop, 0);

					} else {
						console.log('[rpFeedbackFormCtrl] success');
						$scope.feedbackMessage = "Feedback Submitted, Thank you for helping to improve reddup";
						$scope.feedbackIcon = 'sentiment_very_satisfied';
						$scope.showFeedbackSuccess = true;
						$scope.showFeedbackIcon = true;
						$scope.showFeedback = true;
						$scope.showProgress = false;
						$scope.showAnother = true;
						$scope.showSubmit = true;
						$scope.showButtons = true;
						//$timeout(angular.noop, 0);

					}

				});

			});
		};

		$scope.resetForm = function() {
			resetForm();
		};

		$scope.closeDialog = function(e) {
			console.log('[rpFeedbackFormCtrl] closeDialog()');

			if ($scope.isDialog) {
				console.log('[rpFeedbackFormCtrl] closeDialog: Dialog.');
				$mdDialog.hide();
			} else {
				console.log('[rpFeedbackFormCtrl] closeDialog: $window.history.length: ' + $window.history.length);

				if ($window.history.length > 1) {
					$window.history.back();

				} else {
					rpAppLocationService(null, '/', '', true, false);
				}

			}

		};
	}

})();