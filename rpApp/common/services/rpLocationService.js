(function() {
	'use strict';

	angular.module('rpApp').factory('rpLocationService', rpLocationService);

	function rpLocationService($location, $window, $route) {
		return function(e, url, search, reload, replace) {

			if (e !== null && e.ctrlKey) {
				url = search ? url + '?' + search : url;

				console.log('[rpLocationService] search: ' + search);
				console.log('[rpLocationService] url: ' + url);

				$window.open(url);

			} else {

				console.log('[rpLocationService] url: ' + url);
				console.log('[rpLocationService] $location.path(): ' + $location.path());
				console.log('[rpLocationService] search: ' + search);
				console.log('[rpLocationService] reload: ' + reload);
				console.log('[rpLocationService] replace: ' + replace);

				if (reload && $location.path() === '/' && url === '/') {
					console.log('[rpLocationService] reload frontpage route.reload()');
					$route.reload();

				}

				$location.search(search);

				$location.path(url, reload);


				if (replace) {
					$location.replace();
				}

			}

		};
	}
})();