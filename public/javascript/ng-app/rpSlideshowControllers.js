'use strict';

var rpSlideshowControllers = angular.module('rpSlideshowControllers', []);

rpSlideshowControllers.controller('rpSlideshowCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    function(
        $scope,
        $rootScope,
        $timeout
    ) {
        console.log('[rpSlideshowCtrl]');
        var currentPost = 0;

        $scope.post = {};

        function getPost() {
            $rootScope.$emit('rp_slideshow_get_post', currentPost, function(post) {
                // if (post.data.url === 'self') {
                //     $scope.next();
                //
                // } else {
                $scope.post = post;
                console.log('[rpSlideshowCtrl] getPost(), post.data.id: ' + post.data.id);
                $scope.recompile();
                $timeout(angular.noop, 0);

                // }

            });
        }

        getPost();

        $scope.next = function(e) {
            currentPost++;
            console.log('[rpSlideshowCtrl] next() currentPost: ' + currentPost);
            getPost();
        };

        $scope.prev = function(e) {
            currentPost = currentPost > 0 ? --currentPost : 0;
            console.log('[rpSlideshowCtrl] prev(), currentPost: ' + currentPost);
            getPost();
        };

        $scope.closeSlideshow = function(e) {
            console.log('[rpSlideshowCtrl] endSlideshow()');
            $rootScope.$emit('rp_slideshow_end');
        };

        var deregisterSlideshowNext = $rootScope.$on('rp_slideshow_next', function(e) {
            console.log('[rpSlideshowCtrl] rp_slideshow_next');
            $scope.next();
        });

        var deregisterSlideshowPrev = $rootScope.$on('rp_slideshow_prev', function(e) {
            console.log('[rpSlideshowCtrl] rp_slideshow_prev');
            $scope.prev();
        });

        $scope.$on('$destroy', function() {
            console.log('[rpSlideshowCtrl] $destroy()');
            deregisterSlideshowNext();
            deregisterSlideshowPrev();

        });

    }
]);