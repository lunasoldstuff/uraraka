(function () {
  'use strict';

  function rpMediaImgurAlbumResourceService($resource) {
    return $resource('https://api.imgur.com/3/album/:id', {}, {
      get: {
        headers: {
          Authorization: 'Client-ID a912803498adcd4'
        }
      }
    });
  }

  angular.module('rpMedia')
    .factory('rpMediaImgurAlbumResourceService', [
      '$resource',
      rpMediaImgurAlbumResourceService
    ]);
}());
