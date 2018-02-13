(function() {
	'use strict';
	angular.module('rpMediaRedditUpload').controller('rpMediaRedditUploadCtrl', [
		'$scope',
		'$filter',
		rpMediaRedditUploadCtrl
	]);

	function rpMediaRedditUploadCtrl($scope, $filter) {
		//reddit image upload urls have extra 'amp;' garbage in the url, just need to remove it.
		$scope.imageUrl = $filter('rp_remove_amp')($scope.url);
	}

})();