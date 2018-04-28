'use strict';

(function () {
	'use strict';

	angular.module('rpOpenNew').directive('rpOpenNewButtonMenu', [rpOpenNewButtonMenu]);

	function rpOpenNewButtonMenu() {
		return {
			restrict: 'E',
			templateUrl: 'rpOpenNew/views/rpOpenNewButtonMenu.html',
			controller: 'rpOpenNewCtrl',
			scope: {
				post: '=',
				isComment: '='

			}

		};
	}
})();