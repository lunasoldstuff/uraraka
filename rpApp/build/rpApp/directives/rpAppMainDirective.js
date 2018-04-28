'use strict';

(function () {
	'use strict';

	angular.module('rpApp').directive('rpAppMain', ['$animate', rpAppMain]);

	function rpAppMain($animate) {
		return {
			restrict: 'C',
			link: function link(scope, element, attrs) {
				$animate.on('enter', element[0], function callback(element, phase) {
					if (element.hasClass('rp-app-main')) {
						console.log('[rpAppMain] .rp-app-main animation');
						console.log('[rpAppMain] animate enter listener, phase: ' + phase);
						if (phase === 'close') {
							console.log('[rpAppMain] broadcast md-resize-textarea...');
							scope.$broadcast('md-resize-textarea');
						}
					}
				});
			}
		};
	}
})();