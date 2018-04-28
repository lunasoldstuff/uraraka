'use strict';

(function () {
	'use strict';

	angular.module('rpMediaGfycat').controller('rpMediaGfycatCtrl', ['$scope', '$http', '$timeout', rpMediaGfycatCtrl]);

	function rpMediaGfycatCtrl($scope, $http, $timeout) {
		console.log('[rpMediaGyfcatCtrl] $scope.url: ' + $scope.url);
		var gfycatRe = /(^https?:\/\/[\w]?\.?)?gfycat\.com\/(\w+)(\.gif)?/i;
		var groups = gfycatRe.exec($scope.url);

		// console.log('[rpMediaGfycatCtrl] url: ' + $scope.url);
		// console.log('[rpMediaGfycatCtrl] groups[1]: ' + groups[1]);
		// console.log('[rpMediaGfycatCtrl] groups[2]: ' + groups[2]);
		// console.log('[rpMediaGfycatCtrl] groups[3]: ' + groups[3]);


		if (groups[3] && groups[3] == '.gif') $scope.gfycatType = 'image';else $scope.gfycatType = 'video';

		$scope.showGif = false;

		var prefix = 'https://';
		// var prefix = groups[1];
		// var prefix = 'http://zippy.';
		// var prefix = groups[1] || 'http://zippy.';
		// var prefix = 'http://giant.';

		// console.log('[rpMediaGfycatCtrl] prefix: ' + prefix);


		if (groups) {

			var gfycatApiUrl = 'https://api.gfycat.com/v1test/gfycats/' + groups[2];

			$http({
				method: 'GET',
				url: gfycatApiUrl
			}).then(function successCallback(response) {
				console.log('[rpMediaGfycatCtrl] response: ' + JSON.stringify(response));
				console.log('[rpMediaGfycatCtrl] response.gfyItem.gfyName: ' + response.data.gfyItem.gfyName);

				$scope.dataId = response.data.gfyItem.gfyName;

				$scope.thumbnailUrl = 'https://thumbs.gfycat.com/' + $scope.dataId + '-poster.jpg';

				if ($scope.gfycatType === 'image') {
					$scope.imageUrl = prefix + 'gfycat.com/' + $scope.dataId + '.gif';
				} else if ($scope.gfycatType === 'video') {
					$scope.zippyVideoUrl = 'https://zippy.gfycat.com/' + $scope.dataId + '.webm';
					$scope.fatVideoUrl = 'https://fat.gfycat.com/' + $scope.dataId + '.webm';
					$scope.giantVideoUrl = 'https://giant.gfycat.com/' + $scope.dataId + '.webm';
					$scope.thumbsVideoUrl = 'https://thumbs.gfycat.com/' + $scope.dataId + '-mobile.mp4';
				}
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}

		$scope.show = function () {
			$scope.showGif = true;
		};

		$scope.hide = function () {
			$scope.showGif = false;
		};

		$timeout(function () {
			$scope.showVideo = true;
		}, 500);
	}
})();