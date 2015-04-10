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
		var scope = angular.element($('.rp-subreddit-posts')).scope();
		var w = parseInt(jQuery(window).width);
		
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
					scope.columns = [1, 2];
				});
			}
		}
	}


	function oneColumn() {
		var scope = angular.element($('.rp-subreddit-posts')).scope();
		if (scope) {
			scope.$apply(function() {
				scope.columns = [1];
			});
		}
	}

	function twoColumns() {
		var scope = angular.element($('.rp-subreddit-posts')).scope();
		if (scope) {
			scope.$apply(function() {
				scope.columns = [1, 2];
			});
		}
	}

	function threeColumns() {
		var scope = angular.element($('.rp-subreddit-posts')).scope();
		if (scope) {
			scope.$apply(function() {
				scope.columns = [1, 2, 3];
			});
		}
	}

});