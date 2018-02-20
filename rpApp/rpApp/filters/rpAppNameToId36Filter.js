(function() {
	'use strict';
	angular.module('rpApp').filter('rpAppNameToId36Filter', [rpAppNameToId36Filter]);

	function rpAppNameToId36Filter() {
		return function(name) {
			return name.substr(3);
		};
	}
})();