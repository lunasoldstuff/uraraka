'use strict';

var rpSlideshowControllers = angular.module('rpSlideshowControllers', []);

rpSlideshowControllers.controller('rpSlideshowCtrl', [
    '$scope',
    '$rootScope',
    function($scope, $rootScope) {
        console.log('[rpSlideshowCtrl]');
        var currentPost = 0;

        $scope.post = {};

        function getPost() {
            $rootScope.$emit('rp_slideshow_get_post', currentPost, function(post) {
                $scope.post = post;
                console.log('[rpSlideshowCtrl] post.data.id: ' + post.data.id);
            });
        }

        getPost();

        $scope.next = function(e) {
            console.log('[rpSlideshowCtrl] next()');
            currentPost++;
            getPost();
        };

        $scope.prev = function(e) {
            console.log('[rpSlideshowCtrl] prev()');
            currentPost = currentPost > 0 ? currentPost-- : 0;
            getPost();
        };

        $scope.closeSlideshow = function(e) {
            console.log('[rpSlideshowCtrl] endSlideshow()');
            $rootScope.$emit('rp_slideshow_end');
        };

        $scope.$on('$destoy', function() {
            // deregisterSlideshowStart();
        });

    }
]);