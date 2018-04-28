'use strict';

(function () {
	'use strict';

	angular.module('rpHide').directive('rpHideButtonMenu', rpHideButtonMenu);

	function rpHideButtonMenu() {
		return {
			restrict: 'E',
			templateUrl: 'rpHide/views/rpHideButtonMenu.html',
			controller: 'rpHideButtonCtrl',
			scope: {
				parentCtrl: '=',
				isHidden: '=',
				redditId: "="

			}

		};
	}
})();