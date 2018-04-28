'use strict';

(function () {
	'use strict';

	angular.module('rpEdit').directive('rpEditButton', rpEditButton);

	function rpEditButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpEdit/views/rpEditButton.html',
			controller: 'rpEditButtonCtrl',
			scope: {
				parentCtrl: '='

			}

		};
	}
})();