// 'use strict';

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

			if (!$scope.params.sub || $scope.params.sub === "")
				$scope.params.sub = 'all';

			if ($scope.params.sub === 'all')
				$scope.params.restrict_sub = false;
			else 
				$scope.params.restrict_sub = true;
			
			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params: ' + JSON.stringify($scope.params));

			rpLocationUtilService(null, '/search', 
				'q='+ $scope.params.q +
				'&sub=' + $scope.params.sub + 
				'&type=' + $scope.params.type +
				'&restrict_sub=' + $scope.params.restrict_sub +
				'&sort=' + $scope.params.sort +
				'&after=' + $scope.params.after +
				'&t=' + $scope.params.t, !onSearchPage, false);

			if (onSearchPage) {
				$rootScope.$emit('search_form_submitted');
			}

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
		'$mdBottomSheet',
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
		'$location',

	
	function (
		$scope, 
		$rootScope, 
		$routeParams, 
		$window, 
		$mdDialog,
		$mdBottomSheet,
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
		rpSettingsUtilService,
		$location


	) {


		console.log('[rpSearchCtrl] loaded, $scope.$id: ' + $scope.$id);
		/*
			UI Updates
		 */

		var value = $window.innerWidth;
		if (value > 1550) $scope.columns = [1, 2, 3];
		else if (value > 970) $scope.columns = [1, 2];
		else $scope.columns = [1];

		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpSearchFilterButtonUtilService.show();
		
		$scope.posts = {};
		$scope.links = {};
		$scope.subs = {};
		$scope.havesubs = $scope.haveLinks = $scope.havePosts = false;
		var loadingMore = false;

		$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;

		/*
			Set search parameters.
		 */
		$scope.params = rpSearchUtilService.params;


		if ($routeParams.q)
			$scope.params.q = $routeParams.q;

		// $scope.params.sub = $routeParams.sub || rpSubredditsUtilService.currentSub || "all";
		if ($routeParams.sub) $scope.params.sub = $routeParams.sub;
		else if (rpSubredditsUtilService.currentSub) $scope.params.sub = rpSubredditsUtilService.currentSub;

		if ($routeParams.type) 
			$scope.params.type = $routeParams.type;

		if ($routeParams.restrict_sub) 
			$scope.params.restrict_sub = $routeParams.restrict_sub;

		if ($routeParams.t) $scope.params.t = $routeParams.t;

		if ($routeParams.sort) 
			$scope.params.sort = $routeParams.sort;
		rpSearchTabsUtilService.setTab($scope.params.sort);

		//make sure the search form is open.
		rpSearchFormUtilService.show();

		$scope.type = $scope.params.type;

		/*
			Initiate first search.
		 */
		$rootScope.$emit('progressLoading');
		

		/*
			Perform two search requests if we want both subs and links.

		 */
		if ($scope.params.type === "sr, link") {

			console.log('[rpSearchCtrl] load sr and link');

			$scope.params.type = "sr";
			$scope.params.limit = 3;
			console.log('[rpSearchCtrl] rpSearchUtilService.params.limit: ' + rpSearchUtilService.params.limit);

			rpSearchUtilService.search(function(data) {
				$scope.subs = data.data.children;
				$scope.subs.push({more: true});
				$scope.haveSubs = true;
				
				if ($scope.subs && $scope.links) {
					$rootScope.$emit('progressComplete');
					$scope.params.limit = 24;
				}

			});

			$scope.params.type = "link";
			$scope.params.limit = 3;
			rpSearchUtilService.search(function(data) {
				$scope.links = data.data.children;
				$scope.links.push({more: true});
				$scope.haveLinks = true;
				
				if ($scope.subs && $scope.links) {
					$rootScope.$emit('progressComplete');
					$scope.params.limit = 24;
				}

			});


		} else {
			console.log('[rpSearchCtrl] load sr or link');

			rpSearchUtilService.search(function(data) {
				$rootScope.$emit('progressComplete');
				$scope.posts = data.data.children;
				$scope.havePosts = true;
			});
			
		}

		$scope.morePosts = function() {
			console.log('[rpSearchCtrl] morePost()');

			if ($scope.posts && $scope.posts.length > 0) {

				var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
				console.log('[rpSearchCtrl] morePosts(), lastPostName: ' + lastPostName);
				console.log('[rpSearchCtrl] morePosts(), loadingMore: ' + loadingMore);

				if (lastPostName && !loadingMore) {
					loadingMore = true;
					$scope.params.after = lastPostName;
					
					rpLocationUtilService(null, '/search', 
						'q='+ $scope.params.q +
						'&sub=' + $scope.params.sub + 
						'&type=' + $scope.params.type +
						'&restrict_sub=' + $scope.params.restrict_sub +
						'&sort=' + $scope.params.sort +
						'&after=' + $scope.params.after +
						'&t=' + $scope.params.t, false, false);


					$rootScope.$emit('progressLoading');
				
					rpSearchUtilService.search(function(data) {
						$rootScope.$emit('progressComplete');
						Array.prototype.push.apply($scope.posts, data.data.children);
						$scope.havePosts = true;
						loadingMore = false;
					});
				}
			}
		};		

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

		$scope.searchSub = function(e, post) {

			console.log('[rpSearchCtrl] searchSub, post.data.display_name: ' + post.data.display_name);
			console.log('[rpSearchCtrl] searchSub, e.ctrlKey: ' + e.ctrlKey);


			if (e.ctrlKey) {

			rpLocationUtilService(e, '/search', 
				'q='+ $scope.params.q +
				'&sub=' + post.data.display_name + 
				'&type=' + "link" +
				'&restrict_sub=' + "true" +
				'&sort=' + "relevance" +
				'&after=' + "" +
				'&t=' + "all", true, true);


			} else {
				

				$scope.params.sub = post.data.display_name;
				$scope.params.type = "link";
				$scope.params.restrict_sub = true;
				$scope.params.after = "";
				$scope.params.sort = "relevance";
				$scope.params.t = "all";

				rpLocationUtilService(null, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + $scope.params.sub + 
					'&type=' + $scope.params.type +
					'&restrict_sub=' + $scope.params.restrict_sub +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, false);

				$scope.posts = {};
				$scope.havePosts = false;
				$rootScope.$emit('progressLoading');
				
				rpSearchUtilService.search(function(data) {
					$rootScope.$emit('progressComplete');
					$scope.posts = data.data.children;
					$scope.havePosts = true;
				});

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

		$scope.sharePost = function(e, post) {
			console.log('[rpSearchCtrl] sharePost(), post.data.url: ' + post.data.url);

			post.bottomSheet = true;

			var shareBottomSheet = $mdBottomSheet.show({
				templateUrl: 'partials/rpShareBottomSheet',
				controller: 'rpSharePostCtrl',
				targetEvent: e,
				parent: '.rp-view',
				disbaleParentScroll: true,
				locals: {
					post: post
				}
			}).then(function() {
				console.log('[rpSearchCtrl] bottomSheet Resolved: remove rp-bottom-sheet class');
				post.bottomSheet = false;
			}).catch(function() {
				console.log('[rpSearchCtrl] bottomSheet Rejected: remove rp-bottom-sheet class');
				post.bottomSheet = false;
			});

		};

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function(data) {
			$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;
		});

		var deregisterSearchTimeClick = $rootScope.$on('search_time_click', function(e, time) {

			console.log('[rpSearchCtrl] search_time_click, time: ' + time);
			
			$scope.posts = {};
			$scope.havePosts = false;
			
			$scope.params.t = time;
			$scope.params.after = '';

			rpLocationUtilService(null, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + $scope.params.sub + 
					'&type=' + $scope.params.type +
					'&restrict_sub=' + $scope.params.restrict_sub +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, true);

			$scope.posts = {};
			$scope.havePosts = false;
			$rootScope.$emit('progressLoading');
			
			rpSearchUtilService.search(function(data) {
				$rootScope.$emit('progressComplete');
				$scope.posts = data.data.children;
				$scope.havePosts = true;
			});

		});

		var deregisterSearchTabClick = $rootScope.$on('search_tab_click', function(e, tab) {

			console.log('[rpSearchCtrl] search_tab_click, tab: ' + tab);
			$scope.params.sort = tab;
			$scope.params.t = 'all';
			$scope.params.after = '';

			rpLocationUtilService(null, '/search', 
				'q='+ $scope.params.q +
				'&sub=' + $scope.params.sub + 
				'&type=' + $scope.params.type +
				'&restrict_sub=' + $scope.params.restrict_sub +
				'&sort=' + $scope.params.sort +
				'&after=' + $scope.params.after +
				'&t=' + $scope.params.t, false, true);

			$scope.posts = {};
			$scope.havePosts = false;
			$rootScope.$emit('progressLoading');
			
			rpSearchUtilService.search(function(data) {
				$rootScope.$emit('progressComplete');
				$scope.posts = data.data.children;
				$scope.havePosts = true;
			});

		});

		var deregisterSearchFormSubmitted = $rootScope.$on('search_form_submitted', function() {

			$scope.posts = {};
			$scope.havePosts = false;
			$rootScope.$emit('progressLoading');
			
			rpSearchUtilService.search(function(data) {
				$rootScope.$emit('progressComplete');
				$scope.posts = data.data.children;
				$scope.havePosts = true;
				$scope.type = $scope.params.type;
			});			

		});

		$scope.$on('$destroy', function() {
			console.log('[rpSearchCtrl] destroy()');
			deregisterSearchFormSubmitted();
			deregisterSearchTabClick();
			deregisterSearchTimeClick();
			deregisterSettingsChanged();
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
				console.log('[rpSearchTabsCtrl] tabClick() firstLoadOver');
				$rootScope.$emit('search_tab_click', tab);
				rpSearchTabsUtilService.setTab(tab);
				
			} else {
				console.log('[rpSearchTabsCtrl] tabClick(), firstLoad - do nothing');
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

		$scope.$on('$destroy', function() {
			console.log('[rpSearchTabsCtrl] destroy()');
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