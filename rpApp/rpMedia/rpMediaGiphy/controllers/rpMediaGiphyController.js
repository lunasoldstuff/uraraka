(function() {
	'use strict';
	angular.module('rpMediaGiphy').controller('rpMediaGiphyCtrl', [
		'$scope',
		'$filter',
		rpMediaGiphyCtrl
	]);

	function rpMediaGiphyCtrl($scope, $filter) {

		var giphyRe = /^http:\/\/(?:www\.)?giphy\.com\/gifs\/(.*?)(\/html5)?$/i;
		var giphyAltRe = /^http:\/\/(?:www\.)?(?:i\.)?giphy\.com\/([\w]+)(?:.gif)?/i;
		var giphyAlt2Re = /^https?:\/\/(?:www\.)?(?:media[0-9]?\.)?(?:i\.)?giphy\.com\/(?:media\/)?([\w]+)(?:.gif)?/i;
		var groups;

		if (giphyRe.test($scope.url)) {
			groups = giphyRe.exec($scope.url);
		} else if (giphyAltRe.test($scope.url)) {
			groups = giphyAltRe.exec($scope.url);
		} else if (giphyAlt2Re.test($scope.url)) {
			groups = giphyAlt2Re.exec($scope.url);
		}

		$scope.giphyType = (groups[2]) ? 'video' : 'image';

		if (groups) {

			$scope.thumbnailUrl = $filter('rp_get_image_url')($scope.post);

			if (angular.isUndefined($scope.thumbnailUrl)) {
				$scope.thumbnailUrl = 'http://media.giphy.com/media/' + groups[1] + '/200_s.gif';

			}

			if ($scope.giphyType === 'image') {
				$scope.imageUrl = 'http://media.giphy.com/media/' + groups[1] + '/giphy.gif';
			} else if ($scope.giphyType === 'video') {
				$scope.videoUrl = 'http://media.giphy.com/media/' + groups[1] + '/giphy.mp4';
			}

		}

		$scope.show = function() {
			$scope.showGif = true;
		};

		$scope.hide = function() {
			$scope.showGif = false;
		};
	}

})();