(function() {
	'use strict';
	angular.module('rpToolbar').directive('rpToolbarOverflowMenuLayoutButton', [rpToolbarOverflowMenuLayoutButton]);

	function rpToolbarOverflowMenuLayoutButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpToolbar/views/rpToolbarOverflowMenuLayoutButton.html',
			controller: 'rpToolbarOverflowMenuLayoutButtonCtrl'
		};
	}
})();