(function () {
  'use strict';

  function rpAppGoogleUrlService(rpAppGoogleUrlResourceService) {
    return function (longUrl, callback) {
      console.log('[rpAppGoogleUrlService] longUrl: ' + longUrl);
      rpAppGoogleUrlResourceService.save({
        longUrl: longUrl
      }, function (data) {
        if (data instanceof Error) {
          callback(data, null);
        } else {
          console.log('[rpAppGoogleUrlService] data: ' + console.log(JSON.stringify(data)));
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpApp')
    .factory('rpAppGoogleUrlService', [
      'rpAppGoogleUrlResourceService',
      rpAppGoogleUrlService
    ]);
}());
