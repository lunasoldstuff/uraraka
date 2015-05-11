'use strict';

var rpUserControllers = angular.module('rpUserControllers', []);

rpUserControllers.controller('rpUserCtrl', 
	[
		'$scope', 
		'$rootScope',
		'$window',
		'$routeParams',
		'rpUserService',
		'rpTitleChangeService',
	
	function($scope, $rootScope, $window, $routeParams, rpUserService, 
		rpTitleChangeService) {

		var value = $window.innerWidth;
		if (value > 1550) $scope.columns = [1, 2, 3];
		else if (value > 970) $scope.columns = [1, 2];
		else $scope.columns = [1];

		$scope.havePosts = false;

		var username = $routeParams.username;
		var where = $routeParams.where || 'overview';
		var sort = $routeParams.sort || 'new';
		
		var t;
		var loadingMore = false;

		$rootScope.$emit('progressLoading');
		rpUserService.query({
			username: username,
			where: where,
			sort: sort
		}, function(data) {
			$rootScope.$emit('progressComplete');
			$scope.posts = data;
			$scope.havePosts = true;
		});

		$scope.morePosts = function() {
			if ($scope.posts && $scope.posts.length > 0) {
				var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
				if (lastPostName && !loadingMore) {
					loadingMore = true;
					$rootScope.$emit('progressLoading');
					rpUserService.query({username: username, where: where, sort: sort, after: lastPostName, t: t}, function(data) {
						Array.prototype.push.apply($scope.posts, data);
						$rootScope.$emit('progressComplete');
					})
				}
			}
		}

		$rootScope.$on('user_tab_click', function(e, tab) {
			where = tab;
			$rootScope.$emit('user_tab_change', tab);
			$rootScope.$emit('progressLoading');
			$scope.havePosts = false;
			rpUserService.query({
				username: username, 
				where: where, 
				sort: sort
			}, function(data) {
				$rootScope.$emit('progressComplete');
				$scope.posts = data;
				$scope.havePosts = true;
			});
		});


	}

]);

rpUserControllers.controller('rpUserTabsCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
	
	$scope.selectedIndex = 0;

		$rootScope.$on('user_tab_change', function(e, tab){
			switch(tab) {
				case 'overview':
					$scope.selectedIndex = 0;
					break;
				case 'submitted':
					$scope.selectedIndex = 1;
					break;
				case 'comments':
					$scope.selectedIndex = 2;
					break;
				case 'gilded':
					$scope.selectedIndex = 3;
					break;
				default:
					$scope.selectedIndex = 0;
					break;
			}
		});

		$scope.tabClick = function(tab) {
			$rootScope.$emit('user_tab_click', tab);
		};
	}
]);