'use strict';

var rpSearchControllers = angular.module('rpSearchControllers', []);

rpSearchControllers.controller('rpSearchSidenavCtrl', function() {

});

rpSearchControllers.controller('rpSearchFormCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'rpSearchUtilService', 'rpSubredditsUtilService',
	'rpLocationUtilService',
	function($scope, $rootScope, $location, $routeParams, rpSearchUtilService, rpSubredditsUtilService, rpLocationUtilService) {
		console.log('[rpSearchFormCtrl] loaded.');

		$scope.params = rpSearchUtilService.params;

		//Set the current sub if we open the search form on a page other than frontpage, all or search page.
		if (rpSubredditsUtilService.currentSub && rpSubredditsUtilService.currentSub !== '') {
			console.log('[rpSearchFormCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
			$scope.params.sub = rpSubredditsUtilService.currentSub;
		} else {
			$scope.params.sub = 'all';
		}

		if ($scope.params.sub !== 'all') {
			$scope.params.type = $scope.params.formType = "link";
		}

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

		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function() {
			$scope.params = rpSearchUtilService.params;
		});

		$scope.submitSearchForm = function() {
			onSearchPage = searchPathRe.test($location.path());
			console.log('[rpSearchFormCtrl] submitSearchForm, onSearchPage: ' + onSearchPage);
			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params: ' + $scope.params);
			console.log('[rpSearchFormCtrl] submitSearchForm, rpSubredditsUtilService.currentSub' + rpSubredditsUtilService.currentSub);

			//Set type to form type.
			if ($scope.params.formType)
				$scope.params.type = $scope.params.formType;

			//params.sub = string in the input box.
			//If sub selected through autocomplete, set params.sub to selected item
			if ($scope.subSelectedItem) {
				$scope.params.sub = $scope.subSelectedItem.data.display_name;
				console.log('[rpSearchFormCtrl] submitSearchForm, $scope.subSelectedItem: ' + $scope.subSelectedItem.data.display_name);
			}

			//if params.sub (input) is empty
			if ($scope.params.sub === '') {
				//if we have a currentSub set to currentSub otherwise set to all.
				if (rpSubredditsUtilService.currentSub && rpSubredditsUtilService.currentSub !== '')
					$scope.params.sub = rpSubredditsUtilService.currentSub;
				else
					$scope.params.sub = "all";
			}

			//if params.sub is not set or empty set to all.
			if (!$scope.params.sub || $scope.params.sub === "")
				$scope.params.sub = 'all';

			//Cannot search a subreddit for a subreddit..
			//If sub is not all type should be link.
			if ($scope.params.sub !== 'all' && $scope.params.type !== 'link')
				$scope.params.type = 'link';

			//if sub is all restrist_sr must be false.
			if ($scope.params.sub === 'all')
				$scope.params.restrict_sr = false;
			else
				$scope.params.restrict_sr = true;

			//reset after.
			$scope.params.after = "";

			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params: ' + JSON.stringify($scope.params));

			rpLocationUtilService(null, '/search',
				'q=' + $scope.params.q +
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
	'rpUserFilterButtonUtilService',
	'rpUserSortButtonUtilService',
	'rpPostFilterButtonUtilService',
	'rpSubscribeButtonUtilService',
	'rpSearchFilterButtonUtilService',
	'rpByIdUtilService',
	'rpLocationUtilService',
	'rpSettingsUtilService',
	'rpToolbarShadowUtilService',
	'rpTitleChangeService',
	'rpAuthUtilService',
	'rpIdentityUtilService',

	function(
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
		rpUserFilterButtonUtilService,
		rpUserSortButtonUtilService,
		rpPostFilterButtonUtilService,
		rpSubscribeButtonUtilService,
		rpSearchFilterButtonUtilService,
		rpByIdUtilService,
		rpLocationUtilService,
		rpSettingsUtilService,
		rpToolbarShadowUtilService,
		rpTitleChangeService,
		rpAuthUtilService,
		rpIdentityUtilService

	) {


		console.log('[rpSearchCtrl] loaded, $scope.$id: ' + $scope.$id);
		/*
			UI Updates
		 */

		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpSearchFilterButtonUtilService.show();

		console.log('[rpSearchCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);

		$scope.posts = {};
		$scope.links = {};
		$scope.subs = {};
		$scope.haveSubs = $scope.haveLinks = $scope.havePosts = false;
		var loadingMore = false;
		$scope.nothingPosts = false;
		$scope.nothingSubs = false;
		$scope.nothingLinks = false;
		$scope.noMorePosts = false;
		var limit = 24;

		$scope.tabs = [{
			label: 'relevance',
			value: 'relevance'
		}, {
			label: 'top',
			value: 'top'
		}, {
			label: 'new',
			value: 'new'
		}, {
			label: 'comments',
			value: 'comments'
		}];

		/*
			Set search parameters.
		 */
		$scope.params = rpSearchUtilService.params;

		if (rpAuthUtilService.isAuthenticated) {
			rpIdentityUtilService.getIdentity(function(identity) {
				$scope.identity = identity;
			});
		}

		$scope.showSub = true;

		if ($routeParams.q) {
			$scope.params.q = $routeParams.q;
			rpTitleChangeService.prepTitleChange('search: ' + $scope.params.q);

		}

		// $scope.params.sub = $routeParams.sub || rpSubredditsUtilService.currentSub || "all";
		if ($routeParams.sub) {
			$scope.params.sub = $routeParams.sub;
		} else if (rpSubredditsUtilService.currentSub) {
			$scope.params.sub = rpSubredditsUtilService.currentSub;
		}

		// If a subreddit has been specified must search for links only.
		if ($scope.params.sub === 'all' || $scope.params.sub === '') {
			if ($routeParams.type)
				$scope.params.type = $routeParams.type;
			console.log('[rpSearchCtrl] set type, $scope.params.type: ' + $scope.params.type);
			$scope.type = $scope.params.formType = $scope.params.type;

		} else {
			$scope.type = $scope.params.formType = $scope.params.type = 'link';

		}

		var authorRe = /[.]*(author\:)[,]*/;
		if (authorRe.test($scope.params.q)) {
			$scope.type = $scope.params.type = 'link';
			console.log('[rpSearchCtrl] rpSearchUtilService, author test inside.');

		}

		if ($scope.params.type !== 'link') {
			rpToolbarShadowUtilService.show();
		}

		if ($routeParams.restrict_sr) {
			$scope.params.restrict_sr = $routeParams.restrict_sr;

		}

		if ($routeParams.t) $scope.params.t = $routeParams.t;

		if ($routeParams.sort) {
			$scope.params.sort = $routeParams.sort;

		}

		for (var i = 0; i < $scope.tabs.length; i++) {
			if ($scope.params.sort === $scope.tabs[i].value) {
				$scope.selectedTab = i;
				break;
			}
		}


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


		console.log('[rpSearchCtrl] rpSearchUtilService, author test after.');

		if ($scope.params.type === "sr, link") {

			console.log('[rpSearchCtrl] load sr and link');

			$scope.params.type = "sr";
			$scope.params.limit = 3;
			console.log('[rpSearchCtrl] rpSearchUtilService.params.limit: ' + rpSearchUtilService.params.limit);

			rpSearchUtilService.search(function(err, data) {

				if (err) {
					console.log('[rpSearchCtrl] err');
				} else {

					if (data && data.data.children.length > 0) {
						$scope.noMorePosts = data.data.children.length < $scope.params.limit;
						console.log('[rpSearchCtrl] sr + link search(sr), data.data.children.length: ' + data.data.children.length);
						$scope.subs = data.data.children;
						$scope.subs.push({
							more: true
						});
						$scope.haveSubs = true;

					} else {
						$scope.nothingSubs = true;

					}

					if ($scope.haveLinks || $scope.nothingLinks) {

						$rootScope.$emit('progressComplete');
						$scope.params.limit = 24;
						$scope.params.type = "sr, link";

					}

				}


			});

			$scope.params.type = "link";
			$scope.params.limit = 3;

			rpSearchUtilService.search(function(err, data) {

				if (err) {
					console.log('[rpSearchCtrl] err');
				} else {

					if (data && data.data.children.length > 0) {
						$scope.noMorePosts = data.data.children.length < $scope.params.limit;
						console.log('[rpSearchCtrl] sr + link search(link), data.data.children.length: ' + data.data.children.length);
						$scope.links = data.data.children;
						$scope.links.push({
							more: true
						});
						$scope.haveLinks = true;

					} else {
						$scope.nothingLinks = true;
					}

					if ($scope.haveSubs || $scope.nothingSubs) {
						console.log('[rpSearchCtrl] sr + link search(link) over, this should only run once.');

						$rootScope.$emit('progressComplete');
						$scope.params.limit = 24;
						$scope.params.type = "sr, link";
					}

				}

			});

		} else {
			console.log('[rpSearchCtrl] load sr or link');

			rpSearchUtilService.search(function(err, data) {
				$rootScope.$emit('progressComplete');

				if (err) {
					console.log('[rpSearchCtrl] err');
				} else {
					if (data && data.data.children.length > 0) {
						$scope.noMorePosts = data.data.children.length < limit;
						$scope.posts = data.data.children;
						$scope.havePosts = true;

					} else {
						$scope.nothingPosts = true;
					}
				}
			});
		}

		/**
		 * CONTROLLER API
		 * */

		$scope.thisController = this;

		this.completeDeleting = function(id) {
			console.log('[rpSearchControllers] this.completeDeleting(), id:' + id);


			var posts;

			if ($scope.params.type === 'link') {
				posts = $scope.posts;
			} else if ($scope.params.type === 'sr, link') {
				posts = $scope.links;
			}

			posts.forEach(function(postIterator, i) {
				if (postIterator.data.name === id) {
					posts.splice(i, 1);
				}

			});

		};



		var ignoredFirstTabClick = false;

		this.tabClick = function(tab) {
			console.log('[rpSearchCtrl] this.tabClick(), tab: ' + tab);

			if (ignoredFirstTabClick) {

				$scope.params.sort = tab;
				$scope.params.after = '';

				rpLocationUtilService(null, '/search',
					'q=' + $scope.params.q +
					'&sub=' + $scope.params.sub +
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, true);

				$scope.posts = {};
				$scope.havePosts = false;
				$scope.noMorePosts = false;
				$rootScope.$emit('progressLoading');

				rpSearchUtilService.search(function(err, data) {
					if (err) {
						console.log('[rpSearchCtrl] this.tabClick(), err');
					} else {
						$scope.noMorePosts = data.data.children.length < limit;
						$rootScope.$emit('progressComplete');
						$scope.posts = data.data.children;
						$scope.havePosts = true;

					}
				});

			} else {
				ignoredFirstTabClick = true;
			}

		};

		/**
		 * SCOPE FUNCTIONS
		 * */

		$scope.morePosts = function() {
			console.log('[rpSearchCtrl] morePost()');

			if ($scope.posts && $scope.posts.length > 0) {

				var lastPostName = $scope.posts[$scope.posts.length - 1].data.name;
				console.log('[rpSearchCtrl] morePosts(), lastPostName: ' + lastPostName);
				console.log('[rpSearchCtrl] morePosts(), loadingMore: ' + loadingMore);

				if (lastPostName && !loadingMore) {
					loadingMore = true;
					$scope.params.after = lastPostName;

					rpLocationUtilService(null, '/search',
						'q=' + $scope.params.q +
						'&sub=' + $scope.params.sub +
						'&type=' + $scope.params.type +
						'&restrict_sr=' + $scope.params.restrict_sr +
						'&sort=' + $scope.params.sort +
						'&after=' + $scope.params.after +
						'&t=' + $scope.params.t, false, true);


					$rootScope.$emit('progressLoading');

					rpSearchUtilService.search(function(err, data) {

						if (err) {
							console.log('[rpSearchCtrl] err');
						} else {
							console.log('[rpSearchCtrl] morePosts() data.length: ' + data.length + ", $scope.params.limit: " + $scope.params.limit);
							$scope.noMorePosts = data.data.children.length < limit;

							$rootScope.$emit('progressComplete');
							Array.prototype.push.apply($scope.posts, data.data.children);
							$scope.havePosts = true;
							loadingMore = false;

						}
					});
				}
			}
		};

		$scope.searchSub = function(e, post) {

			console.log('[rpSearchCtrl] searchSub, post.data.display_name: ' + post.data.display_name);
			console.log('[rpSearchCtrl] searchSub, e.ctrlKey: ' + e.ctrlKey);


			if (e.ctrlKey) {

				rpLocationUtilService(e, '/search',
					'q=' + $scope.params.q +
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
					'q=' + $scope.params.q +
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
				$scope.noMorePosts = false;


				$rootScope.$emit('progressLoading');

				rpToolbarShadowUtilService.hide();

				rpSearchUtilService.search(function(err, data) {
					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {
						$scope.noMorePosts = data.data.children.length < limit;
						$rootScope.$emit('progressComplete');
						$scope.posts = data.data.children;
						$scope.havePosts = true;

					}
				});

			}

		};

		$scope.moreSubs = function(e) {
			console.log('[rpSearchCtrl] moreSubs()');

			if (e.ctrlKey) {
				rpLocationUtilService(e, '/search',
					'q=' + $scope.params.q +
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
					'q=' + $scope.params.q +
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
				$scope.noMorePosts = false;

				$rootScope.$emit('progressLoading');

				rpSearchUtilService.search(function(err, data) {
					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {
						$scope.noMorePosts = data.data.children.length < limit;
						$rootScope.$emit('progressComplete');
						$scope.posts = data.data.children;
						$scope.havePosts = true;

					}

				});

			}

		};

		$scope.moreLinks = function(e) {
			console.log('[rpSearchCtrl] moreSubs()');

			if (e.ctrlKey) {
				rpLocationUtilService(e, '/search',
					'q=' + $scope.params.q +
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
					'q=' + $scope.params.q +
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
				$scope.noMorePosts = false;

				$rootScope.$emit('progressLoading');

				rpToolbarShadowUtilService.hide();

				rpSearchUtilService.search(function(err, data) {

					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {
						$scope.noMorePosts = data.data.children.length < limit;
						$rootScope.$emit('progressComplete');
						$scope.posts = data.data.children;
						$scope.havePosts = true;

					}
				});

			}
		};

		$scope.sharePost = function(e, post) {
			console.log('[rpSearchCtrl] sharePost(), post.data.url: ' + post.data.url);

			post.bottomSheet = true;

			var shareBottomSheet = $mdBottomSheet.show({
				templateUrl: 'partials/rpShareBottomSheet',
				controller: 'rpShareCtrl',
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

		var deregisterSearchTimeClick = $rootScope.$on('search_time_click', function(e, time) {

			console.log('[rpSearchCtrl] search_time_click, time: ' + time);

			$scope.posts = {};
			$scope.havePosts = false;
			$scope.noMorePosts = false;

			$scope.params.t = time;
			$scope.params.after = '';

			rpLocationUtilService(null, '/search',
				'q=' + $scope.params.q +
				'&sub=' + $scope.params.sub +
				'&type=' + $scope.params.type +
				'&restrict_sr=' + $scope.params.restrict_sr +
				'&sort=' + $scope.params.sort +
				'&after=' + $scope.params.after +
				'&t=' + $scope.params.t, false, true);

			$scope.posts = {};
			$scope.havePosts = false;
			$rootScope.$emit('progressLoading');

			rpSearchUtilService.search(function(err, data) {
				if (err) {
					console.log('[rpSearchCtrl] err');
				} else {
					$scope.noMorePosts = data.data.children.length < limit;
					$rootScope.$emit('progressComplete');
					$scope.posts = data.data.children;
					$scope.havePosts = true;

				}
			});

		});

		var deregisterSearchFormSubmitted = $rootScope.$on('search_form_submitted', function() {

			$scope.posts = {};

			$scope.havePosts = false;
			$scope.nothingPosts = false;
			$scope.nothingSubs = false;
			$scope.nothingLinks = false;
			$scope.noMorePosts = false;

			$rootScope.$emit('progressLoading');

			/*
				Test the search string,
				if author:xxx specified must change type to link.
			 */
			var authorRe = /[.]*(author\:)[,]*/;
			if (authorRe.test($scope.params.q)) {
				$scope.type = $scope.params.type = 'link';
			}


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

				rpSearchUtilService.search(function(err, data) {

					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {

						if (data && data.data.children.length > 0) {
							$scope.subs = data.data.children;
							$scope.subs.push({
								more: true
							});
							$scope.haveSubs = true;
							console.log('[rpSearchCtrl] sr + link, subs loaded, $scope.links.length: ' + $scope.links.length + ", $scope.subs.length: " + $scope.subs.length);
						} else {
							console.log('[rpSearchCtrl] submitSearchForm, no subs found.');
							$scope.nothingSubs = true;
						}

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

				rpSearchUtilService.search(function(err, data) {

					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {
						if (data && data.data.children.length > 0) {
							$scope.links = data.data.children;
							$scope.links.push({
								more: true
							});
							$scope.haveLinks = true;

							console.log('[rpSearchCtrl] sr + link, links loaded, $scope.links.length: ' + $scope.links.length + ", $scope.subs.length: " + $scope.subs.length);

						} else {
							console.log('[rpSearchCtrl] submitSearchForm, no links found.');
							$scope.nothingLinks = true;


						}

						if ($scope.haveSubs || $scope.nothingSubs) {
							$rootScope.$emit('progressComplete');
							$scope.params.limit = 24;
							$scope.params.type = "sr, link";

						}
					}
				});

			} else {

				console.log('[rpSearchCtrl] load sr or link');

				rpSearchUtilService.search(function(err, data) {

					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {
						$rootScope.$emit('progressComplete');


						if (data && data.data.children.length > 0) {

							$scope.noMorePosts = data.data.children.length < limit;
							$scope.posts = data.data.children;
							$scope.havePosts = true;
							$scope.type = $scope.params.type;

						} else {
							console.log('[rpSearchCtrl] submitSearchForm, no posts found.');
							$scope.nothingPosts = true;
						}

					}

				});

			}

		});

		$scope.$on('$destroy', function() {
			console.log('[rpSearchCtrl] destroy()');
			deregisterSearchFormSubmitted();
			deregisterSearchTimeClick();
		});

	}
]);

rpSearchControllers.controller('rpSearchTimeFilterCtrl', ['$scope', '$rootScope', 'rpSearchUtilService',
	function($scope, $rootScope, rpSearchUtilService) {

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

			rpSubredditsUtilService.subscribe(action, $scope.post.data.name, function(err, data) {

				if (err) {
					console.log('[rpSearchSubscriptionCtrl] err');
				} else {
					$scope.loadingSubscription = false;
					$scope.subscribed = !$scope.subscribed;

				}
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