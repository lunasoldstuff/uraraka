$(function() {

	mediaCheck({
		media: '(max-width: 970px)',
		entry: oneColumn,
		exit: twoColumns
	});

	mediaCheck({
		media: '(max-width: 1550px)',
		entry: twoColumns,
	});

	mediaCheck({
		media: '(min-width: 1550px)',
		entry: threeColumns,
	});


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
