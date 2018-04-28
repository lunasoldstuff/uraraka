(function() {
	'use strict';
	angular.module('rpShare').directive('rpShareButton', [rpShareButton]);

	function rpShareButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpShare/views/rpShareButton.html',
			controller: 'rpShareButtonCtrl',
			scope: {
				post: '='
			}
		};
	}
})();