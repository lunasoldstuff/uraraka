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









rpControllers.controller('rpLayoutButtonCtrl', ['$scope', '$rootScope', 'rpAppSettingsService',
	function($scope, $rootScope, rpAppSettingsService) {
		console.log('[rpLayoutButtonCtrl] load');

		$scope.singleColumnLayout = rpAppSettingsService.settings.singleColumnLayout;

		$scope.toggleLayout = function() {
			$scope.singleColumnLayout = !$scope.singleColumnLayout;
			rpAppSettingsService.setSetting('singleColumnLayout', $scope.singleColumnLayout);
		};

	}
]);

rpControllers.controller('rpDialogCloseButtonCtrl', [
	'$scope',
	'$mdDialog',
	'$mdBottomSheet',
	function(
		$scope,
		$mdDialog,
		$mdBottomSheet
	) {
		console.log('[rpDialogCloseButtonCtrl] load');
		$scope.closeDialog = function(e) {
			console.log('[rpDialogCloseButtonCtrl] closeDialog()');

			$mdDialog.hide();
			$mdBottomSheet.hide();

		};
	}
]);


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