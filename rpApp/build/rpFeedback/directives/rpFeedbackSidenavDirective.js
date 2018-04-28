'use strict';

(function () {
	'use strict';

	angular.module('rpFeedback').directive('rpFeedbackSidenav', [rpFeedbackSidenav]);

	function rpFeedbackSidenav() {
		return {
			restrict: 'E',
			templateUrl: 'rpFeedback/views/rpFeedbackSidenav.html',
			controller: 'rpFeedbackSidenavCtrl'
		};
	}
})();