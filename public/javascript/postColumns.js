jQuery(function() {

	mediaCheck({
		media: '(max-width: 960px)',
		both: resizeColumns
	});

	mediaCheck({
		media: '(max-width: 1550px)',
		both: resizeColumns
	});

	mediaCheck({
		media: '(min-width: 1550px)',
		both: resizeColumns
	});

	function resizeColumns() {
		console.log('[postColumns.js] resizeColumns, isFullscreen: ' + isFullscreen());

		if (!isFullscreen()) {

			angular.forEach(angular.element('.rp-column-resize'), function(value, key) {

				console.log('[postColumns.js] angular.forEach, value: ' + value);

				var scope = angular.element(value).scope();

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
			});

		}
	}

	function isFullscreen() {
		// return window.outerWidth === screen.width && window.outerHeight === screen.height;
		return window.innerWidth === screen.width && window.innerHeight === screen.height;
	}

});