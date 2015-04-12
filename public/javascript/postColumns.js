jQuery(function() {

	mediaCheck({
		media: '(max-width: 970px)',
		// entry: oneColumn,
		// exit: twoColumns
		both: resizeColumns
	});

	mediaCheck({
		media: '(max-width: 1550px)',
		// entry: twoColumns,
		both: resizeColumns
	});

	mediaCheck({
		media: '(min-width: 1550px)',
		// entry: threeColumns,
		both: resizeColumns
	});

	function resizeColumns() {

		console.log("is fullscreen: " + isFullscreen());

		if (!isFullscreen()) {
			var scope = angular.element($('.rp-subreddit-posts')).scope();
			var w = jQuery(window).width();

			if (scope) {
				if (w < 960) {
					scope.$apply(function() {
						scope.columns = [1];
					});
				} else if (w < 1550) {
					scope.$apply(function() {
						scope.columns = [1, 2];
					});
				} else {
					scope.$apply(function() {
						scope.columns = [1, 2, 3];
					});
				}
			}
		}
	}

	function isFullscreen() {
		return window.outerWidth === screen.width && window.outerHeight === screen.height;
	}

});