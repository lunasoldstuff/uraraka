'use strict';

var rpRedditApiServices = angular.module('rpRedditApiServices', []);

rpRedditApiServices.factory('rpRedditApiServerResourceService', ['$resource',
    function($resource) {
        return $resource('/api/generic');
    }
]);

//TODO: Need to implement request queueing
rpRedditApiServices.factory('rpRedditApiService', ['$window', '$timeout', 'rpServerRefreshTokenResourceService', 'rpUserRefreshTokenResourceService', 'rpAuthUtilService', 'rpRedditApiServerResourceService',
    function($window, $timeout, rpServerRefreshTokenResourceService, rpUserRefreshTokenResourceService, rpAuthUtilService, rpRedditApiServerResourceService) {
        var Snoocore = $window.Snoocore;
        var when = $window.when;
        var rpRedditApiService = {};
        // var redditServer;
        // var redditUser;
        var refreshTimeout = 59 * 60 * 1000;
        // var refreshTimeout = 6000;
        var callbacks = [];
        var gettingInstance = false;
        var reddit;

        rpRedditApiService.redditRequest = function(method, uri, params, callback) {
            console.log('[rpRedditApiService] redditRequest, method: ' + method +
                ', uri: ' + uri + ', params: ' + JSON.stringify(params));

            getInstance(function(reddit) {


                reddit(uri)[method](params).then(function(data) {

                    // throw new Error();

                    console.log('[rpRedditApiService] client request successful');
                    console.log('[rpRedditApiService] client request successful, typeof data: ' + typeof data);
                    // console.log('[rpRedditApiService] client request successful, data: ' + JSON.stringify(data));
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
                    console.log('[rpRedditApiService] client request has failed... fallback to generic server reqest...');
                    console.log('[rpRedditApiService] responseError: ' + JSON.stringify(responseError));

                    // no need because we will attempt a server request before returning to the controller
                    // if an error occurs on the server a properly formatted error object will be returned by the
                    // server api error handler.
                    // responseError.responseError = true;

                    rpRedditApiServerResourceService.save({
                        uri: uri,
                        params: params,
                        method: method
                    }, function(data) {

                        // console.log('[rpRedditApiService] server request has returned. data: ' + JSON.stringify(data));
                        // console.log('[rpRedditApiService] server request has returned. data: ' + JSON.stringify(data));
                        console.log('[rpRedditApiService] server request has returned. data.responseError: ' + data.responseError);
                        /*
                        	Just return data, error handling will be taken care of in the controller.
                         */

                        if (data.responseError) {
                            callback(data);
                        } else {
                            callback(data.transportWrapper);
                        }

                    });

                    // don't return the error to the controller unless it has failed both the client request and the
                    // server request.
                    // callback(responseError, null);

                });
            });

        };

        function getInstance(callback) {
            console.log('[rpRedditApiService] getInstance');

            if (reddit !== undefined) {
                callback(reddit);
            } else {

                console.log('[rpRedditApiService] no instance, requesting new one, adding callback to queue');

                callbacks.push(callback);

                if (gettingInstance === false) {
                    console.log('[rpRedditApiService] attempt to get user refresh token... ');

                    gettingInstance = true;

                    var refreshTokenResourceService;
                    var config;

                    if (rpAuthUtilService.isAuthenticated) {
                        refreshTokenResourceService = rpUserRefreshTokenResourceService;
                        config = userConfig;
                    } else {
                        refreshTokenResourceService = rpServerRefreshTokenResourceService;
                        config = serverConfig;
                    }

                    refreshTokenResourceService.get({}, function(data) {
                        console.log('[rpRedditApiService] getUserRefreshToken, data: ' + JSON.stringify(data));

                        reddit = new Snoocore(config[data.env]);
                        console.log('[rpRedditApiService] token received, instance created');

                        refreshAccessToken(data.refreshToken, function(responseError) {
                            if (responseError) {
                                console.log('[rpRedditApiService] error refreshing reddit obj, error: ' + responseError);
                                callback(responseError);
                            } else {
                                console.log('[rpRedditApiService] calling callbacks');
                                gettingInstance = false;

                                for (var i = 0; i < callbacks.length; i++) {
                                    callbacks[i](reddit);
                                }

                                callbacks = [];

                            }
                        });

                    });

                }

            }

        }


        function refreshAccessToken(refreshToken, callback) {

            console.log('[rpRedditApiService] refreshAccessToken, refreshTimeout: ' + refreshTimeout);

            reddit.refresh(refreshToken).then(function() {

                $timeout(refreshAccessToken, refreshTimeout, true, refreshToken, function(responseError) {
                    if (responseError) {
                        callback(responseError);
                    }
                });

                callback();

            }).catch(function(responseError) {
                responseError.responseError = true;
                callback(responseError);
            });

        }

        var userConfig = {

            development: {
                "userAgent": "paper for reddit: reddit material design",
                "oauth": {
                    "type": "explicit",
                    "duration": "permanent",
                    "key": "Gpy69vUdPU_-MA",
                    "secret": "zlcuxzzwfexoVKpYatn_1lfZslI",
                    "redirectUri": "http://localhost:3000/auth/reddit/callback",
                    "scope": [
                        "identity",
                        "edit",
                        "flair",
                        "history",
                        "mysubreddits",
                        "privatemessages",
                        "read",
                        "report",
                        "save",
                        "submit",
                        "subscribe",
                        "vote",
                        "creddits"
                    ]
                }
            },

            demo: {
                "userAgent": "paper for reddit: reddit material design",
                "oauth": {
                    "type": "explicit",
                    "duration": "permanent",
                    "key": "mxKozRXrp3xAIg",
                    "secret": "wYJ0AUzbKUjgMbVlzXO5KzHzpVo",
                    "redirectUri": "http://www.reddup.co/auth/reddit/callback",
                    "scope": [
                        "identity",
                        "edit",
                        "flair",
                        "history",
                        "mysubreddits",
                        "privatemessages",
                        "read",
                        "report",
                        "save",
                        "submit",
                        "subscribe",
                        "vote",
                        "creddits"
                    ]
                }
            },

            production: {
                "userAgent": "paper for reddit: reddit material design",
                "oauth": {
                    "type": "explicit",
                    "duration": "permanent",
                    "key": "mxKozRXrp3xAIg",
                    "secret": "wYJ0AUzbKUjgMbVlzXO5KzHzpVo",
                    "redirectUri": "http://www.reddup.co/auth/reddit/callback",
                    "scope": [
                        "identity",
                        "edit",
                        "flair",
                        "history",
                        "mysubreddits",
                        "privatemessages",
                        "read",
                        "report",
                        "save",
                        "submit",
                        "subscribe",
                        "vote",
                        "creddits"
                    ]
                }
            }
        };



        var serverConfig = {
            development: {
                "userAgent": "paper for reddit: reddit material design",
                "oauth": {
                    "type": "explicit",
                    "duration": "permanent",
                    "key": "uo6XXqf-WF43Wg",
                    "secret": "_cgKzeyu52HPSMrCFcxkXdPXS04",
                    "redirectUri": "http://localhost:3000/auth/reddit/appcallback",
                    "scope": [
                        "identity",
                        "edit",
                        "flair",
                        "history",
                        "mysubreddits",
                        "privatemessages",
                        "read",
                        "report",
                        "save",
                        "submit",
                        "subscribe",
                        "vote",
                        "creddits"
                    ]
                }
            },
            demo: {
                "userAgent": "paper for reddit: reddit material design",
                "oauth": {
                    "type": "explicit",
                    "duration": "permanent",
                    "key": "uo6XXqf-WF43Wg",
                    "secret": "_cgKzeyu52HPSMrCFcxkXdPXS04",
                    "redirectUri": "http://www.reddup.co/auth/reddit/appcallback",
                    "scope": [
                        "identity",
                        "edit",
                        "flair",
                        "history",
                        "mysubreddits",
                        "privatemessages",
                        "read",
                        "report",
                        "save",
                        "submit",
                        "subscribe",
                        "vote",
                        "creddits"
                    ]
                }
            },

            production: {
                "userAgent": "paper for reddit: reddit material design",
                "oauth": {
                    "type": "explicit",
                    "duration": "permanent",
                    "key": "uo6XXqf-WF43Wg",
                    "secret": "_cgKzeyu52HPSMrCFcxkXdPXS04",
                    "redirectUri": "http://www.reddup.co/auth/reddit/appcallback",
                    "scope": [
                        "identity",
                        "edit",
                        "flair",
                        "history",
                        "mysubreddits",
                        "privatemessages",
                        "read",
                        "report",
                        "save",
                        "submit",
                        "subscribe",
                        "vote",
                        "creddits"
                    ]
                }
            }
        };


        return rpRedditApiService;

    }
]);