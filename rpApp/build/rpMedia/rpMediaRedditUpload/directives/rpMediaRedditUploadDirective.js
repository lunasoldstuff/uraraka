'use strict';

(function () {
	'use strict';

	angular.module('rpMediaRedditUpload').directive('rpMediaRedditUpload', [rpMediaRedditUpload]);

	function rpMediaRedditUpload() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaRedditUpload/views/rpMediaRedditUpload.html',
			controller: 'rpMediaRedditUploadCtrl'
		};
	}
})();