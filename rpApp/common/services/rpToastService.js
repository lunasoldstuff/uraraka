(function() {
	'use strict';

	angular.module('rpApp').factory('rpToastService', rpToastService);

	function rpToastService($mdToast) {
		return function(message, icon) {
			$mdToast.show({
				locals: {
					toastMessage: message,
					toastIcon: icon
				},
				controller: 'rpToastCtrl',
				templateUrl: 'rpToast.html',
				hideDelay: 2500,
				position: "bottom left",
			});
		};
	}
})();