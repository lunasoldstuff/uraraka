(function() {
	'use strict';

	angular.module('rpApp').factory('rpTitleChangeService', [
		'$rootScope',
		rpTitleChangeService
	]);

	function rpTitleChangeService($rootScope) {
		return function(title, page, toolbar) {
			console.log('[rpTitleChangeService] title: ' + title);

			if (page) {
				$rootScope.$emit('rp_title_change_page', title);
			}

			if (toolbar) {
				$rootScope.$emit('rp_title_change_toolbar', title);
			}

		};
	}

})();