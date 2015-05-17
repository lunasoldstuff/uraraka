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
	
	function($scope, $rootScope, $timeout, $mdSidenav, $log, rpTitleChangeService, rpAuthUtilService) {
		

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
rpControllers.controller('rpSubredditsCtrl', ['$scope', 'rpSubredditsService',
	function($scope, rpSubredditsService){
		$scope.subs = rpSubredditsService.query();
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
rpControllers.controller('rpToolbarCtrl', ['$scope', '$rootScope', '$log', 'rpTitleChangeService', 'rpPostsTabUtilService',
	function($scope, $rootScope, $log, rpTitleChangeService, rpPostsTabUtilService) {
	
		var tab = rpPostsTabUtilService.tab;

		$scope.filter = (tab === 'top' || tab === 'controversial');

		$scope.toolbarTitle = 'reddit: the frontpage of the internet';
		$scope.$on('handleTitleChange', function(e, d) {
			$scope.toolbarTitle = rpTitleChangeService.title;
		});

		$rootScope.$on('posts_tab_change', function() {
			
			tab = rpPostsTabUtilService.tab;
			$scope.filter = (tab === 'top' || tab === 'controversial');

		});
	}
]);