(function() {
	'use strict';
	angular.module('rpSlideshow').directive('rpSlideshowPlayButton', [
		'$rootScope',
		rpSlideshowPlayButton
	]);

	function rpSlideshowPlayButton($rootScope) {
		return {
			restrict: 'E',
			templateUrl: 'rpSlideshow/views/rpSlideshowPlayButton.html',
			link: function(scope, element, attrs) {
				console.log('[rpSlideshowPlayButton] link(), scope.isPlaying: ' + scope.isPlaying);

				//change the state of the icon with animations
				function setIconState() {
					console.log('[rpSlideshowPlayButton] link(), setIconState(), scope.isPlaying: ' + scope.isPlaying);

					if (scope.isPlaying) {
						console.log('[rpSlideshowPlayButton] link(), setIconState(), reverseAnimation');
						document.getElementById('reverseAnimation-bar1').beginElement();
						document.getElementById('reverseAnimation-bar2').beginElement();
					} else {
						console.log('[rpSlideshowPlayButton] link(), setIconState(), startAnimation');
						document.getElementById('startAnimation-bar1').beginElement();
						document.getElementById('startAnimation-bar2').beginElement();
					}
				}

				scope.buttonClicked = function() {
					console.log('[rpSlideshowPlayButton] link(), button clicked');
					$rootScope.$emit('rp_slideshow_play_pause');
				};

				var deregisterPlayStateChanged = $rootScope.$on('rp_slideshow_play_state_changed', function(e, isPlaying) {
					setIconState();
				});

				//set the initial state of the icon with instant animations
				if (scope.isPlaying) {
					console.log('[rpSlideshowPlayButton] link(), setIconState(), reverseAnimation');
					document.getElementById('reverseAnimationInstant-bar1').beginElement();
					document.getElementById('reverseAnimationInstant-bar2').beginElement();
				} else {
					console.log('[rpSlideshowPlayButton] link(), setIconState(), startAnimation');
					document.getElementById('startAnimationInstant-bar1').beginElement();
					document.getElementById('startAnimationInstant-bar2').beginElement();
				}

				scope.$on('$destroy', function() {
					deregisterPlayStateChanged();
				});

			}
		};
	}
})();