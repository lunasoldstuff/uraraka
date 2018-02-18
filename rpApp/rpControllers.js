'use strict';

/* Controllers */

var rpControllers = angular.module('rpControllers', []);





/*
	Sidenav Subreddits Controller
	Gets popular subreddits.
 */




// rpControllers.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
//   $scope.close = function() {
// 	$mdSidenav('left').close();
//   };
// });









rpControllers.controller('rpGotoSubredditsCtrl', [
	'$scope',
	function($scope) {
		console.log('[rpGotoSubredditsCtrl] load');
		$scope.isOpen = false;

		$scope.toggleOpen = function(e) {
			$scope.isOpen = !$scope.isOpen;
		};

	}
]);

rpControllers.controller('rpGotoSubredditFormCtrl', [
	'$scope',
	'rpAppLocationService',
	function(
		$scope,
		rpAppLocationService
	) {
		console.log('[rpGotoSubredditFormCtrl] load');

		var subredditRe = /(?:r\/)?(\w+)/i;
		var sub;
		var search;

		$scope.GotoSubredditFormSubmit = function(e) {
			console.log('[rpGotoSubredditFormCtrl] $scope.search: ' + $scope.s);
			var groups;

			groups = $scope.s.match(subredditRe);

			if (groups) {
				sub = groups[1];
			}


			if (sub) {
				rpAppLocationService(e, '/r/' + sub, '', true, false);
			}
		};
	}
]);