(function() {
	'use strict';
	angular.module('rpMediaTwitter').controller('rpMediaTwitterCtrl', [
		'$scope',
		'$sce',
		'rpMediaTwitterResourceService',
		rpMediaTwitterCtrl
	]);

	function rpMediaTwitterCtrl($scope, $sce, rpMediaTwitterResourceService) {

		$scope.tweet = "";
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
		var groups = twitterRe.exec($scope.url);

		if (groups) {
			var data = rpMediaTwitterResourceService.get({
				id: groups[1]
			}, function(data) {
				$scope.tweet = $sce.trustAsHtml(data.html);
			});
		}

	}
})();