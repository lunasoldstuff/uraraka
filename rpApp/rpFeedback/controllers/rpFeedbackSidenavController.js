(function() {
	'use strict';
	angular.module('rpFeedback').controller('rpFeedbackSidenavCtrl', [
		'$scope',
		'$mdDialog',
		'rpAppSettingsService',
		'rpAppLocationService',
		'rpAppAuthService',
		'rpToastService',
		'rpAppIsMobileViewService',
		rpFeedbackSidenavCtrl
	]);

	function rpFeedbackSidenavCtrl(
		$scope,
		$mdDialog,
		rpAppSettingsService,
		rpAppLocationService,
		rpAppAuthService,
		rpToastService,
		rpAppIsMobileViewService
	) {

		console.log('[rpFeedbackSidenavCtrl] load');

		$scope.showFeedback = function(e) {
			console.log('[rpFeedbackSidenavCtrl] showFeedback()');
			// if (rpAppAuthService.isAuthenticated) {

			if ((rpAppSettingsService.settings.submitDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
				$mdDialog.show({
					controller: 'rpFeedbackDialogCtrl',
					templateUrl: 'rpFeedback/views/rpFeedbackDialog.html',
					targetEvent: e,
					clickOutsideToClose: false,
					escapeToClose: false,
				});

			} else {
				rpAppLocationService(e, '/feedback', '', true, false);
			}
			// } else {
			//     rpToastService("you must log in to submit feedback", "sentiment_neutral");
			// }

		};
	}

})();