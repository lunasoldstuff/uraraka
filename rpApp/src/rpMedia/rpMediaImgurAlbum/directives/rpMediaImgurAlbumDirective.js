(function() {
	'use strict';
	angular.module('rpMediaImgurAlbum').directive('rpMediaImgurAlbum', [rpMediaImgurAlbum]);

	function rpMediaImgurAlbum() {
		return {
			restrict: 'E',
			templateUrl: 'rpMedia/rpMediaImgurAlbum/views/rpMediaImgurAlbum.html',
			controller: 'rpMediaImgurAlbumCtrl'
		};
	}

})();