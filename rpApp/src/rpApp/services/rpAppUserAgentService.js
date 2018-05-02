(function () {
  'use strict';


  function rpAppUserAgentService($rootScope) {
    const GOOGLE_BOT_RE = /googlebot/i;

    var appUserAgentService = {
      userAgent: '',
      isGoogleBot: false,
      setUserAgent(userAgent) {
        this.userAgent = userAgent;
        console.log('[rpAppUserAgentService] setUserAgent() userAgent: ' + rpAppUserAgentService.userAgent);
        console.log('[rpAppUserAgentService] setUserAgent() GOOGLE_BOT_RE.test(userAgent): ' + GOOGLE_BOT_RE.test(userAgent));

        this.isGoogleBot = GOOGLE_BOT_RE.test(userAgent);
        console.log('[rpUserService] rpAppUserAgentService.isGoogleBot: ' + rpAppUserAgentService.isGoogleBot);
      }

    };

    console.log('[rpAppUserAgentService] userAgent');

    return appUserAgentService;
  }

  angular.module('rpApp')
    .factory('rpAppUserAgentService', [
      '$rootScope',
      rpAppUserAgentService
    ]);
}());
