'use strict';

/* Services */

var rpServices = angular.module('rpServices', []);

/*
	Facillitates communication between toolbarCtrl and indexCtrl to
	change the title on page load.
 */
rpServices.factory('rpTitleChangeService', ['$rootScope',
	function($rootScope) {

		var titleChangeService = {};

		titleChangeService.title = 'frontpage';

		titleChangeService.prepTitleChange = function(_title) {
			titleChangeService.title = _title;
			$rootScope.$broadcast('handleTitleChange');
		};

		return titleChangeService;
	}
]);