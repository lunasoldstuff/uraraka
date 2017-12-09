'use strict';

var rpSlideshowControllers = angular.module('rpSlideshowControllers', []);

rpSlideshowControllers.controller('rpSlideshowCtrl', [
    '$scope',
    '$rootScope',
    function($scope, $rootScope) {
        console.log('[rpSlideshowCtrl]');
        // $scope.showSlideshow = false;

        // var deregisterSlideshowStart = $rootScope.$on('rp_slideshow_start', function() {
        //     console.log('[rpSlideshowCtrl] slidehsow start');
        //     $scope.showSlideshow = true;
        // });
        //
        $scope.closeSlideshow = function(e) {
            console.log('[rpSlideshowCtrl] endSlideshow()');
            $rootScope.$emit('rp_slideshow_end');
        };

        $scope.$on('$destoy', function() {
            // deregisterSlideshowStart();
        });

    }
]);