'use strict';

(function () {
	'use strict';

	angular.module('rpMediaDefault').controller('rpMediaDefaultCtrl', ['$scope', '$timeout', '$filter', '$mdPanel', rpMediaDefaultCtrl]);

	function rpMediaDefaultCtrl($scope, $timeout, $filter, $mdPanel) {

		$scope.imageUrl = $filter('rpMediaGetImageUrlFilter')($scope.post);

		console.log('[rpMediaDefaultCtrl] $scope.imageUrl: ' + $scope.imageUrl);

		//Step 2: Check if the media is playable
		if ($scope.url.substr($scope.url.length - 4) === '.gif' || $scope.url.length - 5 === '.gifv') {
			$scope.defaultType = 'gif';
			$scope.gifUrl = $scope.url;
			$scope.playable = true;
			console.log('[rpMediaDefaultCtrl] gif, ' + $scope.post.data.title);
		} else if ($scope.url.substr($scope.url.length - 5) === '.webm') {
			$scope.defaultType = 'video';
			$scope.webmUrl = $scope.url;
			$scope.playable = true;
			console.log('[rpMediaDefaultCtrl] webm, ' + $scope.post.data.title);
		} else if ($scope.url.substr($scope.url.length - 4) === '.mp4') {
			$scope.defaultType = 'video';
			$scope.mp4Url = $scope.url;
			$scope.playable = true;
			console.log('[rpMediaDefaultCtrl] mp4, ' + $scope.post.data.title);
		} else if ($scope.post && $scope.post.data.media && $scope.post.data.media.oembed && $scope.post.data.media.oembed.type === 'video') {
			console.log('[rpMediaDefaultCtrl] embed, ' + $scope.post.data.title);
			$scope.defaultType = 'embed';
			$scope.playable = true;
		} else if ($scope.post && $scope.post.data.media && $scope.post.data.media.reddit_video) {
			$scope.defaultType = 'video';
			$scope.mp4Url = $scope.post.data.media.reddit_video.scrubber_media_url;
			$scope.playable = true;
		}

		$scope.showPlayable = false;
		if ($scope.slideshow && $scope.playable) {
			$scope.showPlayable = true;
		}

		$scope.show = function () {
			$scope.showPlayable = true;
		};

		$scope.hide = function () {
			$scope.showPlayable = false;
		};

		$scope.openImagePanel = function () {

			if (!$scope.slideshow) {
				var position = $mdPanel.newPanelPosition().absolute().center();

				$mdPanel.open({
					attachTo: angular.element(document.body),
					controller: 'rpMediaImagePanelCtrl',
					disableParentScroll: this.disableParentScroll,
					templateUrl: 'rpMedia/rpMediaImagePanel/views/rpMediaImagePanel.html',
					hasBackdrop: true,
					position: position,
					trapFocus: true,
					zIndex: 150,
					clickOutsideToClose: true,
					escapeToClose: true,
					focusOnOpen: true,
					panelClass: 'rp-media-image-panel',
					// fullscreen: true,
					locals: {
						imageUrl: $scope.imageUrl
					}
				});
			}
		};
	}
})();