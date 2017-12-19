'use strict';

var rpMediaDirectives = angular.module('rpMediaDirectives', []);

// rpMediaDirectives.directive('rpMediaImage', [function () {
//     return {
//         restrict: 'C',
//         link: function (scope, element, attrs) {
//             element.on('load', function () {
//                 var width = parseInt(element.outerWidth());
//                 var height = parseInt(element.outerHeight());

//                 console.log('[rpMediaImage] width: ' + width + ', height: ' + height);

//                 if (height > width) {
//                     scope.orientation = 'portrait';
//                 } else {
//                     scope.orientation = 'landscape';
//                 }

//             });

//         }
//     };
// }]);

rpMediaDirectives.directive('rpMedia', function() {
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

rpMediaDirectives.directive('rpMediaStreamable', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaStreamable.html',
        controller: 'rpMediaStreamableCtrl'
    };
});

rpMediaDirectives.directive('rpMediaRedditUpload', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaRedditUpload.html',
        controller: 'rpMediaRedditUploadCtrl'
    };
});

rpMediaDirectives.directive('rpMediaImgur', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaImgur.html',
        controller: 'rpMediaImgurCtrl',
    };
});

rpMediaDirectives.directive('rpMediaImgurAlbum', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaImgurAlbum.html',
        controller: 'rpMediaImgurAlbumCtrl'
    };
});

rpMediaDirectives.directive('rpMediaYoutube', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaYoutube.html',
        controller: 'rpMediaYoutubeCtrl'
    };
});

rpMediaDirectives.directive('rpMediaTwitter', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaTwitter.html',
        controller: 'rpMediaTwitterCtrl'
    };
});

rpMediaDirectives.directive('rpMediaGfycat', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaGfycat.html',
        controller: 'rpMediaGfycatCtrl'
    };
});

rpMediaDirectives.directive('rpMediaGiphy', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaGiphy.html',
        controller: 'rpMediaGiphyCtrl'
    };
});

rpMediaDirectives.directive('rpMediaDefault', function() {
    return {
        restrict: 'E',
        templateUrl: 'rpMediaDefault.html',
        controller: 'rpMediaDefaultCtrl'
    };
});

/*
	Shows and Hides the circular progress indicator on album images.
 */
rpMediaDirectives.directive('rpMediaImgurAlbumWrapper', function() {
    return {

        restrict: 'C',

        link: function(scope, element, attrs) {

            element.children('img').load(function() {
                element.children('.rp-media-imgur-album-progress').hide();
            });

            var deregisterAlbumImageChanged = scope.$on('rp_album_image_changed', function() {
                element.children('.rp-media-imgur-album-progress').show();
            });

            scope.$on('$destroy', function() {
                deregisterAlbumImageChanged();
            });

        }
    };
});

rpMediaDirectives.directive('rpMediaImgurAlbumPanelProgress', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    return {

        restrict: 'A',

        link: function(scope, element, attrs) {

            console.log('[rpMediaImagePanelWrapper]');

            element.children('img').load(function() {
                console.log('[rpMediaImagePanelWrapper] hide progress');
                element.children('.rp-media-imgur-album-progress').hide();
                $timeout(function() {
                    element.children('img').show();
                    element.children('.rp-media-imgur-album-panel-button').show();
                    element.children('.rp-media-imgur-album-panel-details').show();

                }, 100);

            });

            var deregisterAlbumPanelImageChanged = $rootScope.$on('rp_album_panel_image_changed', function() {
                // var deregisterAlbumPanelImageChanged = $rootScope.$on('rp_media_album_image_changed', function () {
                console.log('[rpMediaImagePanelWrapper] show progress');
                element.children('.rp-media-imgur-album-progress').show();
                element.children('.rp-media-imgur-album-panel-details').hide();
                element.children('img').hide();
                element.children('.rp-media-imgur-album-panel-button').hide();
            });

            scope.$on('$destroy', function() {
                deregisterAlbumPanelImageChanged();
            });

        }
    };
}]);

rpMediaDirectives.directive('rpMediaDefaultEmbed', ['$compile', function($compile) {
    return {
        restrict: 'E',
        scope: {
            oembed: '=',

        },
        compile: function(scope, elem) {
            console.log('[rpMediaDefaultEmbed] compile function, scope.oembed: ' + scope.oembed);
            console.log('[rpMediaDefaultEmbed] compile function, scope.post.data.media.oembed.html: ' + scope.post.data.media.oembed.html);

            // var el = angular.element(scope.html);
            // var compiled = $compile(el);
            // elem.append(el);
            // compiled(scope);
        },
        link: function(scope) {
            console.log('[rpMediaDefaultEmbed] link, scope.oembed: ' + scope.oembed);
        },
    };
}]);