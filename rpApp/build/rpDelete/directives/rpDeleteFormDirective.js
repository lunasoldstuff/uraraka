'use strict';

(function () {
	'use strict';

	angular.module('rpDelete').directive('rpDeleteForm', rpDeleteForm);

	function rpDeleteForm() {
		return {
			restrict: 'E',
			templateUrl: 'rpDelete/views/rpDeleteForm.html',
			controller: 'rpDeleteFormCtrl',
			scope: {
				redditId: '=',
				parentCtrl: '=',
				isComment: '='
			}
		};
	}
})();