(function() {
	'use strict';
	angular.module('rpSubmit').directive('rpSubmitLink', [rpSubmitLink]);

	function rpSubmitLink() {
		return {
			restrict: 'C',
			templateUrl: 'rpSubmit/views/rpSubmitLink.html',
			controller: 'rpSubmitCtrl'
		};
	}
})();