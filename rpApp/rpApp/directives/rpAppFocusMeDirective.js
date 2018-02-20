(function() {
	'use strict';
	angular.module('rpApp').directive('rpAppFocusMe', [
		'$timeout',
		'$parse',
		rpAppFocusMe
	]);

	function rpAppFocusMe($timeout, $parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.rpAppFocusMe);
				console.log('[rpAppFocusMe] link function load, model: ' + model);

				scope.$watch(model, function(value) {
					console.log('[rpAppFocusMe] $watch, value: ' + value);

					if (value === true) {
						$timeout(function() {
							element[0].focus();
						});
					}

				});

				element.bind('blur', function() {
					console.log('[rpAppFocusMe] blur');
					scope.$apply(model.assign(scope, false));

				});

			}
		};
	}
})();