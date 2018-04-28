(function() {
	'use strict';
	angular.module('rpSlideshow').controller('rpSlideshowCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'$compile',
		'$mdPanel',
		'rpSettingsService',
		rpSlideshowCtrl
	]);

	function rpSlideshowCtrl(
		$scope,
		$rootScope,
		$timeout,
		$compile,
		$mdPanel,
		rpSettingsService
	) {
		console.log('[rpSlideshowCtrl]');
		$scope.time = rpSettingsService.settings.slideshowTime;
		$scope.slideshowHeader = rpSettingsService.settings.slideshowHeader;
		$scope.slideshowHeaderFixed = rpSettingsService.settings.slideshowHeaderFixed;
		$scope.slideshowAutoplay = rpSettingsService.settings.slideshowAutoplay;
		var currentPost = 0;
		var cancelPlay;
		$scope.showControls = true;
		$scope.showHeader = true;
		$scope.isPlaying = true;
		$scope.slideshow = false;
		$scope.post = {};
		$scope.showSub = false;
		console.log('[rpSlideshowCtrl] slideshowAutoplay: ' + $scope.slideshowAutoplay);
		console.log('[rpSlideshowCtrl] slideshowHeader: ' + $scope.slideshowHeader);

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
			$rootScope.$emit('rp_slideshow_play_state_changed', $scope.isPlaying);

		}

		function play() {
			// $rootScope.$emit('rp_slideshow_progress_start');
			if ($scope.slideshowActive) {
				cancelPlay = $timeout(function() {
					// $rootScope.$emit('rp_slideshow_progress_stop');
					next();
					// play();
				}, $scope.time);

			}
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
				// console.log('[rpSlideshowCtrl] getPost(), post.data.title: ' + post.data.title);

				var imageUrl;
				try {
					imageUrl = (((((post || {}).data || {}).preview || {}).images[0] || {}).source || {}).url;
					// imageUrl = post.data.preview.images[0].source.url;
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
			console.log('[rpSlideshowCtrl] closeSlideshow()');
			$timeout.cancel(cancelPlay);
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
			rpSettingsService.setSetting('slideshowTime', $scope.time);
			$timeout.cancel(cancelPlay);
			play();
		};

		$scope.openSettings = function($event) {
			$rootScope.$emit('rp_slideshow_cancel_hide_header');

			var position = $mdPanel.newPanelPosition().relativeTo('.rp-slideshow-settings-button')
				.addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);

			console.log('[rpSlideshowCtrl] openSettings() position: ' + position);

			var config = {
				attachTo: angular.element(document.body),
				controller: 'rpSlideshowSettingsPanelCtrl',
				disableParentScroll: this.disableParentScroll,
				templateUrl: 'rpSlideshow/views/rpSlideshowSettingsPanel.html',
				hasBackdrop: false,
				trapFocus: true,
				clickOutsideToClose: true,
				escapeToClose: true,
				focusOnOpen: true,
				position: position,
				panelClass: 'rp-slideshow-settings-panel',
				zIndex: 3000
			};

			$mdPanel.open(config);
		};

		getPost(next);
		getShowSub();

		if ($scope.slideshowAutoplay) {
			console.log('[rpSlideshowCtrl] autoplay...');
			play();
		} else {
			playPause();
		}

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
			if ($scope.slideshow && $scope.isPlaying) {
				next();
			}
		});

		var deregisterYoutubeVideoEnded = $scope.$on('youtube.player.ended', function(e, player) {
			console.log('[rpSlideshowCtrl] youtube video ended');
		});

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function(e) {
			console.log('[rpSlideshowCtrl] rp_settings_changed');
			$scope.time = rpSettingsService.settings.slideshowTime;
			$scope.slideshowHeader = rpSettingsService.settings.slideshowHeader;
			$scope.slideshowHeaderFixed = rpSettingsService.settings.slideshowHeaderFixed;
			$scope.slideshowAutoplay = rpSettingsService.settings.slideshowAutoplay;
		});

		$scope.$on('$destroy', function() {
			console.log('[rpSlideshowCtrl] $destroy()');
			angular.element('html').unbind('keypress mousemove');
			deregisterSlideshowNext();
			deregisterSlideshowPrev();
			deregisterMouseOverControls();
			deregisterMouseOverHeader();
			deregisterSlideshowPlayPause();
			deregisterSettingsChanged();
			$timeout.cancel(cancelPlay);

		});

	}
})();