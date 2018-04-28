(function() {
	'use strict';
	angular.module('rpShare').controller('rpShareEmailFormCtrl', [
		'$scope',
		'$timeout',
		'$mdDialog',
		'$window',
		'rpShareEmailService',
		'rpAppLocationService',
		rpShareEmailFormCtrl
	]);

	function rpShareEmailFormCtrl(
		$scope,
		$timeout,
		$mdDialog,
		$window,
		rpShareEmailService,
		rpAppLocationService
	) {

		console.log('[rpShareEmailFormCtrl]');

		$scope.showAnother = false;
		$scope.showButtons = true;
		$scope.showSubmit = true;
		$scope.showFeedback = false;
		$scope.feedbackMessage = "";
		$scope.showFeedbackAlert = false;

		function resetForm() {
			$scope.to = "";
			$scope.optionalMessage = "";
			$scope.showAnother = false;
			$scope.showButtons = true;
			$scope.showSubmit = true;
			$scope.showFeedback = false;
			$scope.feedbackMessage = "";
			$scope.showFeedbackAlert = false;
			angular.element('#share-to').focus();
		}

		$scope.submitForm = function() {

			$scope.showProgress = true;
			$scope.showButtons = false;
			$scope.showFeedback = false;
			$scope.feedbackMessage = "";
			$scope.showFeedbackAlert = false;
			$scope.showFeedbackSuccess = false;

			console.log('[rpShareEmailCtrl] $scope.to: ' + $scope.to);
			console.log('[rpShareEmailCtrl] $scope.shareTitle: ' + $scope.shareTitle);
			console.log('[rpShareEmailCtrl] $scope.shareLink: ' + $scope.shareLink);
			console.log('[rpShareEmailCtrl] $scope.identity.name: ' + $scope.identity.name);
			console.log('[rpShareEmailCtrl] $scope.optionalMessage: ' + $scope.optionalMessage);

			rpShareEmailService($scope.to, $scope.shareTitle, $scope.shareLink, $scope.identity.name, $scope.optionalMessage, function(err, data) {


				if (err) {
					console.log('[rpShareEmailFormCtrl] err');
					console.log('[rpShareEmailFormCtrl] err: ' + JSON.stringify(err));

					$scope.showFeedback = true;
					$scope.showFeedbackAlert = true;
					$scope.showProgress = false;
					$scope.showButtons = true;

					//Cutom Feedback messages based on error type.
					//handle recepient email address incorrect
					if (err.data.message.indexOf('Illegal email address') !== -1) {
						$scope.feedbackMessage = "Please check the email address provided";
					} else {
						$scope.feedbackMessage = "Something went wrong sending your email";
					}

				} else {
					$scope.feedbackMessage = "Email sent";
					$scope.showFeedbackSuccess = true;
					$scope.showFeedback = true;
					$scope.showProgress = false;
					$scope.showAnother = true;
					$scope.showSubmit = false;
					$scope.showButtons = true;
					//$timeout(angular.noop, 0);


				}

			});

		};

		$scope.resetForm = function() {
			resetForm();
		};

		$scope.closeDialog = function(e) {

			if ($scope.dialog) {
				console.log('[rpMessageComposeFormCtrl] closeDialog: Dialog.');
				$mdDialog.hide();
			} else {
				if ($window.history.length > 1) {
					$window.history.back();

				} else {
					rpAppLocationService(null, '/', '', true, false);
				}

			}

		};
	}

})();