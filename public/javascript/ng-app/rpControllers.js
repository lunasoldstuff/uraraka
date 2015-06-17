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
		

		$scope.appTitle = 'reddit: the frontpage of the internet';

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

		rpSettingsUtilService.retrieveSettings();

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
rpControllers.controller('rpSubredditsCtrl', ['$scope', 'rpSubredditsUtilService',
	function($scope, rpSubredditsUtilService){
		
		$scope.pinnedSubs = [
			{name: 'frontpage',	url: '/'},
			{name: 'all', url:'/r/all'},
			{name: 'random', url:'/r/random'},
		];

		rpSubredditsUtilService(function(data) {
			$scope.subs = data;
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
rpControllers.controller('rpToolbarCtrl', ['$scope', '$rootScope', '$log', 'rpTitleChangeService', 
	'rpPostFilterButtonUtilService', 'rpUserFilterButtonUtilService', 'rpUserSortButtonUtilService',
	function($scope, $rootScope, $log, rpTitleChangeService, rpPostFilterButtonUtilService,
	rpUserFilterButtonUtilService, rpUserSortButtonUtilService) {
	
		$scope.toolbarTitle = 'reddit: the frontpage of the internet';
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

rpControllers.controller('rpSettingsCtrl', ['$scope', 'rpSettingsUtilService',
	function ($scope, rpSettingsUtilService) {
	
		$scope.over18 = rpSettingsUtilService.getSetting('over18');

		$scope.settingChanged = function(setting, value) {
			rpSettingsUtilService.setSetting(setting, value);
		}

	}
]);