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

rpSearchControllers.controller('rpSearchCtrl', ['$scope', '$rootScope', '$routeParams', 'rpSubredditsUtilService', 'rpSearchUtilService', 'rpSearchFormUtilService',
	function ($scope, $rootScope, $routeParams, rpSubredditsUtilService, rpSearchUtilService, rpSearchFormUtilService) {

		console.log('[rpSearchCtrl] loaded');
		
		//initiate a search.
		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function() {
			console.log('[rpSearchCtrl] search_params_changed listener');
			rpSearchUtilService.search(function(data) {
				// console.log('[rpSearchFormCtrl] submitSearchForm, data: ' + JSON.stringify(data));
				console.log('[rpSearchFormCtrl] submitSearchForm, got data');
			});

		});


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
		} else {
			$scope.params.type = "link";
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

		$scope.$on('$destroy', function() {
			deregisterSearchParamsChanged();
		});

	}
]);