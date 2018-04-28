'use strict';

(function () {

	/*
 	Top level controller.
 	controls sidenav toggling. (This might be better suited for the sidenav controller no?)
  */

	angular.module('rpApp').controller('rpAppCtrl', ['$scope', '$attrs', '$rootScope', '$timeout', '$cookies', '$compile', '$filter', '$mdSidenav', '$mdMedia', 'rpAppAuthService', 'rpSettingsService', 'rpAppUserAgentService', 'rpPlusSubscriptionService', rpAppCtrl]);

	function rpAppCtrl($scope, $attrs, $rootScope, $timeout, $cookies, $compile, $filter, $mdSidenav, $mdMedia, rpAppAuthService, rpSettingsService, rpAppUserAgentService, rpPlusSubscriptionService) {
		console.log('[rpAppCtrl] $attrs.authenticated: ' + $attrs.authenticated);
		console.log('[rpAppCtrl] $attrs.userAgent: ' + $attrs.userAgent);
		console.log('[rpAppCtrl] $cookies');
		// console.log('[rpAppCtrl] $cookies.redditpluscookie: ' + $cookies.get('redditpluscookie'));


		$scope.init = function () {
			console.log('[rpAppCtrl] init(), $attrs.authenticated: ' + $attrs.authenticated);
			console.log('[rpAppCtrl] init(), $attrs.userAgent: ' + $attrs.userAgent);

			//init authenticated
			$scope.authenticated = $attrs.authenticated === 'true';
			rpAppAuthService.setAuthenticated($attrs.authenticated);

			//init user agent
			$scope.userAgent = $attrs.userAgent;
			rpAppUserAgentService.setUserAgent($attrs.userAgent);

			console.log('[rpAppCtrl] $scope.authenticated: ' + $scope.authenticated);

			//check plus subscription as the pasge loads
			rpPlusSubscriptionService.isSubscribed(function (isSubscribed) {
				$scope.isSubscribed = isSubscribed;
			});
		};

		//TODO: Globals, maybe they would be better off in services?
		$scope.isDocked = true;
		$scope.animations = rpSettingsService.settings.animations;
		$scope.theme = rpSettingsService.settings.theme;
		$scope.fontSize = rpSettingsService.settings.fontSize;
		$scope.nightTheme = rpSettingsService.settings.nightTheme;

		//init authenticated
		$scope.authenticated = $attrs.authenticated === true;
		rpAppAuthService.setAuthenticated($attrs.authenticated);

		//init user agent
		$scope.userAgent = $attrs.userAgent;
		rpAppUserAgentService.setUserAgent($attrs.userAgent);

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
			$scope.theme = rpSettingsService.settings.theme;
			$scope.animations = rpSettingsService.settings.animations;
			$scope.fontSize = rpSettingsService.settings.fontSize;
			$scope.nightTheme = rpSettingsService.settings.nightTheme;
		});

		//TODO: is this variable used?
		$scope.dynamicTheme = 'redTheme';

		$scope.appTitle = 'reddup';
		var deregisterHandleTitleChange = $rootScope.$on('rp_title_change_page', function (e, title) {
			if (title === 'frontpage') {
				$scope.appTitle = 'reddup';
			} else {
				$scope.appTitle = 'reddup: ' + title;
			}
		});

		$scope.appDescription = 'A new and exciting reddit web app. The most beautiful and advanced way to browse reddit online.';
		var deregisterHandleDescriptionChange = $rootScope.$on('rp_description_change', function (e, description) {
			console.log('[rpAppCtrl] rp_description_change, description: ' + description);
			if (description === 'default') {
				description = 'A new and exciting reddit web app. The most beautiful and advanced way to browse reddit online.';
			} else {
				description = $filter('limitTo')(description, 200);
			}
			console.log('[rpAppCtrl] rp_description_change, description: ' + description);
			$scope.appDescription = description;
		});

		//TODO: These might be better off in the sidenav controller themselves.
		$scope.sidenavIsOpen = function () {
			return $mdSidenav('left').isOpen();
		};

		$scope.toggleLeft = function () {
			$mdSidenav('left').toggle();
		};

		// $scope.toggleDocked = function() {
		// 	$scope.isDocked = !$scope.isDocked;
		// };

		$scope.close = function () {
			$mdSidenav('left').close();
		};

		$scope.isOpenRules = function () {
			return $mdSidenav('right').isOpen();
		};

		$scope.toggleRules = function () {
			$mdSidenav('right').toggle();
		};

		$scope.loadMoreClick = function () {
			$rootScope.$emit('rp_load_more');
		};

		var deregisterRouteChangeSuccess = $scope.$on('$routeChangeSuccess', function () {
			console.log('[rpAppCtrl] $routeChangeSuccess');
			closeSidenavs();
		});

		function closeSidenavs() {
			if ($mdSidenav('left').isOpen()) {
				$mdSidenav('left').toggle();
			}

			if ($mdSidenav('right').isOpen()) {
				$mdSidenav('right').toggle();
			}
		}

		//TODO: Another global variable
		$scope.slidehsowActive = false;

		var deregisterSlideshowStart = $rootScope.$on('rp_slideshow_start', function () {
			console.log('[rpAppCtrl] slideshow start');
			$scope.slideshowActive = true;
		});

		var deregisterSlideshowEnd = $rootScope.$on('rp_slideshow_end', function () {
			console.log('[rpAppCtrl] slideshow end');
			$scope.slideshowActive = false;
			$timeout(angular.noop, 0);
		});

		$scope.$on('$destroy', function () {
			deregisterHandleTitleChange();
			deregisterRouteChangeSuccess();
			deregisterSettingsChanged();
			deregisterSlideshowEnd();
			deregisterSlideshowStart();
		});
	}
})();