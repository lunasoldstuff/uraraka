(function () {
  'use strict';

  function rpMediaImgurGalleryResourceService($resource) {
    return $resource(' https://api.imgur.com/3/gallery/:id', {}, {
      get: {
        headers: {
          Authorization: 'Client-ID a912803498adcd4'
        }
      }
    });
  }

  angular.module('rpMedia')
    .factory('rpMediaImgurGalleryResourceService', [
      '$resource',
      rpMediaImgurGalleryResourceService
    ]);
}());
