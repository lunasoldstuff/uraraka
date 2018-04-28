'use strict';

(function () {
	'use strict';

	angular.module('rpSubmit').directive('rpSubmitText', [rpSubmitText]);

	function rpSubmitText() {
		return {
			restrict: 'C',
			templateUrl: 'rpSubmit/views/rpSubmitText.html',
			controller: 'rpSubmitCtrl'
		};
	}
})();