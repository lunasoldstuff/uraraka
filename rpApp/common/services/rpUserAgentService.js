(function() {
	'use strict';

	angular.module('rpApp').factory('rpUserAgentService', rpUserAgentService);

	function rpUserAgentService($rootScope) {
		console.log('[rpUserAgentService] userAgent');
		var rpUserAgentService = {};

		var googleBotRe = /googlebot/i;

		rpUserAgentService.setUserAgent = function(userAgent) {
			rpUserAgentService.userAgent = userAgent;
			console.log('[rpUserAgentService] setUserAgent() userAgent: ' + rpUserAgentService.userAgent);
			console.log('[rpUserAgentService] setUserAgent() googleBotRe.test(userAgent): ' + googleBotRe.test(userAgent));

			rpUserAgentService.isGoogleBot = googleBotRe.test(userAgent);
			console.log('[rpUserUtilService] rpUserAgentService.isGoogleBot: ' + rpUserAgentService.isGoogleBot);

			//nothing listens to this
			// $rootScope.$emit('rp_user_agent_updated');
		};

		return rpUserAgentService;
	}
})();