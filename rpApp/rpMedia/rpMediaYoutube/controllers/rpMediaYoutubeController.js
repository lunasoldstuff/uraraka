(function() {
	'use strict';
	angular.module('rpMediaYoutube').controller('rpMediaYoutubeCtrl', [
		'$scope',
		'$rootScope',
		'$sce',
		'$filter',
		rpMediaYoutubeCtrl
	]);

	function rpMediaYoutubeCtrl($scope, $rootScope, $sce, $filter) {

		var youtubeRe = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i;
		var youtubeAltRe = /^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)(\?t=[\w]+)?/i;
		var youtubeTimestampRe = /\?t\=[\w+]+/i;

		$scope.playerVars = {
			autoplay: 1
		};

		var groups;
		groups = youtubeRe.exec($scope.url);
		if (!groups) groups = youtubeAltRe.exec($scope.url);

		if (groups) {

			console.log('[rpMediaYoutubeCtrl] groups: ' + groups);

			// $scope.thumbnailUrl = 'https://img.youtube.com/vi/' + groups[1] + '/default.jpg';
			$scope.thumbnailUrl = $filter('rpMediaGetImageUrlFilter')($scope.post);

			if (angular.isUndefined($scope.thumbnailUrl)) {
				$scope.thumbnailUrl = 'https://img.youtube.com/vi/' + groups[1] + '/hqdefault.jpg';

			}

			var embedUrl = 'https://www.youtube.com/embed/' + groups[1] + '?autoplay=1';

			if (groups[2]) {
				if (youtubeTimestampRe.test(groups[2])) {
					console.log('[rpMediaYoutubeCtrl] groups[2]: ' + groups[2]);
					var time = $filter('rpMediaYoutubeTimeToSecondsFilter')(groups[2].replace('?t=', ''));
					embedUrl += '&start=' + time;
				}
			}

			console.log('[rpMediaYoutubeCtrl] embedUrl: ' + embedUrl);

			$scope.embedUrl = $sce.trustAsResourceUrl(embedUrl);
			$scope.videoId = groups[1];

		}

		$scope.showYoutubeVideo = false;

		$scope.show = function() {
			$scope.showYoutubeVideo = true;
		};

		$scope.hide = function() {
			$scope.showYoutubeVideo = false;
		};

		$scope.$on('youtube.player.ready', function(e, player) {
			console.log('[rpMediaYoutubeCtrl] player.ready');
			if (jQuery(player.getIframe()).parents().find('.rp-slideshow').length > 0) {
				$rootScope.$emit('rp_slideshow_video_start');
			}
		});

		$scope.$on('youtube.player.ended', function(e, player) {
			console.log('[rpMediaYoutubeCtrl] player.ended');
			if (jQuery(player.getIframe()).parents().find('.rp-slideshow').length > 0) {
				$rootScope.$emit('rp_slideshow_video_end');
			}
		});

	}

})();