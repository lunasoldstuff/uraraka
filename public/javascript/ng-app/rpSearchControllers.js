'use strict';

var rpSearchControllers = angular.module('rpSearchControllers', []);

rpSearchControllers.controller('rpSearchFormCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'rpSearchUtilService', 'rpSubredditsUtilService',
	'rpLocationUtilService',
	function ($scope, $rootScope, $location, $routeParams, rpSearchUtilService, rpSubredditsUtilService, rpLocationUtilService) {
		console.log('[rpSearchFormCtrl] loaded.');

		$scope.params = rpSearchUtilService.params;

		var searchPathRe = /\/search.*/;
		var onSearchPage = searchPathRe.test($location.path());
		console.log('[rpSearchFormCtrl] $onSearchPage: ' + onSearchPage);
		console.log('[rpSearchFormCtrl] $scope.params: ' + JSON.stringify($scope.params));


		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function() {
			$scope.params = rpSearchUtilService.params;
		});

		// if (onSearchPage) {
		// 	rpSearchUtilService.setParams($scope.params);
		// }

		$scope.submitSearchForm = function() {
			onSearchPage = searchPathRe.test($location.path());
			console.log('[rpSearchFormCtrl] submitSearchForm, onSearchPage: ' + onSearchPage);

			if (!$scope.params.sub)
				$scope.params.sub = 'all';

			if ($scope.params.sub === "")
				$scope.param.sub = 'all';

			if ($scope.params.sub === 'all')
				$scope.params.restrict_sub = false;
			else 
				$scope.params.restrict_sub = true;
			
			console.log('[rpSearchFormCtrl] submitSearchForm, params: ' + JSON.stringify($scope.params));

			if (!onSearchPage) {
				rpLocationUtilService(null, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + $scope.params.sub + 
					'&type=' + $scope.params.type +
					'&restrict_sub=' + $scope.params.restrict_sub +
					'&sort=' + $scope.params.sort, true, false);
			}

			rpSearchUtilService.setParams($scope.params);

		};

		$scope.resetSearchForm = function() {

		};

		$scope.$on('$destroy', function() {
			deregisterSearchParamsChanged();
		});

	}
]);

rpSearchControllers.controller('rpSearchCtrl', ['$scope', '$rootScope', '$routeParams', '$window', 'rpSubredditsUtilService', 'rpSearchUtilService', 'rpSearchFormUtilService',
	'rpUserFilterButtonUtilService', 'rpUserSortButtonUtilService', 'rpPostFilterButtonUtilService', 'rpSubscribeButtonUtilService', 'rpSearchFilterButtonUtilService',
	function ($scope, $rootScope, $routeParams, $window, rpSubredditsUtilService, rpSearchUtilService, rpSearchFormUtilService, rpUserFilterButtonUtilService, rpUserSortButtonUtilService,
		rpPostFilterButtonUtilService, rpSubscribeButtonUtilService, rpSearchFilterButtonUtilService) {

		console.log('[rpSearchCtrl] loaded');

		//initiate a search.
		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function() {
			$rootScope.$emit('progressLoading');
			console.log('[rpSearchCtrl] search_params_changed listener');
			rpSearchUtilService.search(function(data) {
				// console.log('[rpSearchFormCtrl] submitSearchForm, data: ' + JSON.stringify(data));
				console.log('[rpSearchFormCtrl] submitSearchForm, got data');
				$scope.posts = data.data.children;
				$scope.havePosts = true;
				$rootScope.$emit('progressComplete');
			});

		});


		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();

		rpSearchFilterButtonUtilService.show();

		var loadingMore = false;
		$scope.havePosts = false;
		
		var value = $window.innerWidth;
		if (value > 1550) $scope.columns = [1, 2, 3];
		else if (value > 970) $scope.columns = [1, 2];
		else $scope.columns = [1];

		$scope.posts = {};

		/*
			Set search parameters.
		 */
		
		$scope.params = {};
		
		$scope.params.q = $routeParams.q || "";
		$scope.params.sub = $routeParams.sub || rpSubredditsUtilService.currentSub || "all";

		if ($routeParams.type) {
			$scope.params.type = $routeParams.type;
		} else if ($scope.params.sub === "all") {
			$scope.params.type = "sr, link";
			rpSearchFilterButtonUtilService.hide();
		} else {
			$scope.params.type = "link";
			rpSearchFilterButtonUtilService.show();
		}

		if ($routeParams.restrict_sub) {
			$scope.params.restrict_sub = $routeParams.restrict_sub;
		} else if ($scope.params.sub === "all") {
			$scope.params.restrict_sub = false;
		} else {
			$scope.params.restrict_sub = true;
		}

		$scope.params.sort = $routeParams.sort || 'hot';

		//Will initiate a search.
		rpSearchUtilService.setParams($scope.params);
		
		//make sure the search form is open.
		rpSearchFormUtilService.show();


		$scope.morePosts = function() {
			console.log('[rpSearchCtrl] morePosts()');
		};

		var deregisterSearchTabClick = $rootScope.$on('search_tab_click', function(e, tab) {

			console.log('[rpSearchCtrl] search_tab_click, tab: ' + tab);

			$scope.posts = {};
			$scope.havePosts = false;

			//add sort to the seach path.
			
			$rootScope.$emit('progressLoading');

			$scope.params.sort = tab;
			rpSearchUtilService.setParams($scope.params);

			// rpSearchUtilService.search(function(data) {
			// 	console.log('[rpSearchCtrl] search_tab_click, got data');
			// 	$scope.posts = data.data.children;
			// 	$scope.havePosts = true;
			// 	$rootScope.$emit('progressComplete');
			// });

		});

		$scope.$on('$destroy', function() {
			deregisterSearchParamsChanged();
		});

	}
]);

rpSearchControllers.controller('rpSearchTabsCtrl', ['$scope', '$rootScope', 'rpSearchTabsUtilService',
	function ($scope, $rootScope, rpSearchTabsUtilService) {

		selectTab();
		var firstLoadOver = false;

		$scope.tabClick = function(tab) {
			console.log('[rpSearchTabsCtrl] tabClick(), tab: ' + tab);

			if (firstLoadOver) {
				// console.log('[rpPostsTabsCtrl] tabClick(), tab: ' + tab);
				$rootScope.$emit('search_tab_click', tab);
				rpSearchTabsUtilService.setTab(tab);
				
			} else {
				firstLoadOver = true;
			}

		};

		var deregisterSearchTabChange = $rootScope.$on('search_tab_change', function(e, tab) {

			console.log('[rpSearchTabsCtrl] search_tab_change');
			selectTab();

		});


		function selectTab() {

			var tab = rpSearchTabsUtilService.tab;
			console.log('[rpSearchTabsCtrl] selectTab(), tab: ' + tab);

			switch(tab) {
				case 'relevance':
					$scope.selectedIndex = 0;
					break;
				case 'top':
					$scope.selectedIndex = 1;
					break;
				case 'new':
					$scope.selectedIndex = 2;
					break;
				case 'comments':
					$scope.selectedIndex = 3;

			}
		}

		$scope.$on('destroy', function() {
			deregisterSearchTabChange();
		});

	}
]);

rpSearchControllers.controller('rpSearchTimeFilterCtrl', ['$scope', 
	function ($scope) {
	
	}
]);