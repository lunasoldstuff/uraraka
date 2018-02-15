(function() {
	'use strict';
	angular.module('rpToolbar').controller('rpToolbarCtrl', [
		'$scope',
		'$rootScope',
		'$log',
		'$element',
		'$timeout',
		'rpAppLocationService',
		'rpPlusSubscriptionUtilService',
		rpToolbarCtrl
	]);

	function rpToolbarCtrl(
		$scope,
		$rootScope,
		$log,
		$element,
		$timeout,
		rpAppLocationService,
		rpPlusSubscriptionUtilService

	) {

		/*
			SEARCH TOOLBAR
		 */

		$scope.linkTitle = false;
		$scope.showToolbar = false;
		$scope.colorLoaded = false;
		$scope.count = 0;

		var subredditRe = /r\/[\w]+/;
		var userRe = /u\/[\w]+/;

		$timeout(function() {
			$scope.showToolbar = true;
		}, 0);

		var deregisterHandleTitleChange = $rootScope.$on('rp_title_change_toolbar', function(e, title) {
			console.log('[rpToolbarCtrl] handleTitleChange(), title: ' + title);

			$scope.toolbarTitle = title;
			$scope.linkTitle = subredditRe.test(title) || userRe.test(title);

			console.log('[rpToolbarCtrl] handleTitleChange(), $scope.linkTitle: ' + $scope.linkTitle);

		});

		$scope.brandLink = function(e) {
			// console.log('[rpToolbarCtrl] brandLink(), e.data("events"): ' + e.data("events"));
			rpAppLocationService(e, '/', '', true, true);
		};

		/*
			Button Handlers
		 */
		var deregisterHideAllButtons = $rootScope.$on('rp_hide_all_buttons', function() {
			$scope.showPostTime = false;
			$scope.showPostSort = false;
			$scope.showUserWhere = false;
			$scope.showUserTime = false;
			$scope.showUserSort = false;
			$scope.showSearchTime = false;
			$scope.showRules = false;
			$scope.showRefresh = false;
			$scope.showSearchSort = false;
			$scope.showArticleSort = false;
			$scope.showMessageWhere = false;
			$scope.showLayout = false;
			$scope.showSlideshow = false;
		});

		rpPlusSubscriptionUtilService.isSubscribed(function(isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		var deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			$scope.isSubscribed = isSubscribed;
		});

		var deregisterShowButton = $rootScope.$on('rp_button_visibility', function(e, button, visibility) {
			console.log('[rpToolbarCtrl] rp_show_button, button: ' + button + ', visibility: ' + visibility);
			$scope[button] = visibility;
		});

		var deregisterRefreshButtonSpin = $rootScope.$on('rp_refresh_button_spin', function(e, spin) {
			$scope.spinRefresh = spin;
		});

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			$scope.colorLoaded = true;
			deregisterSettingsChanged();
		});

		$scope.$on('$destroy', function() {
			// deregisterShowToolbarShadowChange();
			deregisterHandleTitleChange();
			deregisterSettingsChanged();
			deregisterRefreshButtonSpin();
			deregisterPlusSubscriptionUpdate();
		});

	}

})();