'use strict';

(function () {
	'use strict';

	angular.module('rpSave').directive('rpSaveButtonMenu', [rpSaveButtonMenu]);

	function rpSaveButtonMenu() {
		return {
			restrict: 'E',
			templateUrl: 'rpSave/views/rpSaveButtonMenu.html',
			controller: 'rpSaveButtonCtrl',
			scope: {
				redditId: '=',
				saved: '='
			}
		};
	}
})();