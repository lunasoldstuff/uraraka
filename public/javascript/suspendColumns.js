$(function() {

	mediaCheck({
		media: '(max-width: 970px)',
		both: suspendColumns,
	});

	mediaCheck({
		media: '(max-width: 1550px)',
		both: suspendColumns,
	});

	function suspendColumns() {
		console.log('suspendColumns');
		var scope = angular.element($('[class^=rp-posts-col]')).scope();
		if (scope) {
			scope.$apply(function() {
				console.log('emitting suspend event');
				// scope.emit('suspend');
				scope.suspendColumns();
			});
		}
	}


});