'use strict';

var rpMediaDirectives = angular.module('rpMediaDirectives', []);

rpMediaDirectives.directive('rpMedia', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMedia',
		scope: {
			url: '=',
			post: '='
		},
		controller: 'rpMediaCtrl'
	};
});

rpMediaDirectives.directive('rpMediaImgur', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaImgur',
		controller: 'rpMediaImgurCtrl',
	};
});

rpMediaDirectives.directive('rpMediaImgurAlbum', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaImgurAlbum',
		controller: 'rpMediaImgurAlbumCtrl'
	};
});

rpMediaDirectives.directive('rpMediaYoutube', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaYoutube',
		controller: 'rpMediaYoutubeCtrl'
	};
});

rpMediaDirectives.directive('rpMediaTwitter', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaTwitter',
		controller: 'rpMediaTwitterCtrl'
	};
});

rpMediaDirectives.directive('rpMediaGfycat', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaGfycat',
		controller: 'rpMediaGfycatCtrl'
	};
});

rpMediaDirectives.directive('rpMediaGiphy', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaGiphy',
		controller: 'rpMediaGiphyCtrl'
	};
});

rpMediaDirectives.directive('rpMediaDefault', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMediaDefault',
		controller: 'rpMediaDefaultCtrl'
	};
});

/*
	Shows and Hides the circular progress indicator on album images.
 */
rpMediaDirectives.directive('rpMediaImgurAlbumWrapper', function () {
	return {

		restrict: 'C',

		link: function (scope, element, attrs) {

			element.children('img').load(function () {
				element.children('.rp-media-imgur-album-progress').hide();
			});

			scope.$on('album_image_change', function () {
				element.children('.rp-media-imgur-album-progress').show();
			});

		}
	};
});
