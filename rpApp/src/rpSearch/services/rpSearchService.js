(function () {
  'use strict';

  function rpSearchService($rootScope, rpAppLocationService, rpToastService, rpRedditRequestService) {
    return {
      params: {
        q: '',
        sub: 'all',
        type: 'link',
        sort: 'relevance',
        t: 'all',
        after: '',
        limit: 8
      },

      search(callback) {
        console.log('[rpSearchService] search() rpSearchService.params: ' + JSON.stringify(this.params));

        if (this.params.q) {
          rpRedditRequestService.redditRequest('get', '/r/$sub/search', {
            $sub: this.params.sub,
            q: this.params.q,
            limit: this.params.limit,
            after: this.params.after,
            before: '',
            restrict_sr: this.params.restrict_sr,
            sort: this.params.sort,
            t: this.params.t,
            type: this.params.type

          }, function (data) {
            // console.log(`[rpSearchService()] data: ${JSON.stringify(data)}`);
            if (data.responseError) {
              rpToastService('something went wrong with your search request', 'sentiment_dissatisfied');
              callback(data, null);
            } else {
              callback(null, data);
            }
          });
        } else {
          callback(null, null);
        }
      }
    };
  }

  angular.module('rpSearch')
    .factory('rpSearchService', [
      '$rootScope',
      'rpAppLocationService',
      'rpToastService',
      'rpRedditRequestService',
      rpSearchService
    ]);
}());
