(function() {
	'use strict';
	angular.module('rpMediaImgurAlbum').directive('rpMediaImgurAlbumPanelProgress', [
		'$rootScope',
		'$timeout',
		rpMediaImgurAlbumPanelProgress
	]);

	function rpMediaImgurAlbumPanelProgress($rootScope, $timeout) {
		return {

			restrict: 'A',

			link: function(scope, element, attrs) {

				console.log('[rpMediaImagePanelWrapper]');

				element.children('img').load(function() {
					console.log('[rpMediaImagePanelWrapper] hide progress');
					element.children('.rp-media-imgur-album-progress').hide();
					$timeout(function() {
						element.children('img').show();
						element.children('.rp-media-imgur-album-panel-button').show();
						element.children('.rp-media-imgur-album-panel-details').show();

					}, 100);

				});

				var deregisterAlbumPanelImageChanged = $rootScope.$on('rp_album_panel_image_changed', function() {
					// var deregisterAlbumPanelImageChanged = $rootScope.$on('rp_media_album_image_changed', function () {
					console.log('[rpMediaImagePanelWrapper] show progress');
					element.children('.rp-media-imgur-album-progress').show();
					element.children('.rp-media-imgur-album-panel-details').hide();
					element.children('img').hide();
					element.children('.rp-media-imgur-album-panel-button').hide();
				});

				scope.$on('$destroy', function() {
					deregisterAlbumPanelImageChanged();
				});

			}
		};
	}

})();