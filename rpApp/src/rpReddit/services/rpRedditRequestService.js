(function () {
  'use strict';

  function rpRedditRequestService(
    $window,
    $timeout,
    rpAppAuthService,
    rpRedditRequestResourceService,
    rpRedditConfigResourceService,
    rpAppUserAgentService

  ) {
    var Snoocore = $window.Snoocore;

    var redditProvider = {
      reddit: null,
      gettingReddit: false,
      initRedditQueue: [],
      initReddit() {
        // Initialize a reddit object with settings from the server.

        // Add requests for a new reddit object to a queue.
        return new Promise((resolve, reject) => {
          console.log('[rpRedditApiService] redditProvider.initReddit()');

          redditProvider.initRedditQueue.push(() => {
            console.log('[rpRedditApiService] redditProvider.initReddit() resolve reddit');
            resolve(redditProvider.reddit);
          });

          // If not getting a reddit object start getting one.
          if (!redditProvider.gettingReddit) {
            console.log('[rpRedditApiService] redditProvider.initReddit() getConfig');
            redditProvider.gettingReddit = true;
            rpRedditConfigResourceService.get({}, (data) => {
              redditProvider.reddit = new Snoocore(data.config);

              if (angular.isDefined(data.refreshToken)) {
                redditProvider.reddit.refresh(data.refreshToken)
                  .then(() => {
                    for (let i = redditProvider.initRedditQueue.length; i--;) {
                      // Once we have a reddit object fulfill the queue.
                      redditProvider.initRedditQueue.pop()();
                    }
                  });
              } else {
                for (let i = redditProvider.initRedditQueue.length; i--;) {
                  redditProvider.initRedditQueue.pop()();
                }
              }
            });
          }
        });
      },

      getReddit() {
        return new Promise((resolve, reject) => {
          console.log('[rpRedditApiService] redditProvider.getReddit()');
          if (redditProvider.reddit === null) {
            redditProvider.initReddit()
              .then(() => {
                resolve(redditProvider.reddit);
              });
          } else {
            resolve(redditProvider.reddit);
          }
        });
      }
    };

    function serverRequest(method, uri, params) {
      return new Promise((resolve, reject) => {
        rpRedditRequestResourceService.save({
          uri: uri,
          params: params,
          method: method
        }, function (data) {
          if (data.responseError) {
            reject(data);
          } else {
            resolve(data.transportWrapper);
          }
        });
      });
    }

    function clientRequest(method, uri, params) {
      return new Promise((resolve, reject) => {
        redditProvider.getReddit()
          .then((reddit) => {
            return reddit(uri)[method](params);
          })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log('[rpRedditApiService] redditRequest client request failed, uri: ' + uri);
            console.log('[rpRedditApiService] redditRequest client request failed err: ' + err.message);
            serverRequest(method, uri, params)
              .then((data) => {
                console.log('[rpRedditApiService] redditRequest server request fulfilled, uri: ' + uri);
                resolve(data);
              })
              .catch((err) => {
                reject(err);
              });
          });
      });
    }

    return {
      redditRequest(method, uri, params, callback) {
        console.log('[rpRedditApiService] redditRequest uri: ' + uri);
        clientRequest(method, uri, params)
          .then((data) => {
            console.log('[rpRedditApiService] redditRequest client request fulfilled, uri: ' + uri);
            callback(data);
          })
          .catch((err) => {
            // FIXME: this will forever catch errors that occur in the callback...
            console.log('[rpRedditApiService] redditRequest error in callback caught here: ' + uri);
            console.log('[rpRedditApiService] redditRequest err: ' + err.message);
            callback(err);
          });
      }
    };
  }

  angular.module('rpApp')
    .factory('rpRedditRequestService', [
      '$window',
      '$timeout',
      'rpAppAuthService',
      'rpRedditRequestResourceService',
      'rpRedditConfigResourceService',
      'rpAppUserAgentService',
      rpRedditRequestService
    ]);
}());
