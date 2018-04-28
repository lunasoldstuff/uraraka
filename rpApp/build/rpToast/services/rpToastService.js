'use strict';

(function () {
	'use strict';

	angular.module('rpToast').factory('rpToastService', ['$mdToast', rpToastService]);

	function rpToastService($mdToast) {
		return function (message, icon) {
			$mdToast.show({
				locals: {
					toastMessage: message,
					toastIcon: icon
				},
				controller: 'rpToastCtrl',
				templateUrl: 'rpToast/views/rpToast.html',
				hideDelay: 2500,
				position: "bottom left"
			});
		};
	}
})();