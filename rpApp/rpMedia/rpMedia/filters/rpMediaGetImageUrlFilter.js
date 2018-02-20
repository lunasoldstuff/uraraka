(function() {
	'use strict';
	angular.module('rpMedia').filter('rpMediaGetImageUrlFilter', [
		'$filter',
		rpMediaGetImageUrlFilter
	]);

	function rpMediaGetImageUrlFilter($filter) {
		return function(post) {

			var imageUrl;
			var url = post.data.url;

			if (
				angular.isDefined(post) &&
				angular.isDefined(post.data) &&
				angular.isDefined(post.data.preview) &&
				angular.isDefined(post.data.preview.images) &&
				angular.isDefined(post.data.preview.images[0]) &&
				angular.isDefined(post.data.preview.images[0].source) &&
				angular.isDefined(post.data.preview.images[0].source.url)

			) {
				imageUrl = post.data.preview.images[0].source.url;

			}

			//Check url next
			if (angular.isUndefined(imageUrl)) {
				if (
					url.substr(url.length - 4) === '.jpg' || url.substr(url.length - 5) === '.jpeg' ||
					url.substr(url.length - 4) === '.png' || url.substr(url.length - 4) === '.bmp'
				) {
					imageUrl = url;
				}
			}

			//Finally check the thumbnail
			if (angular.isDefined(post) && angular.isUndefined(imageUrl)) {
				//http://blog.osteele.com/posts/2007/12/cheap-monads/
				imageUrl = ((post || {}).data || {}).thumbnail;
			}

			//remove amp; from url
			if (angular.isDefined(imageUrl)) {
				imageUrl = $filter('rpMediaRemoveAmpFilter')(imageUrl);
			}

			if (angular.isDefined(post)) {
				console.log('[rpMediaGetImageUrlFilter] getImageUrl(), title: ' + post.data.title + ' imageUrl: ' + imageUrl);

			} else {
				console.log('[rpMediaGetImageUrlFilter] getIamgeUrl(), post undefined, url: ' + url + ' imageUrl: ' + imageUrl);

			}


			return imageUrl;

		};
	}
})();