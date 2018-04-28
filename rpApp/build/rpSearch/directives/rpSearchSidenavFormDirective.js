'use strict';

(function () {
	'use strict';

	angular.module('rpSearch').directive('rpSearchSidenavForm', [rpSearchSidenavForm]);

	function rpSearchSidenavForm() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchSidenavForm.html',
			replace: true

		};
	}
})();