'use strict';

var rpSlideshowControllers = angular.module('rpSlideshowControllers', []);

rpSlideshowControllers.controller('rpSlideshowCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$compile',
    'rpSettingsUtilService',
    function(
        $scope,
        $rootScope,
        $timeout,
        $compile,
        rpSettingsUtilService
    ) {
        console.log('[rpSlideshowCtrl]');
        $scope.time = rpSettingsUtilService.settings.slideshowTime;
        var currentPost = 0;
        var cancelPlay;
        $scope.showControls = true;
        $scope.showHeader = true;
        $scope.autohideHeader = false;
        $scope.isPlaying = true;
        $scope.slideshow = false;
        $scope.post = {};
        $scope.showSub = false;

        $timeout(function() {
            $scope.slideshow = true;
        }, 0);

        function playPause() {
            if ($scope.isPlaying) {
                pause();
            } else {
                play();
            }

            $scope.isPlaying = !$scope.isPlaying;

        }

        function play() {
            // $rootScope.$emit('rp_slideshow_progress_start');
            cancelPlay = $timeout(function() {
                // $rootScope.$emit('rp_slideshow_progress_stop');
                next();
                // play();
            }, $scope.time);
        }

        function pause() {
            $timeout.cancel(cancelPlay);
        }

        function resetPlay() {
            if ($scope.isPlaying) {
                $timeout.cancel(cancelPlay);
                play();
            }
        }

        function next() {
            currentPost++;
            console.log('[rpSlideshowCtrl] next() currentPost: ' + currentPost);
            getPost(next, true);
            resetPlay();
            $rootScope.$emit('rp_slideshow_show_header');
        };

        function prev() {
            currentPost = currentPost > 0 ? --currentPost : 0;
            console.log('[rpSlideshowCtrl] prev(), currentPost: ' + currentPost);
            getPost(prev, true);
            resetPlay();
            $rootScope.$emit('rp_slideshow_show_header');

        };


        function getPost(skip) {
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
                    $scope.recompile();
                    $timeout(angular.noop, 0);

                }

            });
        }

        function getShowSub() {
            $rootScope.$emit('rp_slideshow_get_show_sub', function(showSub) {
                $scope.showSub = showSub;
            });
        }

        var newScope;
        $scope.recompile = function() {
            console.log('[rpSlideshow] link, recompile(), typeof newScope ' + typeof newScope);
            if (angular.isDefined(newScope)) {
                newScope.$destroy();
            }
            newScope = $scope.$new();
            $compile(angular.element('.rp-slideshow-media').contents())(newScope);
        };

        $scope.closeSlideshow = function(e) {
            console.log('[rpSlideshowCtrl] endSlideshow()');
            angular.element('html').unbind('keypress mousemove');
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

        $scope.changeTime = function() {
            // timeIndex = (timeIndex + 1) % times.length;
            // $scope.time = times[timeIndex];
            rpSettingsUtilService.setSetting('slideshowTime', $scope.time);
            $timeout.cancel(cancelPlay);
            play();
        };

        getPost(next);
        getShowSub();
        play();

        var deregisterSlideshowPlayPause = $rootScope.$on('rp_slideshow_play_pause', function(e) {
            console.log('[rpSlideshowCtrl] rp_slideshow_play_pause');
            playPause();
        });

        var deregisterSlideshowNext = $rootScope.$on('rp_slideshow_next', function(e) {
            console.log('[rpSlideshowCtrl] rp_slideshow_next');
            next();
        });

        var deregisterSlideshowPrev = $rootScope.$on('rp_slideshow_prev', function(e) {
            console.log('[rpSlideshowCtrl] rp_slideshow_prev');
            prev();
        });

        var deregisterMouseOverControls = $rootScope.$on('rp_slideshow_mouse_over_controls', function(e, mouseOverControls) {
            $scope.mouseOverControls = mouseOverControls;
        });

        var deregisterMouseOverHeader = $rootScope.$on('rp_slideshow_mouse_over_header', function(e, mouseOverHeader) {
            $scope.mouseOverHeader = mouseOverHeader;
        });

        var deregisterVideoStart = $rootScope.$on('rp_slideshow_video_start', function(e) {
            console.log('[rpSlideshowCtrl] video start');
            $timeout.cancel(cancelPlay);

        });

        var deregisterVideoEnd = $rootScope.$on('rp_slideshow_video_end', function(e) {
            console.log('[rpSlideshowCtrl] video end');
            if ($scope.isPlaying) {
                next();
            }
        });

        var deregisterYoutubeVideoEnded = $scope.$on('youtube.player.ended', function(e, player) {
            console.log('[rpSlideshowCtrl] youtube video ended');
        });

        $scope.$on('$destroy', function() {
            console.log('[rpSlideshowCtrl] $destroy()');
            angular.element('html').unbind('keypress mousemove');
            deregisterSlideshowNext();
            deregisterSlideshowPrev();
            deregisterMouseOverControls();
            deregisterMouseOverHeader();
            deregisterSlideshowPlayPause();
            $timeout.cancel(cancelPlay);

        });

    }
]);

