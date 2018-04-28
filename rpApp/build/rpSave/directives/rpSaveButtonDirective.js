'use strict';

(function () {
	'use strict';

	angular.module('rpSave').directive('rpSaveButton', [rpSaveButton]);

	function rpSaveButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpSave/views/rpSaveButton.html',
			controller: 'rpSaveButtonCtrl',
			scope: {
				redditId: '=',
				saved: '='
			}
		};
	}
})();