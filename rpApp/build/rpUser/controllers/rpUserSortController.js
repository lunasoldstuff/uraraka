'use strict';

(function () {
	'use strict';

	angular.module('rpUser').controller('rpUserSortCtrl', ['$scope', '$rootScope', '$routeParams', rpUserSortCtrl]);

	function rpUserSortCtrl($scope, $rootScope, $routeParams) {

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function () {
			console.log('[rpUserSortCtrl] onRouteChangeSuccess, $routeParams: ' + JSON.stringify($routeParams));
			$scope.userSort = $routeParams.sort || 'new';
		});

		$scope.selectSort = function (value) {
			console.log('[rpUserSortCtrl] selectSort()');
			$rootScope.$emit('user_sort_click', value);
		};

		$scope.$on('$destroy', function () {
			deregisterRouteChangeSuccess();
		});
	}
})();