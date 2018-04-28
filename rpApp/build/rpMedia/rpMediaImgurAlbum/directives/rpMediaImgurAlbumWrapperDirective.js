'use strict';

(function () {
	'use strict';

	angular.module('rpMediaImgurAlbum').directive('rpMediaImgurAlbumWrapper', [rpMediaImgurAlbumWrapper]);

	function rpMediaImgurAlbumWrapper() {
		return {

			restrict: 'C',

			link: function link(scope, element, attrs) {

				element.children('img').load(function () {
					element.children('.rp-media-imgur-album-progress').hide();
				});

				var deregisterAlbumImageChanged = scope.$on('rp_album_image_changed', function () {
					element.children('.rp-media-imgur-album-progress').show();
				});

				scope.$on('$destroy', function () {
					deregisterAlbumImageChanged();
				});
			}
		};
	}
})();