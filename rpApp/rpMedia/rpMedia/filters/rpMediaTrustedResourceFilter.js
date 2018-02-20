(function() {
	'use strict';
	angular.module('rpMedia').filter('rpMediaTrustedResourceFilter', [
		'$sce',
		rpMediaTrustedResourceFilter
	]);

	function rpMediaTrustedResourceFilter($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	}
})();