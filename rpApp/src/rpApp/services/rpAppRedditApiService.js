(function () {
  'use strict';

  function rpAppRedditApiService(
    $window,
    $timeout,
    rpAppUserConfigResourceService,
    rpAppAuthService,
    rpAppRedditApiResourceService,
    rpAppGuestConfigResourceService,
    rpAppUserAgentService

  ) {
    // TODO: Need to implement request queueing
    var Snoocore = $window.Snoocore;
    var when = $window.when;
    var refreshTimeout = 59 * 60 * 1000;
    var callbacks = [];
    var gettingInstance = false;
    var reddit;
    var userAgent = rpAppUserAgentService.userAgent;
    // FIXME: Uses 'global' style variable reddit and callback queue

    function genericServerRequest(uri, params, method, callback) {
      console.log('[rpAppRedditApiService] genericServerRequest, method: ' + method +
        ', uri: ' + uri + ', params: ' + JSON.stringify(params));

      rpAppRedditApiResourceService.save({
        uri: uri,
        params: params,
        method: method
      }, function (data) {
        console.log('[rpAppRedditApiService] server request has returned. data.responseError: ' + data.responseError);
        // Just return data, error handling will be taken care of in the controller.
        if (data.responseError) {
          callback(data);
        } else {
          callback(data.transportWrapper);
        }
      });
    }

    // FIXME: yuck
    function executeCallbackQueue() {
      var i;
      gettingInstance = false;
      console.log('[rpAppRedditApiService] executeCallbackQueue(), callbacks.length: ' + callbacks.length);

      for (i = 0; i < callbacks.length; i++) {
        callbacks[i](reddit);
      }

      callbacks = [];
    }

    function getInstance(callback) {
      console.log('[rpAppRedditApiService] getInstance');

      if (angular.isDefined(reddit)) {
        callback(reddit);
      } else {
        console.log('[rpAppRedditApiService] no instance, requesting new one, adding callback to queue');
        callbacks.push(callback);

        if (gettingInstance === false) {
          console.log('[rpAppRedditApiService] attempt to get user refresh token... ');
          gettingInstance = true;

          if (rpAppAuthService.isAuthenticated) {
            rpAppUserConfigResourceService.get({}, function (data) {
              console.log('[rpAppRedditApiService] getUserRefreshToken, data: ' + JSON.stringify(data));

              reddit = new Snoocore(data.config);
              console.log('[rpAppRedditApiService] token received, instance created');

              // TODO ERROR HANDLING of this responseError
              reddit.refresh(data.refreshToken)
                .then(function (responseError) {
                  executeCallbackQueue();
                });
            });
          } else {
            rpAppGuestConfigResourceService.get({}, function (data) {
              console.log('[rpAppRedditApiService] getAppEnvResourceService, data: ' + JSON.stringify(data));
              reddit = new Snoocore(data.config);
              executeCallbackQueue();
            });
          }
        }
      }
    }

    return {
      redditRequest(method, uri, params, callback) {
        console.log('[rpAppRedditApiService] redditRequest, method: ' + method +
          ', uri: ' + uri + ', params: ' + JSON.stringify(params));

        console.log('[rpAppRedditApiService] userAgent: ' + userAgent);
        console.log('[rpAppRedditApiService] roUserAgentUtilService.isGoogleBot: ' + rpAppUserAgentService.isGoogleBot);

        // If the user agent is a Google Crawler use the server's api to fulfill the request.
        if (rpAppUserAgentService.isGoogleBot) {
          console.log('[rpAppRedditApiService] Googlebot detected, use server request');
          genericServerRequest(uri, params, method, callback);
        } else {
          console.log('[rpAppRedditApiService] use client request');
          getInstance(function () {
            reddit(uri)[method](params)
              .then(function (data) {
                console.log('[rpAppRedditApiService] client request successful, typeof data: ' + typeof data);
                callback(data);
              })
              .catch(function (responseError) {
                console.log('[rpAppRedditApiService] client request has failed...');
                console.log('[rpAppRedditApiService] fallback to generic server reqest...');
                console.log('[rpAppRedditApiService] responseError: ' + JSON.stringify(responseError));


                /*
                  The client request has failed so fallback to making a server request through the api
                  'generic' endpoint.

                  pass it just the uri, params and request method and it will be able to make any request on the
                  server using the correct snoocore object.

                  special care must be taken for edge cases that return different data, captchas that return
                  differently formatted json and random page request that will error but the error must be returned
                  to the post controller to handle loading the random page correctly.
                 */

                // if an error occurs on the server a properly formatted error object will be returned by the
                // server api error handler.
                genericServerRequest(uri, params, method, callback);
              });
          });
        }
      }

    };
  }

  angular.module('rpApp')
    .factory('rpAppRedditApiService', [
      '$window',
      '$timeout',
      'rpAppUserConfigResourceService',
      'rpAppAuthService',
      'rpAppRedditApiResourceService',
      'rpAppGuestConfigResourceService',
      'rpAppUserAgentService',
      rpAppRedditApiService
    ]);
}());
