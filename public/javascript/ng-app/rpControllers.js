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
		
		var deregisterHandleTitleChange = $scope.$on('handleTitleChange', function(e, d) {
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

		$scope.$on('$destroy', function() {
			deregisterHandleTitleChange();
		});




	}
]);

rpControllers.controller('rpLoginCtrl', ['$scope', '$location', 
	function($scope, $location) {

		$scope.safePath = encodeURIComponent($location.path()); 
		console.log('[rpLoginCtrl] $scope.safePath: ' + $scope.safePath);

		var deregisterRouteUpdate = $scope.$on('$locationChangeSuccess', function() {
			$scope.safePath = encodeURIComponent($location.path()); 
			console.log('[rpLoginCtrl] $scope.safePath: ' + $scope.safePath);
		});

		// $scope.$on('$destroy', function() {
		// 	deregisterRouteUpdate();
		// });

	}
]);

rpControllers.controller('rpIdentityCtrl', ['$scope', 'rpIdentityUtilService', 'rpAuthUtilService',
	function($scope, rpIdentityUtilService, rpAuthUtilService){
		
		$scope.loading = true;

		rpIdentityUtilService.getIdentity(function(identity) {
			console.log('[rpIdentityCtrl] identity: ' + JSON.stringify(identity));

			$scope.identity = identity;	
			$scope.loading = false;
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
rpControllers.controller('rpSubredditsCtrl', ['$scope', '$rootScope', 'rpSubredditsUtilService', 'rpLocationUtilService',
	function($scope, $rootScope, rpSubredditsUtilService, rpLocationUtilService){
		
		$scope.pinnedSubs = [
			{name: 'frontpage',	url: '/'},
			{name: 'all', url:'/r/all'},
			{name: 'random', url:'/r/random'},
		];

		rpSubredditsUtilService.updateSubreddits();

		var deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function() {
			$scope.subs = rpSubredditsUtilService.subs;
			
		});

		$scope.openSubreddit = function(e, url) {
			rpLocationUtilService(e, url, '', true, false);
		};

		$scope.$on('$destroy', function() {
			deregisterSubredditsUpdated();
		});
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
rpControllers.controller('rpToolbarCtrl', ['$scope', '$rootScope', '$log', '$element', 'rpTitleChangeService', 
	'rpPostFilterButtonUtilService', 'rpUserFilterButtonUtilService', 'rpUserSortButtonUtilService', 
	'rpSubscribeButtonUtilService', 'rpSearchFormUtilService', 'rpSearchFilterButtonUtilService', 'rpToolbarShadowUtilService',
	function($scope, $rootScope, $log, $element, rpTitleChangeService, rpPostFilterButtonUtilService,
	rpUserFilterButtonUtilService, rpUserSortButtonUtilService, rpSubscribeButtonUtilService, 
	rpSearchFormUtilService, rpSearchFilterButtonUtilService, rpToolbarShadowUtilService) {

		/*
			SEARCH TOOLBAR
		 */	
		$scope.isOpen = false;
		$scope.count = 0;
		$scope.showToolbarShadow = rpToolbarShadowUtilService.showToolbarShadow;

		var deregisterShowToolbarShadowChange = $scope.$on('show_toolbar_shadow_change', function() {
			$scope.showToolbarShadow = rpToolbarShadowUtilService.showToolbarShadow;
		});

		var deregisterHandleTitleChange = $scope.$on('handleTitleChange', function(e, d) {
			$scope.toolbarTitle = rpTitleChangeService.title;
		});

		/*
			Show the filter button.
		 */
		$scope.showPostFilter = rpPostFilterButtonUtilService.isVisible;

		var deregisterPostFilterButtonVisibility = $rootScope.$on('post_filter_button_visibility', function() {
			$scope.showPostFilter = rpPostFilterButtonUtilService.isVisible;
		});

		$scope.showSubscribe = rpSubscribeButtonUtilService.isVisible;

		var deregisterSubscribeVisibility = $rootScope.$on('subscribe_visibility', function() {
			$scope.showSubscribe = rpSubscribeButtonUtilService.isVisible;
		});

		$scope.showUserFilter = rpUserFilterButtonUtilService.isVisible;

		var deregisterUserFilterButtonVisibility = $rootScope.$on('user_filter_button_visibility', function() {
			$scope.showUserFilter = rpUserFilterButtonUtilService.isVisible;
		});

		$scope.showUserSort = rpUserSortButtonUtilService.isVisible;

		var deregisterUserSortButtonVisibility = $rootScope.$on('user_sort_button_visibility', function() {
			$scope.showUserSort = rpUserSortButtonUtilService.isVisible;
		});

		$scope.showSearchFilter = rpSearchFilterButtonUtilService.isVisible;

		var deregisterSearchFilterButtonVisibility = $rootScope.$on('search_filter_button_visibility', function() {
			$scope.showSearchFilter = rpSearchFilterButtonUtilService.isVisible;
		});

		/*
			SEARCH
		 */
		
		$scope.showSearchForm = rpSearchFormUtilService.isVisible;

		var deregisterSearchFormUtilService = $rootScope.$on('search_form_visibility', function() {
			$scope.showSearchForm = rpSearchFormUtilService.isVisible;
		});

		$scope.toggleSearchForm = function() {
			$scope.showSearchForm = !$scope.showSearchForm;
		
		};

		$scope.$on('$destroy', function() {
			deregisterShowToolbarShadowChange();
			deregisterSearchFormUtilService();
			deregisterPostFilterButtonVisibility();
			deregisterSubscribeVisibility();
			deregisterUserFilterButtonVisibility();
			deregisterUserSortButtonVisibility();
			deregisterSearchFilterButtonVisibility();
			deregisterHandleTitleChange();
		});

	}
]);

rpControllers.controller('rpSubscribeCtrl', ['$scope', '$rootScope', 'rpSubredditsUtilService',
	function ($scope, $rootScope, rpSubredditsUtilService) {
		console.log('[rpSubscribeCtrl] loaded');

		$scope.subscribed = rpSubredditsUtilService.subscribed;
		$scope.loadingSubscription = false;

		$scope.toggleSubscription = function() {
			console.log('[rpSubscribeCtrl] toggleSubscription');
			$scope.loadingSubscription = true;
			rpSubredditsUtilService.subscribeCurrent();

		};

		var deregisterSubscriptionStatusChanged = $rootScope.$on('subscription_status_changed', function(e, subscribed) {
			console.log('[rpSubscribeCtrl] on subscription_status_changed, subscribed: ' + subscribed);
			
			if ($scope.loadingSubscription)
				$scope.loadingSubscription = false;
			
			$scope.subscribed = subscribed;

		});

		$scope.$on('$destroy', function() {
			deregisterSubscriptionStatusChanged();
		});

	}
]);