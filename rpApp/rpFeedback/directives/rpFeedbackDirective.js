(function() {
	'use strict';
	angular.module('rpFeedback').directive('rpFeedback', rpFeedback);

	function rpFeedback() {

		return {
			restrict: 'C',
			templateUrl: 'rpFeedback.html',
			controller: 'rpFeedbackCtrl'
		};

	}

})();