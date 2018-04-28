'use strict';

(function () {
	'use strict';

	angular.module('rpMediaImgur').directive('rpMediaImgur', [rpMediaImgur]);

	function rpMediaImgur() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaImgur/views/rpMediaImgur.html',
			controller: 'rpMediaImgurCtrl'
		};
	}
})();