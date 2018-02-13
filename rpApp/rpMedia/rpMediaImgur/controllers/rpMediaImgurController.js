(function() {
	'use strict';
	angular.module('rpMediaImgur').controller('rpMediaImgurCtrl', [
		'$scope',
		'$filter',
		'$mdPanel',
		rpMediaImgurCtrl
	]);

	function rpMediaImgurCtrl($scope, $filter, $mdPanel) {

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv|webm))?(\?.*)?$/i;
		var groups = imgurRe.exec($scope.url);

		var extension = groups[2] || '.jpg';

		if (extension == '.gif' || extension == '.gifv' || extension == '.webm')
			$scope.imgurType = 'video';
		else
			$scope.imgurType = 'image';

		// console.log('[rpMediaImgurCtrl] url: ' + $scope.url);
		// console.log('[rpMediaImgurCtrl] groups: ' + groups);


		if (groups) {
			$scope.thumbnailUrl = $filter('rp_get_image_url')($scope.post);

			if (angular.isUndefined($scope.thumbnailUrl)) {
				$scope.thumbnailUrl = "http://i.imgur.com/" + groups[1] + 't.jpg';

			}


			if ($scope.imgurType === 'image') {
				$scope.imageUrl = groups[1] ? 'http://i.imgur.com/' + groups[1] + extension : $scope.url;
			} else if ($scope.imgurType === 'video') {

				$scope.webmUrl = 'http://i.imgur.com/' + groups[1] + '.webm';
				$scope.mp4Url = 'http://i.imgur.com/' + groups[1] + '.mp4';
			}

		}

		$scope.showGif = false;

		$scope.show = function() {
			$scope.showGif = true;
		};

		$scope.hide = function() {
			$scope.showGif = false;
		};

		$scope.openImagePanel = function() {
			console.log('[rpMediaImgurCtrl] openImagePanel()');
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