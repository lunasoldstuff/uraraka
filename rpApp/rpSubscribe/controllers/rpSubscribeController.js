(function() {
	'use strict';
	angular.module('rpSubscribe').controller('rpSubscribeCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'rpSubredditsUtilService',
		rpSubscribeCtrl
	]);

	function rpSubscribeCtrl(
		$scope,
		$rootScope,
		$timeout,
		rpSubredditsUtilService

	) {
		console.log('[rpSubscribeCtrl] loaded');

		$scope.subscribed = rpSubredditsUtilService.subscribed;
		$scope.loadingSubscription = false;

		$scope.toggleSubscription = function() {
			console.log('[rpSubscribeCtrl] toggleSubscription');
			$scope.loadingSubscription = true;
			$timeout(angular.noop, 0);

			rpSubredditsUtilService.subscribeCurrent(function(err, data) {
				if (err) {
					console.log('[rpSubscribeCtrl] err');
				} else {

				}
			});

		};

		var deregisterHideAllButtons = $rootScope.$on('rp_hide_all_buttons', function() {
			$scope.showSubscribe = false;

		});

		var deregisterShowButton = $rootScope.$on('rp_button_visibility', function(e, button, visibility) {
			console.log('[rpSubscribeCtrl] rp_show_button, button: ' + button + ', visibility: ' + visibility);
			$scope.showSubscribe = visibility;
			if (!visibility) {
				rpSubredditsUtilService.resetSubreddit();
			}
		});


		var deregisterSubscriptionStatusChanged = $rootScope.$on('subscription_status_changed', function(e, subscribed) {
			console.log('[rpSubscribeCtrl] on subscription_status_changed, subscribed: ' + subscribed);

			if ($scope.loadingSubscription) {
				$scope.loadingSubscription = false;
				$timeout(angular.noop, 0);

			}

			$scope.subscribed = subscribed;

		});

		$scope.$on('$destroy', function() {
			deregisterSubscriptionStatusChanged();
			deregisterShowButton();
			deregisterHideAllButtons();
		});

	}
})();