(function() {
	'use strict';
	angular.module('rpMedia').directive('rpMedia', [rpMedia]);

	function rpMedia() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMedia/views/rpMedia.html',
			controller: 'rpMediaCtrl',
			scope: {
				url: '=',
				post: '=',
				slideshow: '=',
				nsfwOverride: '='
			}
		};
	}

})();