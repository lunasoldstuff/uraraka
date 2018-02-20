(function() {
	'use strict';
	angular.module('rpMedia').filter('rpMediaRemoveAmpFilter', [rpMediaRemoveAmpFilter]);

	function rpMediaRemoveAmpFilter() {
		return function removeAmp(url) {
			var ampRe = /amp;/g;
			return url.replace(ampRe, '');
		};
	}
})();