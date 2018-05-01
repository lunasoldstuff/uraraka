(function () {
  'use strict';

  function rpMediaImgurAlbumWrapper() {
    return {

      restrict: 'C',

      link: function (scope, element, attrs) {
        var deregisterAlbumImageChanged;

        element.children('img')
          .load(function () {
            element.children('.rp-media-imgur-album-progress')
              .hide();
          });

        deregisterAlbumImageChanged = scope.$on('rp_album_image_changed', function () {
          element.children('.rp-media-imgur-album-progress')
            .show();
        });

        scope.$on('$destroy', function () {
          deregisterAlbumImageChanged();
        });
      }
    };
  }

  angular.module('rpMediaImgurAlbum')
    .directive('rpMediaImgurAlbumWrapper', [rpMediaImgurAlbumWrapper]);
}());
