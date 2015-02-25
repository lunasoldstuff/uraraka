redditPlusApp.config(['$httpProvider', function ($httpProvider) {

    var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', '$log', function ($q, $cacheFactory, $timeout, $rootScope, $log) {

      /**
       * The total number of requests made
       */
      var reqsTotal = 0;

      /**
       * The number of requests completed (either successfully or not)
       */
      var reqsCompleted = 0;

      /**
       * The amount of time spent fetching before showing the loading bar
       */
      var latencyThreshold = 100;

      /**
       * $timeout handle for latencyThreshold
       */
      var startTimeout;

      /**
       * calls cfpLoadingBar.complete() which removes the
       * loading bar from the DOM.
       */
      function setComplete() {
        // $log.log('setComplete()');
        $timeout.cancel(startTimeout);
        // cfpLoadingBar.complete();
        $rootScope.$broadcast('progressComplete');
        reqsCompleted = 0;
        reqsTotal = 0;
      }

      /**
       * Determine if the response has already been cached
       * @param  {Object}  config the config option from the request
       * @return {Boolean} retrns true if cached, otherwise false
       */
      function isCached(config) {
        var cache;
        var defaultCache = $cacheFactory.get('$http');
        var defaults = $httpProvider.defaults;

        // Choose the proper cache source. Borrowed from angular: $http service
        if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === 'GET' || config.method === 'JSONP')) {
            cache = angular.isObject(config.cache) ? config.cache
              : angular.isObject(defaults.cache) ? defaults.cache
              : defaultCache;
        }

        var cached = cache !== undefined ?
          cache.get(config.url) !== undefined : false;

        if (config.cached !== undefined && cached !== config.cached) {
          return config.cached;
        }
        config.cached = cached;
        return cached;
      }


      return {
        'request': function(config) {
          // Check to make sure this request hasn't already been cached and that
          // the requester didn't explicitly ask us to ignore this request:
          // $log.log("REQUEST " + config.url);
          if (!config.ignoreLoadingBar && !isCached(config)) {
            // $rootScope.$broadcast('cfpLoadingBar:loading', {url: config.url});
            $rootScope.$broadcast('progressLoading');
            if (reqsTotal === 0) {
              startTimeout = $timeout(function() {
                $rootScope.$broadcast('progressLoading');
              }, latencyThreshold);
            }
            reqsTotal++;
            // cfpLoadingBar.set(reqsCompleted / reqsTotal);
            $rootScope.$broadcast('progress', {value: reqsCompleted / reqsTotal * 100});
          }
          return config;
        },
        'response': function(response) {
          // $log.log("RESPONSE resCompleted: " + reqsCompleted + ", reqsTotal: " + reqsTotal);
          if (!response || !response.config) {
            return response;
          }

          if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
            reqsCompleted++;
            // $rootScope.$broadcast('cfpLoadingBar:loaded', {url: response.config.url, result: response});
            // $rootScope.$broadcast('progressComplete');
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              // cfpLoadingBar.set(reqsCompleted / reqsTotal);
              $rootScope.$broadcast('progress', {value: reqsCompleted / reqsTotal * 100});
            }
          }
          return response;
        },

        'responseError': function(rejection) {
          if (!rejection || !rejection.config) {
            return $q.reject(rejection);
          }

          if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
            reqsCompleted++;
            $rootScope.$broadcast('cfpLoadingBar:loaded', {url: rejection.config.url, result: rejection});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              $rootScope.$broadcast('progress', {value: reqsCompleted / reqsTotal * 100});
            }
          }
          return $q.reject(rejection);
        }
      };
    }];

    $httpProvider.interceptors.push(interceptor);
  }]);