rpSlideshowControllers.controller('rpSlideshowControlsCtrl', [
    '$scope',
    '$rootScope',
    function(
        $scope,
        $rootScope
    ) {
        console.log('[rpSlideshowControlsCtrl]');

        $scope.playPause = function() {
            console.log('[rpSlideshowControlsCtrl] play/pause');
            $rootScope.$emit('rp_slideshow_play_pause');
        };

        $scope.next = function() {
            console.log('[rpSlideshowControlsCtrl] next');
            $rootScope.$emit('rp_slideshow_next');
        };

        $scope.prev = function() {
            console.log('[rpSlideshowControlsCtrl] prev');
            $rootScope.$emit('rp_slideshow_prev');
        };

    }
]);

rpSlideshowControllers.controller('rpSlideshowProgressCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    'rpSettingsUtilService',
    function(
        $scope,
        $rootScope,
        $timeout,
        rpSettingsUtilService
    ) {
        console.log('[rpSlideshowProgressCtrl]');

        $scope.showProgress = false;
        var cancelTickProgress;
        var slideshowTime = rpSettingsUtilService.settings.slideshowTime;
        console.log('[rpSlideshowProgressCtrl] slideshowTime: ' + slideshowTime);

        function startProgress() {

            $scope.slideshowProgress = 100;
            $scope.showProgress = true;
            var startTime = new Date();
            console.log('[rpSlideshowProgressCtrl] startProgress(), startTime: ' + startTime.valueOf());

            function tickProgress() {
                var timeElapsed = new Date() - startTime;
                console.log('[rpSlideshowProgressCtrl] tickProgress(), timeElapsed: ' + timeElapsed.valueOf());

                if (timeElapsed > slideshowTime) {
                    stopProgress();
                } else {
                    $scope.slideshowProgress = ((slideshowTime - timeElapsed) / slideshowTime) * 100;
                    console.log('[rpSlideshowProgressCtrl] tickProgress(), $scope.slideshowProgress: ' + $scope.slideshowProgress);
                    $timeout(angular.noop, 0);
                    cancelTickProgress = $timeout(tickProgress, 500);
                }
            }

            tickProgress();
        }

        function stopProgress() {
            $scope.slideshowProgress = 0;
            $scope.showProgress = false;
            $timeout(angular.noop, 0);
            $timeout.cancel(cancelTickProgress);
        }

        var deregisterStartProgress = $rootScope.$on('rp_slideshow_progress_start', function() {
            console.log('[rpSlideshowProgressCtrl] rp_slideshow_progress_start');
            startProgress();
        });

        var deregisterStopProgress = $rootScope.$on('rp_slideshow_progress_stop', function() {
            console.log('[rpSlideshowProgressCtrl] rp_slideshow_progress_stop');
            stopProgress();
        });

        $scope.$on('$destroy', function() {
            deregisterStartProgress();
            deregisterStopProgress();
        });




    }
]);