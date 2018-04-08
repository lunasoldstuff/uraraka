(function() {
	'use strict';
	angular.module('rpApp').factory('rpAppRedditApiService', [
		'$window',
		'$timeout',
		'rpAppRefreshTokenResourceService',
		'rpAppAuthService',
		'rpAppRedditApiResourceService',
		'rpAppEnvResourceService',
		'rpAppUserAgentService',
		rpAppRedditApiService
	]);

	function rpAppRedditApiService(
		$window,
		$timeout,
		rpUserRefreshTokenResourceService,
		rpAppAuthService,
		rpAppRedditApiResourceService,
		rpAppEnvResourceService,
		rpAppUserAgentService

	) {
		//TODO: Need to implement request queueing
		var Snoocore = $window.Snoocore;
		var when = $window.when;
		var rpAppRedditApiService = {};
		// var redditServer;
		// var redditUser;
		var refreshTimeout = 59 * 60 * 1000;
		// var refreshTimeout = 6000;
		var callbacks = [];
		var gettingInstance = false;
		var reddit;

		var userAgent = rpAppUserAgentService.userAgent;

		rpAppRedditApiService.redditRequest = function(method, uri, params, callback) {
			console.log('[rpAppRedditApiService] redditRequest, method: ' + method +
				', uri: ' + uri + ', params: ' + JSON.stringify(params));

			console.log('[rpAppRedditApiService] userAgent: ' + userAgent);
			console.log('[rpAppRedditApiService] roUserAgentUtilService.isGoogleBot: ' + rpAppUserAgentService.isGoogleBot);

			//If the user agent is a Google Crawler use the server's api to fulfill the request.
			if (rpAppUserAgentService.isGoogleBot) {
				console.log('[rpAppRedditApiService] Googlebot detected, use server request');
				genericServerRequest(uri, params, method, callback);
			} else {
				console.log('[rpAppRedditApiService] use client request');
				getInstance(function(reddit) {


					reddit(uri)[method](params).then(function(data) {

							// throw new Error();
							console.log('[rpAppRedditApiService] client request successful, typeof data: ' + typeof data);
							// console.log('[rpAppRedditApiService] client request successful, data: ' + JSON.stringify(data));
							callback(data);
						})


						//will have to handle random page here and return the error instead of making server request.

						/*
							The client request has failed so fallback to making a server request through the api
							'generic' endpoint.

							pass it just the uri, params and request method and it will be able to make any request on the
							server using the correct snoocore object.

							special care must be taken for edge cases that return different data, captchas that return
							differently formatted json and random page request that will error but the error must be returned
							to the post controller to handle loading the random page correctly.
						 */

						.catch(function(responseError) {
							console.log('[rpAppRedditApiService] client request has failed... fallback to generic server reqest...');
							console.log('[rpAppRedditApiService] responseError: ' + JSON.stringify(responseError));

							// no need because we will attempt a server request before returning to the controller
							// if an error occurs on the server a properly formatted error object will be returned by the
							// server api error handler.
							// responseError.responseError = true;

							genericServerRequest(uri, params, method, callback);


						});

				});

			}
		};

		function genericServerRequest(uri, params, method, callback) {
			console.log('[rpAppRedditApiService] genericServerRequest, method: ' + method +
				', uri: ' + uri + ', params: ' + JSON.stringify(params));

			rpAppRedditApiResourceService.save({
				uri: uri,
				params: params,
				method: method
			}, function(data) {
				// console.log('[rpAppRedditApiService] server request has returned. data: ' + JSON.stringify(data));
				console.log('[rpAppRedditApiService] server request has returned. data.responseError: ' + data.responseError);
				/*
					Just return data, error handling will be taken care of in the controller.
				 */

				if (data.responseError) {
					callback(data);
				} else {
					callback(data.transportWrapper);
				}

			});
		}

		function getInstance(callback) {
			console.log('[rpAppRedditApiService] getInstance');

			if (reddit !== undefined) {
				callback(reddit);
			} else {

				console.log('[rpAppRedditApiService] no instance, requesting new one, adding callback to queue');

				callbacks.push(callback);

				if (gettingInstance === false) {
					console.log('[rpAppRedditApiService] attempt to get user refresh token... ');

					gettingInstance = true;

					if (rpAppAuthService.isAuthenticated) {
						rpUserRefreshTokenResourceService.get({}, function(data) {
							console.log('[rpAppRedditApiService] getUserRefreshToken, data: ' + JSON.stringify(data));

							reddit = new Snoocore(data.config);
							console.log('[rpAppRedditApiService] token received, instance created');

							//TODO ERROR HANDLING of this responseError
							reddit.refresh(data.refreshToken).then(function(responseError) {
								executeCallbackQueue(reddit, callbacks);
							});

						});

					} else { //Application only OAuth.
						rpAppEnvResourceService.get({}, function(data) {
							console.log('[rpAppRedditApiService] getAppEnvResourceService, data: ' + JSON.stringify(data));

							reddit = new Snoocore(data.config);
							executeCallbackQueue(reddit, callbacks);

						});
					}
				}
			}
		}

		function executeCallbackQueue(reddit, callbacks) {
			console.log('[rpAppRedditApiService] executeCallbackQueue(), callbacks.length: ' + callbacks.length);
			gettingInstance = false;

			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i](reddit);
			}

			callbacks = [];
		}



		return rpAppRedditApiService;

	}

})();