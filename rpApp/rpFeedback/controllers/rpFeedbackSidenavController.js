(function() {
	'use strict';
	angular.module('rpFeedback').controller('rpFeedbackSidenavCtrl', rpFeedbackSidenavCtrl);

	function rpFeedbackSidenavCtrl(
		$scope,
		$mdDialog,
		rpSettingsService,
		rpLocationService,
		rpAuthService,
		rpToastService,
		rpIsMobileViewService
	) {

		console.log('[rpFeedbackSidenavCtrl] load');

		$scope.showFeedback = function(e) {
			console.log('[rpFeedbackSidenavCtrl] showFeedback()');
			// if (rpAuthService.isAuthenticated) {

			if ((rpSettingsService.settings.submitDialog && !e.ctrlKey) || rpIsMobileViewService.isMobileView()) {
				$mdDialog.show({
					controller: 'rpFeedbackDialogCtrl',
					templateUrl: 'rpFeedbackDialog.html',
					targetEvent: e,
					clickOutsideToClose: false,
					escapeToClose: false,
				});

			} else {
				rpLocationService(e, '/feedback', '', true, false);
			}
			// } else {
			//     rpToastService("you must log in to submit feedback", "sentiment_neutral");
			// }

		};
	}

})();