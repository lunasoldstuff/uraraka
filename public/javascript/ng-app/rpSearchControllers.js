// 'use strict';

var rpSearchControllers = angular.module('rpSearchControllers', []);

rpSearchControllers.controller('rpSearchFormCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'rpSearchUtilService', 'rpSubredditsUtilService',
	'rpLocationUtilService',
	function ($scope, $rootScope, $location, $routeParams, rpSearchUtilService, rpSubredditsUtilService, rpLocationUtilService) {
		console.log('[rpSearchFormCtrl] loaded.');

		$scope.params = rpSearchUtilService.params;
		// console.log('[rpSearchFormCtrl] rpSearchUtilService.params.formType: ' + rpSearchUtilService.params.formType);
		// $scope.params.formType = rpSearchUtilService.params.formType;
		// $scope.params.formType = $scope.params.type;

		//Set the current sub if we open the search form on a page other than frontpage, all or search page.
		if ($scope.params.sub === 'all' && rpSubredditsUtilService.currentSub !== '') {
			console.log('[rpSearchFormCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
			$scope.params.sub = rpSubredditsUtilService.currentSub;
		}

		console.log('[rpSearchFormCtrl] $scope.params.sub: ' + $scope.params.sub);
		if ($scope.params.sub !== 'all') {
			console.log('[rpSearchFormCtrl] $scope.params.sub != all');
			$scope.params.type = $scope.params.formType = "link";
			
		} 
		console.log('[rpSearchFormCtrl] $scope.params.type: ' + $scope.params.type + ", $scope.params.formType: " + $scope.params.formType);


		var searchPathRe = /\/search.*/;
		var onSearchPage = searchPathRe.test($location.path());
		console.log('[rpSearchFormCtrl] $onSearchPage: ' + onSearchPage);
		console.log('[rpSearchFormCtrl] $scope.params: ' + JSON.stringify($scope.params));

		//focus search input.
		$scope.focusInput = true;

		//sub autocomplete
		$scope.subs = rpSubredditsUtilService.subs;

		$scope.subSearch = function() {
			var results = $scope.params.sub ? $scope.subs.filter(createFilterFor($scope.params.sub)) : [];
			return results;
		};

		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(sub) {
				return (sub.data.display_name.indexOf(lowercaseQuery) === 0);
			};
		}

		// $scope.onSearchTextChange = function (searchText) {
		// 	console.log('[rpSearchFormCtrl] onSearchTextChange, searchText: ' + searchText);	
		// 	if (searchText === '') {
		// 		$scope.params.sub = '';
		// 	}

		// };

		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function() {
			$scope.params = rpSearchUtilService.params;
		});

		$scope.submitSearchForm = function() {
			onSearchPage = searchPathRe.test($location.path());
			console.log('[rpSearchFormCtrl] submitSearchForm, onSearchPage: ' + onSearchPage);
			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params.formType: ' + $scope.params.formType);

			if ($scope.params.formType)
				$scope.params.type = $scope.params.formType;

			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params: ' + JSON.stringify($scope.params));

			if ($scope.subSelectedItem) {
				$scope.params.sub = $scope.subSelectedItem.data.display_name;
				console.log('[rpSearchFormCtrl] submitSearchForm, $scope.subSelectedItem: ' + $scope.subSelectedItem.data.display_name);
			} else if ($scope.params.sub === '') {
				
				// if we're on the search page sub defaults to all
				// otherwise is defaults to the currentSub in rpSubredditsService.
				// 
				// if (onSearchPage)
				// 	$scope.params.sub = "all";
				// else
					$scope.params.sub = rpSubredditsUtilService.currentSub;
			}

			if ($scope.params.type !== 'link')
				$scope.params.sub = 'all';

			if (!$scope.params.sub || $scope.params.sub === "")
				$scope.params.sub = 'all';

			if ($scope.params.sub === 'all')
				$scope.params.restrict_sr = false;
			else 
				$scope.params.restrict_sr = true;

			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params.formType: ' + $scope.params.formType);
			
			
			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params: ' + JSON.stringify($scope.params));

			rpLocationUtilService(null, '/search', 
				'q='+ $scope.params.q +
				'&sub=' + $scope.params.sub + 
				'&type=' + $scope.params.type +
				'&restrict_sr=' + $scope.params.restrict_sr +
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
		'$location',
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
		'rpToolbarShadowUtilService',
		'rpTitleChangeService',

	
	function (
		$scope, 
		$rootScope, 
		$routeParams, 
		$location,
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
		rpToolbarShadowUtilService,
		rpTitleChangeService


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
		$scope.haveSubs = $scope.haveLinks = $scope.havePosts = false;
		var loadingMore = false;
		$scope.nothingPosts = false;
		$scope.nothingSubs = false;
		$scope.nothingLinks = false;

		$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;

		/*
			Set search parameters.
		 */
		$scope.params = rpSearchUtilService.params;


		if ($routeParams.q) {
			$scope.params.q = $routeParams.q;
			rpTitleChangeService.prepTitleChange('search: ' + $scope.params.q);

		}

		// $scope.params.sub = $routeParams.sub || rpSubredditsUtilService.currentSub || "all";
		if ($routeParams.sub) $scope.params.sub = $routeParams.sub;
		else if (rpSubredditsUtilService.currentSub) $scope.params.sub = rpSubredditsUtilService.currentSub;

		// If a subreddit has been specified must search for links only.
		if ($scope.params.sub === 'all' || $scope.params.sub === '') {
			if ($routeParams.type) 
				$scope.params.type = $routeParams.type;
			console.log('[rpSearchCtrl] set type, $scope.params.type: ' + $scope.params.type);
			$scope.type = $scope.params.formType = $scope.params.type;
			
		} else {
			$scope.type = $scope.params.formType = $scope.params.type = 'link';
			
		}

		if ($scope.params.type !== 'link') {
			rpToolbarShadowUtilService.show();
		}

		if ($routeParams.restrict_sr) 
			$scope.params.restrict_sr = $routeParams.restrict_sr;

		if ($routeParams.t) $scope.params.t = $routeParams.t;

		if ($routeParams.sort) 
			$scope.params.sort = $routeParams.sort;
		rpSearchTabsUtilService.setTab($scope.params.sort);

		if ($routeParams.after)
			$scope.params.after = $routeParams.after;
		else
			$scope.params.after = "";

		//make sure the search form is open.
		rpSearchFormUtilService.show();

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

				if (data && data.data.children.length > 0) {

					console.log('[rpSearchCtrl] sr + link search(sr), data.data.children.length: ' + data.data.children.length);
					$scope.subs = data.data.children;
					$scope.subs.push({more: true});
					$scope.haveSubs = true;
					
					if ($scope.haveSubs && $scope.haveLinks) {
						console.log('[rpSearchCtrl] sr + link search(sr) over, this should only run once.');

						$rootScope.$emit('progressComplete');
						$scope.params.limit = 24;
						$scoep.params.type = "sr, link";
					}

				} else {
					$scope.nothingSubs = true;

					if ($scope.haveLinks || $scope.nothingLinks) {
						
						$rootScope.$emit('progressComplete');
						$scope.params.limit = 24;
						$scope.params.type = "sr, link";

					}
				}

			});

			$scope.params.type = "link";
			$scope.params.limit = 3;

			rpSearchUtilService.search(function(data) {

				if (data && data.data.children.length > 0) {
					console.log('[rpSearchCtrl] sr + link search(link), data.data.children.length: ' + data.data.children.length);
					$scope.links = data.data.children;
					$scope.links.push({more: true});
					$scope.haveLinks = true;
					
					if ($scope.haveSubs && $scope.haveLinks) {
						console.log('[rpSearchCtrl] sr + link search(link) over, this should only run once.');
						
						$rootScope.$emit('progressComplete');
						$scope.params.limit = 24;
						$scope.params.type = "sr, link";
					}
				} else {
					$scope.nothingLinks = true;
					
					if ($scope.haveSubs || $scope.nothingSubs) {

						$rootScope.$emit('progressComplete');
						$scope.params.limit = 24;
						$scope.params.type = "sr, link";

					}
				}


			});

		} else {
			console.log('[rpSearchCtrl] load sr or link');

			rpSearchUtilService.search(function(data) {
				$rootScope.$emit('progressComplete');

				if (data && data.data.children.length > 0) {
					$scope.posts = data.data.children;
					$scope.havePosts = true;
					
				} else {
					$scope.nothingPosts = true;
				}

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
						'&restrict_sr=' + $scope.params.restrict_sr +
						'&sort=' + $scope.params.sort +
						'&after=' + $scope.params.after +
						'&t=' + $scope.params.t, false, true);


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
					'&restrict_sr=' + "true" +
					'&sort=' + "relevance" +
					'&after=' + "" +
					'&t=' + "all", true, true);


			} else {
				

				$scope.params.sub = post.data.display_name;
				$scope.type = $scope.params.formType = $scope.params.type = "link";
				$scope.params.restrict_sr = true;
				$scope.params.after = "";
				$scope.params.sort = "relevance";
				$scope.params.t = "all";

				rpLocationUtilService(null, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + $scope.params.sub + 
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, false);

				$scope.posts = {};
				$scope.havePosts = false;
				
				$scope.nothingPosts = false;
				$scope.nothingSubs = false;
				$scope.nothingLinks = false;

				$rootScope.$emit('progressLoading');

				rpToolbarShadowUtilService.hide();
				
				rpSearchUtilService.search(function(data) {
					$rootScope.$emit('progressComplete');
					$scope.posts = data.data.children;
					$scope.havePosts = true;
				});

			}

		};

		$scope.moreSubs = function(e) {
			console.log('[rpSearchCtrl] moreSubs()');

			if (e.ctrlKey) {
				rpLocationUtilService(e, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + 'all' + 
					'&type=' + "sr" +
					'&restrict_sr=' + "false" +
					'&sort=' + "relevance" +
					'&after=' + "" +
					'&t=' + "all", true, true);

			} else {

				$scope.params.sub = "all";
				$scope.type = $scope.params.formType = $scope.params.type = "sr";
				$scope.params.restrict_sr = false;
				$scope.params.after = "";
				$scope.params.sort = "relevance";
				$scope.params.t = "all";

				rpLocationUtilService(null, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + $scope.params.sub + 
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, false);

				$scope.posts = {};
				$scope.subs = {};
				$scope.links = {};

				$scope.havePosts = false;
				$scope.haveLinks = false;
				$scope.haveSubs = false;

				$rootScope.$emit('progressLoading');

				rpSearchUtilService.search(function(data) {
					$rootScope.$emit('progressComplete');
					$scope.posts = data.data.children;
					$scope.havePosts = true;
				});

			}

		};

		$scope.moreLinks = function(e) {
			console.log('[rpSearchCtrl] moreSubs()');

			if (e.ctrlKey) {
				rpLocationUtilService(e, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + 'all' + 
					'&type=' + "link" +
					'&restrict_sr=' + "false" +
					'&sort=' + "relevance" +
					'&after=' + "" +
					'&t=' + "all", true, true);
				
			} else {

				$scope.params.sub = "all";
				$scope.type = $scope.params.formType = $scope.params.type = "link";
				$scope.params.restrict_sr = false;
				$scope.params.after = "";
				$scope.params.sort = "relevance";
				$scope.params.t = "all";

				rpLocationUtilService(null, '/search', 
					'q='+ $scope.params.q +
					'&sub=' + $scope.params.sub + 
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, false);

				$scope.posts = {};
				$scope.subs = {};
				$scope.links = {};

				$scope.havePosts = false;
				$scope.haveLinks = false;
				$scope.haveSubs = false;

				$rootScope.$emit('progressLoading');

				rpToolbarShadowUtilService.hide();
				
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
					'&restrict_sr=' + $scope.params.restrict_sr +
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
			$scope.params.after = '';

			rpLocationUtilService(null, '/search', 
				'q='+ $scope.params.q +
				'&sub=' + $scope.params.sub + 
				'&type=' + $scope.params.type +
				'&restrict_sr=' + $scope.params.restrict_sr +
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

			$scope.nothingPosts = false;
			$scope.nothingSubs = false;
			$scope.nothingLinks = false;

			$rootScope.$emit('progressLoading');
			$scope.type = $scope.params.type;
			
			if ($scope.params.type !== 'link') {
				// rpToolbarShadowUtilService.showToolbarShadow = true;
				rpToolbarShadowUtilService.show();
			} else {
				// rpToolbarShadowUtilService.showToolbarShadow = false;
				rpToolbarShadowUtilService.hide();
			}
			
			/*
				Perform two search requests if we want both subs and links.
		 	*/
			if ($scope.params.type === "sr, link") {

				console.log('[rpSearchCtrl] load sr and link');

				$scope.subs = {};
				$scope.haveSubs = false;

				$scope.params.type = "sr";
				$scope.params.limit = 3;
				console.log('[rpSearchCtrl] rpSearchUtilService.params.limit: ' + rpSearchUtilService.params.limit);

				rpSearchUtilService.search(function(data) {
					
					if (data && data.data.children.length > 0) {

						$scope.subs = data.data.children;
						$scope.subs.push({more: true});
						$scope.haveSubs = true;

						console.log('[rpSearchCtrl] sr + link, subs loaded, $scope.links.length: ' + $scope.links.length + ", $scope.subs.length: " + $scope.subs.length);
						
						if ($scope.haveSubs && $scope.haveLinks) {
							console.log('[rpSearchCtrl] sr + link search() over, this should only run once.');
							$rootScope.$emit('progressComplete');
							$scope.params.limit = 24;
							$scope.params.type = "sr, link";
						}
						
					} else {
						console.log('[rpSearchCtrl] submitSearchForm, no subs found.');
						$scope.nothingSubs = true;

						if ($scope.haveLinks || $scope.nothingLinks) {
							$rootScope.$emit('progressComplete');
							$scope.params.limit = 24;
							$scope.params.type = "sr, link";

						}

					}


				});

				$scope.links = {};
				$scope.haveLinks = false;

				$scope.params.type = "link";
				$scope.params.limit = 3;

				rpSearchUtilService.search(function(data) {

					if (data && data.data.children.length > 0) {
						$scope.links = data.data.children;
						$scope.links.push({more: true});
						$scope.haveLinks = true;
						
						console.log('[rpSearchCtrl] sr + link, links loaded, $scope.links.length: ' + $scope.links.length + ", $scope.subs.length: " + $scope.subs.length);

						if ($scope.haveSubs && $scope.haveLinks) {
							console.log('[rpSearchCtrl] sr + link search() over, this should only run once.');
							$rootScope.$emit('progressComplete');
							$scope.params.limit = 24;
							$scope.params.type = "sr, link";
						}
						
					} else {
						console.log('[rpSearchCtrl] submitSearchForm, no links found.');
						$scope.nothingLinks = 0;

						if ($scope.haveSubs || $scope.nothingSubs) {
							$rootScope.$emit('progressComplete');
							$scope.params.limit = 24;
							$scope.params.type = "sr, link";

						}

					}


				});


			} else {

				console.log('[rpSearchCtrl] load sr or link');

				rpSearchUtilService.search(function(data) {
					$rootScope.$emit('progressComplete');
					
					if (data && data.data.children.length > 0) {
						$scope.posts = data.data.children;
						$scope.havePosts = true;
						$scope.type = $scope.params.type;
						
					} else {
						console.log('[rpSearchCtrl] submitSearchForm, no posts found.');
						$scope.nothingPosts = true;
					}

				});
				
			}

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

rpSearchControllers.controller('rpSearchTimeFilterCtrl', ['$scope', '$rootScope', 'rpSearchUtilService',
	function ($scope, $rootScope, rpSearchUtilService) {

		$scope.type = rpSearchUtilService.params.type;

		console.log('[rpSearchTimeFilterCtrl] $scope.type: ' + $scope.type);

		$scope.selectTime = function(value) {
			$rootScope.$emit('search_time_click', value);
		};
	}
]);

rpSearchControllers.controller('rpSearchSubscriptionCtrl', ['$scope', '$rootScope', 'rpSubredditsUtilService',
	function($scope, $rootScope, rpSubredditsUtilService) {
		console.log('[rpSearchSubscriptionCtrl] loaded.');

		$scope.loadingSubscription = false;
		// $scope.subscribed = false;
		$scope.subscribed = rpSubredditsUtilService.isSubscribed($scope.post.data.display_name);

		$scope.toggleSubscription = function() {
			$scope.loadingSubscription = true;
			
			var action = $scope.subscribed ? 'unsub' : 'sub';
			
			console.log('[rpSearchSubscriptionCtrl] toggleSubscription(), $scope.post.data.title: ' + $scope.post.data.display_name);

			rpSubredditsUtilService.subscribe(action, $scope.post.data.name, function() {
				$scope.loadingSubscription = false;
				$scope.subscribed = !$scope.subscribed;
			});

		};

		var deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function() {

			$scope.subscribed = rpSubredditsUtilService.isSubscribed($scope.post.data.display_name);

		});

		$scope.$on('$destroy', function() {
			deregisterSubredditsUpdated();

		});

	}
]);