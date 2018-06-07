(function () {
  'use strict';

  function rpMediaImgurAlbum() {
    return {
      restrict: 'E',
      templateUrl: 'rpMedia/rpMediaImgurAlbum/views/rpMediaImgurAlbum.html',
      controller: 'rpMediaImgurAlbumCtrl'
    };
  }

  angular.module('rpMediaImgurAlbum')
    .directive('rpMediaImgurAlbum', [rpMediaImgurAlbum]);
}());
