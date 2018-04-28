'use strict';

(function () {
	'use strict';

	angular.module('rpLayoutButton').directive('rpLayoutButton', [rpLayoutButton]);

	function rpLayoutButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpLayoutButton/views/rpLayoutButton.html',
			controller: 'rpLayoutButtonCtrl'
		};
	}
})();