'use strict';

(function () {
	'use strict';

	angular.module('rpFeedback').factory('rpFeedbackResourceService', ['$resource', rpFeedbackResourceService]);

	function rpFeedbackResourceService($resource) {
		return $resource('/mail/feedback');
	}
})();