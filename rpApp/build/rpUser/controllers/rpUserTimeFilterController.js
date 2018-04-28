'use strict';

(function () {
	'use strict';

	angular.module('rpUser').controller('rpUserTimeFilterCtrl', ['$scope', '$rootScope', '$routeParams', rpUserTimeFilterCtrl]);

	function rpUserTimeFilterCtrl($scope, $rootScope, $routeParams) {

		$scope.userTime = $routeParams.t || 'all';

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function () {
			console.log('[rpUserTimeFilterCtrl] onRouteChangeSuccess, $routeParams: ' + JSON.stringify($routeParams));
			$scope.userTime = $routeParams.t || 'all';
		});

		$scope.selectTime = function (value) {
			console.log('[rpUserTimeFilterCtrl] selectTime()');

			$rootScope.$emit('rp_user_time_click', value);
		};

		$scope.$on('$destroy', function () {
			deregisterRouteChangeSuccess();
		});
	}
})();