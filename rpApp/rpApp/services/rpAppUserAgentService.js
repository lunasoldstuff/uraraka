(function() {
	'use strict';

	angular.module('rpApp').factory('rpAppUserAgentService', [
		'$rootScope',
		rpAppUserAgentService
	]);

	function rpAppUserAgentService($rootScope) {
		console.log('[rpAppUserAgentService] userAgent');
		var rpAppUserAgentService = {};

		var googleBotRe = /googlebot/i;

		rpAppUserAgentService.setUserAgent = function(userAgent) {
			rpAppUserAgentService.userAgent = userAgent;
			console.log('[rpAppUserAgentService] setUserAgent() userAgent: ' + rpAppUserAgentService.userAgent);
			console.log('[rpAppUserAgentService] setUserAgent() googleBotRe.test(userAgent): ' + googleBotRe.test(userAgent));

			rpAppUserAgentService.isGoogleBot = googleBotRe.test(userAgent);
			console.log('[rpUserUtilService] rpAppUserAgentService.isGoogleBot: ' + rpAppUserAgentService.isGoogleBot);

			//nothing listens to this
			// $rootScope.$emit('rp_user_agent_updated');
		};

		return rpAppUserAgentService;
	}
})();