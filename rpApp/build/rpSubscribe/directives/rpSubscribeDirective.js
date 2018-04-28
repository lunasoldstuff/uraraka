'use strict';

(function () {
	'use strict';

	angular.module('rpSubscribe').directive('rpSubscribe', [rpSubscribe]);

	function rpSubscribe() {
		return {
			restrict: 'E',
			templateUrl: 'rpSubscribe/views/rpSubscribe.html',
			controller: 'rpSubscribeCtrl'
		};
	}
})();