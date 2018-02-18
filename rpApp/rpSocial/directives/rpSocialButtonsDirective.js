(function() {
	'use strict';
	angular.module('rpSocial').directive('rpSocialButtons', [rpSocialButtons]);

	function rpSocialButtons() {
		return {
			restrict: 'E',
			templateUrl: 'rpSocial/views/rpSocialButtons.html'
		};
	}
})();