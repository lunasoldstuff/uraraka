'use strict';

var rpMediaDirectives = angular.module('rpMediaDirectives', []);

rpMediaDirectives.directive('rpMedia', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMedia.html',
        controller: 'rpMediaCtrl',
        scope: {
            url: '=',
            post: '=',
        }
    };
});

rpMediaDirectives.directive('rpMediaStreamable', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaStreamable.html',
        controller: 'rpMediaStreamableCtrl'
    };
});

rpMediaDirectives.directive('rpMediaRedditUpload', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaRedditUpload.html',
        controller: 'rpMediaRedditUploadCtrl'
    };
});

rpMediaDirectives.directive('rpMediaImgur', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaImgur.html',
        controller: 'rpMediaImgurCtrl',
    };
});

rpMediaDirectives.directive('rpMediaImgurAlbum', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaImgurAlbum.html',
        controller: 'rpMediaImgurAlbumCtrl'
    };
});

rpMediaDirectives.directive('rpMediaYoutube', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaYoutube.html',
        controller: 'rpMediaYoutubeCtrl'
    };
});

rpMediaDirectives.directive('rpMediaTwitter', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaTwitter.html',
        controller: 'rpMediaTwitterCtrl'
    };
});

rpMediaDirectives.directive('rpMediaGfycat', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaGfycat.html',
        controller: 'rpMediaGfycatCtrl'
    };
});

rpMediaDirectives.directive('rpMediaGiphy', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaGiphy.html',
        controller: 'rpMediaGiphyCtrl'
    };
});

rpMediaDirectives.directive('rpMediaDefault', function () {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaDefault.html',
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

rpMediaDirectives.directive('rpMediaDefaultEmbed', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            oembed: '=',

        },
        compile: function (scope, elem) {
            console.log('[rpMediaDefaultEmbed] compile function, scope.oembed: ' + scope.oembed);
            console.log('[rpMediaDefaultEmbed] compile function, scope.post.data.media.oembed.html: ' + scope.post.data.media.oembed.html);

            // var el = angular.element(scope.html);
            // var compiled = $compile(el);
            // elem.append(el);
            // compiled(scope);
        },
        link: function (scope) {
            console.log('[rpMediaDefaultEmbed] link, scope.oembed: ' + scope.oembed);
        },
    };
}]);
