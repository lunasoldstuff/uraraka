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

			rpSearchUtilService.setParams($scope.params, !onSearchPage, false);

		};

		$scope.resetSearchForm = function() {

		};

		$scope.$on('$destroy', function() {
			deregisterSearchParamsChanged();
		});

	}
]);

rpSearchControllers.controller('rpSearchCtrl', [
		'$scope', 
		'$rootScope', 
		'$routeParams', 
		'$window', 
		'$mdDialog',
		'rpSubredditsUtilService', 
		'rpSearchUtilService', 
		'rpSearchFormUtilService',
		'rpSearchTabsUtilService', 
		'rpUserFilterButtonUtilService', 
		'rpUserSortButtonUtilService', 
		'rpPostFilterButtonUtilService', 
		'rpSubscribeButtonUtilService', 
		'rpSearchFilterButtonUtilService',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',
		'rpByIdUtilService',
		'rpLocationUtilService',
		'rpSettingsUtilService',

	
	function (
		$scope, 
		$rootScope, 
		$routeParams, 
		$window, 
		$mdDialog,
		rpSubredditsUtilService, 
		rpSearchUtilService, 
		rpSearchFormUtilService, 
		rpSearchTabsUtilService, 
		rpUserFilterButtonUtilService, 
		rpUserSortButtonUtilService,
		rpPostFilterButtonUtilService, 
		rpSubscribeButtonUtilService, 
		rpSearchFilterButtonUtilService,
		rpSaveUtilService,
		rpUpvoteUtilService,
		rpDownvoteUtilService,
		rpByIdUtilService,
		rpLocationUtilService,
		rpSettingsUtilService


	) {

		console.log('[rpSearchCtrl] loaded');
		
		var loadingMore = false;
		$scope.havePosts = false;

		//initiate a search.
		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function() {
			$rootScope.$emit('progressLoading');
			console.log('[rpSearchCtrl] search_params_changed listener');
			rpSearchUtilService.search(function(data) {
				// console.log('[rpSearchFormCtrl] submitSearchForm, data: ' + JSON.stringify(data));
				console.log('[rpSearchFormCtrl] submitSearchForm, got data, $scope.params.after: ' + $scope.params.after);

				if (data) {

					if ($scope.params.after) {
						console.log('[rpSearchCtrl] posts concat.');
						Array.prototype.push.apply($scope.posts, data.data.children);
						loadingMore = false;
			
					}
					else {
						console.log('[rpSearchCtrl] posts replace.');
						$scope.posts = data.data.children;
						$scope.havePosts = true;
					}

				}

				$rootScope.$emit('progressComplete');

			});
		});

		/*
			show/hide toolbar buttons
		 */
		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpSearchFilterButtonUtilService.show();
		
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
		rpSearchTabsUtilService.setTab($scope.params.sort);

		$scope.params.t = $routeParams.t || 'all';

		$scope.params.after = $routeParams.after || '';

		$scope.params.count = parseInt($routeParams.count) || 0;

		//Will initiate a search.
		rpSearchUtilService.setParams($scope.params, false, true);
		
		//make sure the search form is open.
		rpSearchFormUtilService.show();


		$scope.morePosts = function() {
		
			if ($scope.posts && $scope.posts.length > 0) {

				var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
				console.log('[rpSearchCtrl] morePosts(), lastPostName: ' + lastPostName);
				console.log('[rpSearchCtrl] morePosts(), loadingMore: ' + loadingMore);

				if (lastPostName && !loadingMore) {
					loadingMore = true;
					$rootScope.$emit('progressLoading');

					$scope.params.after = lastPostName;

					$scope.params.count += $scope.posts.length;
					console.log('[rpSearchCtrl] morePosts(), count: ' + $scope.params.count);

					rpSearchUtilService.setParams($scope.params, false, false);

				}

			}

		};

		$scope.savePost = function(post) {
				
			rpSaveUtilService(post);

		};

		$scope.upvotePost = function(post) {

			rpUpvoteUtilService(post);

		};
		
		$scope.downvotePost = function(post) {
			
			rpDownvoteUtilService(post);

		};

		/*
			Manage setting to open comments in a dialog or window.
		*/
		$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function(data) {
			$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;
		});

		$scope.showComments = function(e, post) {
			
			if ($scope.commentsDialog && !e.ctrlKey) {
				$mdDialog.show({
					controller: 'rpCommentsDialogCtrl',
					templateUrl: 'partials/rpCommentsDialog',
					targetEvent: e,
					locals: {
						post: post
					},
					clickOutsideToClose: true,
					escapeToClose: false

				});
			
			} else {
				rpLocationUtilService(e, '/r/' + post.data.subreddit + '/comments/' + post.data.id, '', true, false);
			}

		};

		var deregisterSearchTimeClick = $rootScope.$on('search_time_click', function(e, time) {

			console.log('[rpSearchCtrl] search_time_click, time: ' + time);
			
			$scope.posts = {};
			$scope.havePosts = false;
			
			$scope.params.t = time;
			$scope.params.after = '';
			rpSearchUtilService.setParams($scope.params, false, false);

		});

		var deregisterSearchTabClick = $rootScope.$on('search_tab_click', function(e, tab) {

			console.log('[rpSearchCtrl] search_tab_click, tab: ' + tab);

			$scope.posts = {};
			$scope.havePosts = false;
			
			$scope.params.sort = tab;
			$scope.params.t = 'all';
			$scope.params.after = '';
			rpSearchUtilService.setParams($scope.params, false, false);
		});

		$scope.$on('$destroy', function() {
			deregisterSearchParamsChanged();
			deregisterSearchTabClick();
			deregisterSearchTimeClick();
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

rpSearchControllers.controller('rpSearchTimeFilterCtrl', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$scope.selectTime = function(value) {
			$rootScope.$emit('search_time_click', value);
		};
	}
]);