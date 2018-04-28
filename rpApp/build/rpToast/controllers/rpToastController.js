'use strict';

(function () {
	'use strict';

	angular.module('rpToast').controller('rpToastCtrl', ['$scope', '$rootScope', '$mdToast', 'toastMessage', 'toastIcon', rpToastCtrl]);

	function rpToastCtrl($scope, $rootScope, $mdToast, toastMessage, toastIcon) {
		$scope.toastMessage = toastMessage;
		$scope.toastIcon = toastIcon;

		$scope.closeToast = function () {
			$mdToast.close();
		};
	}
})();