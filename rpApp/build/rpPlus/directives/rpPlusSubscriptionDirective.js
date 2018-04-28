'use strict';

(function () {
	'use strict';

	angular.module('rpPlus').directive('rpPlusSubscription', [rpPlusSubscription]);

	function rpPlusSubscription() {
		return {
			restrict: 'E',
			templateUrl: 'rpPlus/views/rpPlusSubscription.html',
			controller: 'rpPlusSubscriptionCtrl'
		};
	}
})();