(function() {
	'use strict';
	angular.module('rpSidebar').controller('rpSidebarCtrl', [
		'$scope',
		'$rootScope',
		'rpSubredditsService',
		rpSidebarCtrl
	]);

	function rpSidebarCtrl($scope, $rootScope, rpSubredditsService) {

		$scope.about = rpSubredditsService.about.data;

		var deregisterSubredditsAboutUpdated = $rootScope.$on('subreddits_about_updated', function() {
			console.log('[rpSidebarCtrl] subreddits_about_updated');
			$scope.about = rpSubredditsService.about.data;

		});

		$scope.$on('$destroy', function() {
			deregisterSubredditsAboutUpdated();
		});

	}
})();