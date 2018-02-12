(function() {
	'use strict';
	angular.module('rpEdit').directive('rpEditForm', rpEditForm);

	function rpEditForm() {
		return {
			restrict: 'E',
			templateUrl: 'rpEditForm.html',
			controller: 'rpEditFormCtrl',
			scope: {
				redditId: '=',
				parentCtrl: '=',
				editText: '='

			}
		};
	}
})();