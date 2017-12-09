'use strict';

var rpSlideshowControllers = angular.module('rpSlideshowControllers', []);

rpSlideshowControllers.controller('rpSlideshowCtrl', [
    '$scope',
    '$rootScope',
    function($scope, $rootScope) {
        console.log('[rpSlideshowCtrl]');
        $scope.showSlideshow = false;

        var deregisterSlideshowStart = $rootScope.$on('rp_slideshow_start', function() {
            console.log('[rpSlideshowCtrl] slidehsow start');
            $scope.showSlideshow = true;
        });

        $scope.endSlideshow = function(e) {
            console.log('[rpSlideshowCtrl] endSlideshow()');
            $scope.showSlideshow = false;
        };

        $scope.$on('$destoy', function() {
            deregisterSlideshowStart();
        });

    }
]);