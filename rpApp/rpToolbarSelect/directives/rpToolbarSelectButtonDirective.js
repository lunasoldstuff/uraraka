(function() {
	'use strict';
	angular.module('rpToolbarSelect').directive('rpToolbarSelectButton', [rpToolbarSelectButton]);

	function rpToolbarSelectButton() {
		return {
			restrict: 'A',

			link: function(scope, element, attrs) {
				var select = attrs.rpToolbarSelectButton;
				console.log('[rpToolbarSelectButton] select: ' + select);

				element.click(function() {
					console.log('[rpToolbarSelectButton] click()');
					console.log('[rpToolbarSelectButton] click(), select: ' + select);
					angular.element(select).trigger('click');

				});

			}
		};
	}
})();