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

		titleChangeService.title = 'reddipaper: the material frontpage of the internet';
		
		titleChangeService.prepTitleChange = function(_title){
			titleChangeService.title = _title;
			$rootScope.$broadcast('handleTitleChange');
		};

		return titleChangeService;
	}
]);

rpServices.factory('rpSubredditService', ['$rootScope',
	function($rootScope) {
		var subredditService = {};
		subredditService.subreddit = '';
		subredditService.prepSubredditChange = function(_subreddit){
			subredditService.subreddit = _subreddit;
			$rootScope.$broadcast('handleSubredditChange');
		};
		return subredditService;
	}
]);