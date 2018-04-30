(function () {
  'use strict';


  function rpAppUserAgentService($rootScope) {
    console.log('[rpAppUserAgentService] userAgent');
    const GOOGLE_BOT_RE = /googlebot/i;

    return {
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
  }

  angular.module('rpApp')
    .factory('rpAppUserAgentService', [
      '$rootScope',
      rpAppUserAgentService
    ]);
}());
