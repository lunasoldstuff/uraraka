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

        // $scope.controls = {
        //     isOpen: false
        // };

        // $scope.showControls = true;
        $scope.showControls = true;

        $scope.slideshow = false;
        $timeout(function() {
            $scope.slideshow = true;
        }, 0);

        $scope.post = {};

        function getPost(skip, recompile) {
            $rootScope.$emit('rp_slideshow_get_post', currentPost, function(post) {
                console.log('[rpSlideshowCtrl] getPost(), post.data.title: ' + post.data.title);

                var imageUrl;
                try {
                    imageUrl = post.data.preview.images[0].source.url;
                } catch (err) {
                    console.log('[rpSlideshowCtrl] err getting imageUrl: ' + err.message);
                }

                if (angular.isUndefined(imageUrl)) {
                    skip();
                } else {
                    $scope.post = post;
                    console.log('[rpSlideshowCtrl] getPost(), post.data.id: ' + post.data.id);
                    if (recompile) $scope.recompile();
                    $timeout(angular.noop, 0);

                }

            });
        }


        $scope.next = function(e) {
            currentPost++;
            console.log('[rpSlideshowCtrl] next() currentPost: ' + currentPost);
            getPost($scope.next, true);
        };

        $scope.prev = function(e) {
            currentPost = currentPost > 0 ? --currentPost : 0;
            console.log('[rpSlideshowCtrl] prev(), currentPost: ' + currentPost);
            getPost($scope.prev, true);
        };

        $scope.closeSlideshow = function(e) {
            console.log('[rpSlideshowCtrl] endSlideshow()');
            $timeout(function() {
                $scope.slideshow = false;
            }, 0);

            if ($scope.animations) {
                $timeout(function() {
                    $rootScope.$emit('rp_slideshow_end');
                }, 500);
            } else {
                $rootScope.$emit('rp_slideshow_end');
            }
        };

        getPost($scope.next, false);

        var deregisterSlideshowNext = $rootScope.$on('rp_slideshow_next', function(e) {
            console.log('[rpSlideshowCtrl] rp_slideshow_next');
            $scope.next();
        });

        var deregisterSlideshowPrev = $rootScope.$on('rp_slideshow_prev', function(e) {
            console.log('[rpSlideshowCtrl] rp_slideshow_prev');
            $scope.prev();
        });

        var deregisterMouseOverControls = $rootScope.$on('rp_slideshow_mouse_over_controls', function(e, mouseOverControls) {
            $scope.mouseOverControls = mouseOverControls;
        });

        $scope.$on('$destroy', function() {
            console.log('[rpSlideshowCtrl] $destroy()');
            deregisterSlideshowNext();
            deregisterSlideshowPrev();
            deregisterMouseOverControls();
        });



    }
]);