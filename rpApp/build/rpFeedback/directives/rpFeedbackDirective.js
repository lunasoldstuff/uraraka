'use strict';

(function () {
	'use strict';

	angular.module('rpFeedback').directive('rpFeedback', rpFeedback);

	function rpFeedback() {

		return {
			restrict: 'C',
			templateUrl: 'rpFeedback/views/rpFeedback.html',
			controller: 'rpFeedbackCtrl'
		};
	}
})();