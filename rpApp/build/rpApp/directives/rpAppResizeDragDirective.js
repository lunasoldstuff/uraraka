'use strict';

(function () {
	'use strict';

	angular.module('rpApp').directive('rpResizeDrag', ['$rootScope', 'mediaCheck', rpResizeDrag]);

	function rpResizeDrag($rootScope, mediaCheck) {
		return {
			restrict: 'C',
			link: function link(scope, elem, attr) {
				console.log('[rpResizeDrag]');

				mediaCheck.init({
					scope: scope,
					media: [{
						mq: '(max-width: 600px)',
						enter: function enter(mq) {
							elem.removeClass('resize-drag');
						}

					}, {
						mq: '(min-width: 601px)',
						enter: function enter(mq) {
							elem.addClass('resize-drag');
						}
					}]
				});
			}
		};
	}
})();