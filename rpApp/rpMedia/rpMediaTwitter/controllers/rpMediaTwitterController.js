(function() {
	'use strict';
	angular.module('rpMediaTwitter').controller('rpMediaTwitterCtrl', [
		'$scope',
		'$sce',
		'rpTweetResourceService',
		rpMediaTwitterCtrl
	]);

	function rpMediaTwitterCtrl($scope, $sce, rpTweetResourceService) {

		$scope.tweet = "";
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
		var groups = twitterRe.exec($scope.url);

		if (groups) {
			var data = rpTweetResourceService.get({
				id: groups[1]
			}, function(data) {
				$scope.tweet = $sce.trustAsHtml(data.html);
			});
		}

	}
})();