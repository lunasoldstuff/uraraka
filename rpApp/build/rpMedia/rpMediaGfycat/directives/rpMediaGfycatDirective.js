'use strict';

(function () {
	'use strict';

	angular.module('rpMediaGfycat').directive('rpMediaGfycat', [rpMediaGfycat]);

	function rpMediaGfycat() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaGfycat/views/rpMediaGfycat.html',
			controller: 'rpMediaGfycatCtrl'
		};
	}
})();