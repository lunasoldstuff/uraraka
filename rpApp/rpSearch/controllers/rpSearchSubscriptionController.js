(function() {
	'use strict';
	angular.module('rpSearch').controller('rpSearchSubscriptionCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'rpSubredditsUtilService',
		rpSearchSubscriptionCtrl
	]);

	function rpSearchSubscriptionCtrl($scope, $rootScope, $timeout, rpSubredditsUtilService) {
		console.log('[rpSearchSubscriptionCtrl] loaded.');

		$scope.loadingSubscription = false;
		// $scope.subscribed = false;
		$scope.subscribed = rpSubredditsUtilService.isSubscribed($scope.post.data.display_name);

		$scope.toggleSubscription = function() {
			$scope.loadingSubscription = true;
			//$timeout(angular.noop, 0);


			var action = $scope.subscribed ? 'unsub' : 'sub';

			console.log('[rpSearchSubscriptionCtrl] toggleSubscription(), $scope.post.data.title: ' + $scope.post.data.display_name + ', subscribed: ' + $scope.subscribed);

			rpSubredditsUtilService.subscribe(action, $scope.post.data.name, function(err, data) {
				console.log('[rpSearchSubscriptionCtrl] callback, $scope.post.data.title: ' + $scope.post.data.title);
				if (err) {
					console.log('[rpSearchSubscriptionCtrl] err');
				} else {
					console.log('[rpSearchSubscriptionCtrl] callback, subscribed: ' + $scope.subscribed);
					$scope.loadingSubscription = false;
					console.log('[rpSearchSubscriptionCtrl] callback, subscribed: ' + $scope.subscribed);

				}
			});

		};

		var deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function() {

			$scope.subscribed = rpSubredditsUtilService.isSubscribed($scope.post.data.display_name);

		});

		$scope.$on('$destroy', function() {
			deregisterSubredditsUpdated();

		});

	}

})();