(function() {
	'use strict';
	angular.module('rpShare').factory('rpShareEmailService', [
		'rpShareEmailResourceService',
		'rpToastService',
		rpShareEmailService
	]);

	function rpShareEmailService(rpShareEmailResourceService, rpToastService) {

		return function(to, shareTitle, shareLink, name, optionalMessage, callback) {

			rpShareEmailResourceService.save({
				to: to,
				shareTitle: shareTitle,
				shareLink: shareLink,
				name: name,
				optionalMessage: optionalMessage
			}, function(data) {
				rpToastService("email sent", "sentiment_satisfied");
				callback(null, data);

			}, function(error) {
				rpToastService("something went wrong trying to send your email", "sentiment_dissatisfied");
				callback(error);
			});

		};

	}
})();