(function () {
  'use strict';


  function rpDeleteService(rpAppAuthService, rpToastService, rpAppRedditApiService) {
    return function (name, type, callback) {
      var deleteEndpoint = (type === 'message') ? '/api/del_msg' : '/api/del';
      console.log('[rpDeleteService] name: ' + name);
      console.log('[rpDeleteService] type: ' + type);

      rpAppRedditApiService.redditRequest('post', deleteEndpoint, {
        id: name
      }, function (data) {
        if (data.responseError) {
          rpToastService('something went wrong trying to delete your post', 'sentiment_dissatisfied');
          callback(data, null);
        } else {
          rpToastService('post deleted', 'sentiment_satisfied');
          callback(null, data);
        }
      });
    };
  }

  angular.module('rpDelete')
    .factory('rpDeleteService', [
      'rpAppAuthService',
      'rpToastService',
      'rpAppRedditApiService',
      rpDeleteService
    ]);
}());
