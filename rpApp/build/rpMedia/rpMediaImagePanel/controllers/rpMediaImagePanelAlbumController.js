'use strict';

(function () {
	'use strict';

	angular.module('rpMediaImagePanel').controller('rpMediaImagePanelAlbumCtrl', ['$scope', '$rootScope', 'mdPanelRef', 'imageUrl', 'imageTitle', 'imageDescriptionLinky', 'albumCtrl', rpMediaImagePanelAlbumCtrl]);

	function rpMediaImagePanelAlbumCtrl($scope, $rootScope, mdPanelRef, imageUrl, imageTitle, imageDescriptionLinky, albumCtrl) {

		$scope.imageUrl = imageUrl;
		$scope.imageTitle = imageTitle;
		$scope.imageDescriptionLinky = imageDescriptionLinky;

		var deregisterImageChanged = $rootScope.$on('rp_media_album_image_changed', function (e, imageUrl, imageTitle, imageDescriptionLinky) {
			$scope.imageUrl = imageUrl;
			$scope.imageTitle = imageTitle;
			$scope.imageDescriptionLinky = imageDescriptionLinky;
		});

		$scope.next = function (e) {
			console.log('[rpMediaImagePanelAlbumCtrl] next()');
			albumCtrl.next();
			$rootScope.$broadcast('rp_album_panel_image_changed');
		};

		$scope.prev = function (e) {
			console.log('[rpMediaImagePanelAlbumCtrl] prev()');
			albumCtrl.prev();
			$rootScope.$broadcast('rp_album_panel_image_changed');
		};

		$scope.close = function (e) {
			console.log('[rpMediaImagePanelCtrl] close()');

			mdPanelRef.close().then(function () {
				mdPanelRef.destroy();
			});
		};

		$scope.$on('$destroy', function () {
			deregisterImageChanged();
		});
	}
})();