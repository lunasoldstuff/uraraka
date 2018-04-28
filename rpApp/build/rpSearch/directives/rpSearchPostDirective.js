'use strict';

(function () {
	'use strict';

	angular.module('rpSearch').directive('rpSearchPost', [rpSearchPost]);

	function rpSearchPost() {
		return {
			restrict: 'E',
			templateUrl: 'rpSearch/views/rpSearchPost.html'
		};
	}
})();