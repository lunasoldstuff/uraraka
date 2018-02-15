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




rpControllers.controller('rpErrorCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'rpAppTitleChangeService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		rpAppTitleChangeService
	) {

		$rootScope.$emit('rp_progress_stop');
		$rootScope.$emit('rp_hide_all_buttons');
		rpAppTitleChangeService('oops', true, true);

		$scope.status = parseInt($routeParams.status) || 404;
		$scope.message = $routeParams.message;

		console.log('[rpErrorCtrl] $routeParams: ' + JSON.stringify($routeParams));
		console.log('[rpErrorCtrl] $routeParams.status: ' + $routeParams.status);
		console.log('[rpErrorCtrl] $scope.status: ' + $scope.status);

		if (!$scope.message) {
			if ($scope.status === 404) {
				$scope.message = "Did not find the page you're looking four-oh-four.";
			} else if ($scope.status === 403) {
				$scope.message = "Page is forbidden :/ Maybe you have to message the mods for permission.";
			} else {
				$scope.message = "Oops an error occurred.";
			}

		}

	}
]);

rpControllers.controller('rpSidebarCtrl', ['$scope', '$rootScope', 'rpSubredditsUtilService',
	function($scope, $rootScope, rpSubredditsUtilService) {

		$scope.about = rpSubredditsUtilService.about.data;

		var deregisterSubredditsAboutUpdated = $rootScope.$on('subreddits_about_updated', function() {
			console.log('[rpSidebarCtrl] subreddits_about_updated');
			$scope.about = rpSubredditsUtilService.about.data;

		});

		$scope.$on('$destroy', function() {
			deregisterSubredditsAboutUpdated();
		});

	}
]);

rpControllers.controller('rpSpeedDialCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'rpAppAuthService',
	'rpToastService',
	'rpAppSettingsService',
	'rpAppLocationService',
	'rpAppIsMobileViewService',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		rpAppAuthService,
		rpToastService,
		rpAppSettingsService,
		rpAppLocationService,
		rpAppIsMobileViewService

	) {

		console.log('[rpSpeedDialCtrl] load, $scope.subreddit: ' + $scope.subreddit);

		var sub = $scope.subreddit !== 'all' ? $scope.subreddit : "";
		console.log('[rpSpeedDialCtrl] load, sub: ' + sub);

		$scope.isOpen = false;
		$scope.direction = "up";

		$scope.open = function() {
			if ($scope.isOpen === false) {
				$scope.isOpen = true;
			}
		};

		$scope.collapse = function() {
			if ($scope.isOpen === true) {
				$scope.isOpen = false;
			}
		};

		var search = "";

		$scope.newLink = function(e) {
			if (rpAppAuthService.isAuthenticated) {

				if ((rpAppSettingsService.settings.submitDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
					$mdDialog.show({
						controller: 'rpSubmitDialogCtrl',
						templateUrl: 'rpSubmit/views/rpSubmitLinkDialog.html',
						targetEvent: e,
						locals: {
							subreddit: sub
						},
						clickOutsideToClose: false,
						escapeToClose: false

					});

				} else {
					if (sub) {
						search = 'sub=' + sub;
					}
					console.log('[rpPostFabCtrl] submit link page, search: ' + search);
					rpAppLocationService(e, '/submitLink', search, true, false);
				}


				$scope.fabState = 'closed';

			} else {
				$scope.fabState = 'closed';
				rpToastService("you must log in to submit a link", "sentiment_neutral");
			}
		};

		$scope.newText = function(e) {

			console.log('[rpSpeedDialCtrl] newText() e.ctrlKey: ' + e.ctrlKey);

			if (rpAppAuthService.isAuthenticated) {

				if ((rpAppSettingsService.settings.submitDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
					$mdDialog.show({
						controller: 'rpSubmitDialogCtrl',
						templateUrl: 'rpSubmit/views/rpSubmitTextDialog.html',
						targetEvent: e,
						locals: {
							subreddit: sub
						},
						clickOutsideToClose: false,
						escapeToClose: false

					});

				} else {
					if (sub) {
						search = 'sub=' + sub;
					}
					console.log('[rpPostFabCtrl] submit text page, search: ' + search);
					rpAppLocationService(e, '/submitText', search, true, false);

				}

				$scope.fabState = 'closed';

			} else {
				$scope.fabState = 'closed';
				rpToastService("you must log in to submit a self post", "sentiment_neutral");
			}
		};

		$scope.$on('$destroy', function() {});


	}
]);


rpControllers.controller('rpRefreshButtonCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		console.log('[rpRefreshButtonCtrl] load');
		$scope.refresh = function() {
			console.log('[rpRefreshButtonCtrl] refresh()');
			$rootScope.$emit('rp_refresh');
		};
	}
]);

rpControllers.controller('rpSlideshowButtonCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		console.log('[rpSlideshowButtonCtrl] load');
		$scope.startSlideshow = function() {
			console.log('[rpSlideshowButtonCtrl] startSlideshow()');
			$rootScope.$emit('rp_slideshow_start');
		};
	}
]);

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