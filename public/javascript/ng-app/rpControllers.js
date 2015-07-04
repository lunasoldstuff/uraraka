'use strict';

/* Controllers */

var rpControllers = angular.module('rpControllers', []);

/*
	Top level controller.
	controls sidenav toggling. (This might be better suited for the sidenav controller no?)
 */
rpControllers.controller('rpAppCtrl', 
	[
		'$scope', 
		'$rootScope',
		'$timeout', 
		'$mdSidenav', 
		'$log', 
		'rpTitleChangeService',
		'rpAuthUtilService',
		'rpSettingsUtilService',
	
	function($scope, $rootScope, $timeout, $mdSidenav, $log, rpTitleChangeService, rpAuthUtilService, rpSettingsUtilService) {
		
		$scope.$on('handleTitleChange', function(e, d) {
			$scope.appTitle = rpTitleChangeService.title;
		});

		$scope.toggleLeft = function() {
			$mdSidenav('left').toggle();
		};

		$scope.close = function() {
			$mdSidenav('left').close();
		};

		$scope.$watch('authenticated', function(newValue, oldValue) {

			rpAuthUtilService.setAuthenticated(newValue);

		});

	}
]);

rpControllers.controller('rpIdentityCtrl', ['$scope', 'rpIdentityUtilService', 'rpAuthUtilService',
	function($scope, rpIdentityUtilService, rpAuthUtilService){
		
		rpIdentityUtilService(function(data) {
			$scope.identity = data;	
		});

		// rpIdentityService.query(function(data) {

		// 	$scope.identity = data;
			
		// 	rpAuthUtilService.setIdentity($scope.identity);

		// });

	}
]);

/*
	Sidenav Subreddits Controller
	Gets popular subreddits.
 */
rpControllers.controller('rpSubredditsCtrl', ['$scope', '$rootScope', '$location', 'rpSubredditsUtilService',
	function($scope, $rootScope, $location, rpSubredditsUtilService){
		
		$scope.pinnedSubs = [
			{name: 'frontpage',	url: '/'},
			{name: 'all', url:'/r/all'},
			{name: 'random', url:'/r/random'},
		];

		rpSubredditsUtilService.updateSubreddits();

		$rootScope.$on('subreddits_updated', function() {
			$scope.subs = rpSubredditsUtilService.subs;
			
		});

		$scope.openSubreddit = function(data) {
			$location.path(data, true);
		};
	}
]);

rpControllers.controller('rpToastCtrl', ['$scope', '$rootScope', '$mdToast', 'toastMessage',
	function($scope, $rootScope, $mdToast, toastMessage){
		$scope.toastMessage = toastMessage;

		$scope.closeToast = function() {
			$mdToast.close();
		};

	}
]);

// rpControllers.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
//   $scope.close = function() {
// 	$mdSidenav('left').close();
//   };
// });

/*
	Toolbar controller handles title change through titleService.
 */
rpControllers.controller('rpToolbarCtrl', ['$scope', '$rootScope', '$log', 'rpTitleChangeService', 
	'rpPostFilterButtonUtilService', 'rpUserFilterButtonUtilService', 'rpUserSortButtonUtilService', 'rpSubscribeButtonUtilService',
	function($scope, $rootScope, $log, rpTitleChangeService, rpPostFilterButtonUtilService,
	rpUserFilterButtonUtilService, rpUserSortButtonUtilService, rpSubscribeButtonUtilService) {
	
		$scope.$on('handleTitleChange', function(e, d) {
			$scope.toolbarTitle = rpTitleChangeService.title;
		});

		/*
			Show the filter button.
		 */
		$scope.showPostFilter = rpPostFilterButtonUtilService.isVisible;

		$rootScope.$on('post_filter_button_visibility', function() {
			
			$scope.showPostFilter = rpPostFilterButtonUtilService.isVisible;

		});

		$scope.showSubscribe = rpSubscribeButtonUtilService.isVisible;

		$rootScope.$on('subscribe_visibility', function() {
			$scope.showSubscribe = rpSubscribeButtonUtilService.isVisible;
		});

		$scope.showUserFilter = rpUserFilterButtonUtilService.isVisible;

		$rootScope.$on('user_filter_button_visibility', function() {
			
			$scope.showUserFilter = rpUserFilterButtonUtilService.isVisible;

		});

		$scope.showUserSort = rpUserSortButtonUtilService.isVisible;

		$rootScope.$on('user_sort_button_visibility', function() {
			
			$scope.showUserSort = rpUserSortButtonUtilService.isVisible;

		});

	}
]);

rpControllers.controller('rpSubscribeCtrl', ['$scope', '$rootScope', 'rpSubredditsUtilService',
	function ($scope, $rootScope, rpSubredditsUtilService) {
		console.log('[rpPostsSubCtrl] loaded');

		$scope.subscribed = "";
		$scope.loadingSubscription = false;

		$scope.toggleSubscription = function() {
			console.log('[rpPostsSubCtrl] toggleSubscription');
			$scope.loadingSubscription = true;
			rpSubredditsUtilService.subscribe();

		};

		$rootScope.$on('subscription_status_changed', function(e, isSubscribed) {
			$scope.loadingSubscription = false;
			$scope.subscribed = isSubscribed;
		});

		// $rootScope.$on('subreddit_changed', function() {
			

		// 	if ($scope.subscribed !== "") {
				
		// 		updateSubscriptionStatus();
		// 	}

		// });

		// $rootScope.$on('subreddits_updated', function(e) {
		// 	updateSubscriptionStatus();
		// });

		// function updateSubscriptionStatus() {
		// 	if (currentSub) {
		// 		$scope.subscribed = rpSubredditsUtilService.isSubscribed(currentSub);
		// 	}
		// }

	}
]);