(function() {
	'use strict';
	angular.module('rpEdit').directive('rpEditForm', rpEditForm);

	function rpEditForm() {
		return {
			restrict: 'E',
			templateUrl: 'rpEdit/views/rpEditForm.html',
			controller: 'rpEditFormCtrl',
			scope: {
				redditId: '=',
				parentCtrl: '=',
				editText: '='

			}
		};
	}
})();