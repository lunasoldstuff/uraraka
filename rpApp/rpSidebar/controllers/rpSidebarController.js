(function() {
	'use strict';
	angular.module('rpSidebar').controller('rpSidebarCtrl', [
		'$scope',
		'$rootScope',
		'rpSubredditsUtilService',
		rpSidebarCtrl
	]);

	function rpSidebarCtrl($scope, $rootScope, rpSubredditsUtilService) {

		$scope.about = rpSubredditsUtilService.about.data;

		var deregisterSubredditsAboutUpdated = $rootScope.$on('subreddits_about_updated', function() {
			console.log('[rpSidebarCtrl] subreddits_about_updated');
			$scope.about = rpSubredditsUtilService.about.data;

		});

		$scope.$on('$destroy', function() {
			deregisterSubredditsAboutUpdated();
		});

	}
})();