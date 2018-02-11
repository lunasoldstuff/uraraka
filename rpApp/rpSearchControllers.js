'use strict';

var rpSearchControllers = angular.module('rpSearchControllers', []);

rpSearchControllers.controller('rpSearchSidenavCtrl', [
	'$scope',
	'$rootScope',
	'rpSearchFormUtilService',
	function (
		$scope,
		$rootScope,
		rpSearchFormUtilService
	) {
		$scope.isOpen = rpSearchFormUtilService.isVisible;

		$scope.toggleOpen = function (e) {
			$scope.isOpen = !$scope.isOpen;
		};

		var deregisterSearchFormVisibility = $rootScope.$on('rp_search_form_visibility', function (e, isOpen) {
			$scope.isOpen = isOpen;
		});

		$scope.$on('$destroy', function () {
			deregisterSearchFormVisibility();
		});

	}
]);

rpSearchControllers.controller('rpSearchFormCtrl', [
	'$scope',
	'$rootScope',
	'$location',
	'$routeParams',
	'$timeout',
	'rpSearchUtilService',
	'rpSubredditsUtilService',
	'rpLocationService',

	function (
		$scope,
		$rootScope,
		$location,
		$routeParams,
		$timeout,
		rpSearchUtilService,
		rpSubredditsUtilService,
		rpLocationService

	) {
		console.log('[rpSearchFormCtrl] loaded, $scope.$id: ' + $scope.$id);

		$scope.params = rpSearchUtilService.params;

		//Set the current sub if we open the search form on a page other than frontpage, all or search page.
		if (rpSubredditsUtilService.currentSub && rpSubredditsUtilService.currentSub !== '') {
			console.log('[rpSearchFormCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
			$scope.params.sub = rpSubredditsUtilService.currentSub;
		} else {
			$scope.params.sub = rpSearchUtilService.params.sub;
		}

		if ($scope.params.sub !== 'all') {
			$scope.params.type = "link";

		}

		var searchPathRe = /\/search.*/;
		var onSearchPage = searchPathRe.test($location.path());
		console.log('[rpSearchFormCtrl] $onSearchPage: ' + onSearchPage);
		console.log('[rpSearchFormCtrl] $scope.params: ' + JSON.stringify($scope.params));

		//focus search input.
		$scope.focusInput = true;

		$scope.searchSubreddits = $scope.params.type === "sr" || $scope.params.type === "sr, link";
		$scope.searchLinks = $scope.params.type === "link" || $scope.params.type === "sr, link";

		$scope.toggleSearchSubreddits = function () {
			console.log('[rpSearchFormCtrl] toggleSearchSubreddits');
			$scope.searchSubreddits = !$scope.searchSubreddits;

			if (!$scope.searchLinks) {
				$scope.searchLinks = true;
			}

			calcType();
		};

		$scope.toggleSearchLinks = function () {
			console.log('[rpSearchFormCtrl] toggleSearchLinks');
			$scope.searchLinks = !$scope.searchLinks;

			if (!$scope.searchSubreddits) {
				$scope.searchSubreddits = true;
			}

			calcType();
		};

		function calcType() {
			if ($scope.searchSubreddits && $scope.searchLinks) {
				$scope.params.type = "sr, link";

			} else if ($scope.searchSubreddits) {
				$scope.params.type = "sr";

			} else if ($scope.searchLinks) {
				$scope.params.type = "link";

			}
		}

		$scope.subSearch = function () {
			//sub autocomplete
			$scope.subs = rpSubredditsUtilService.subs;
			console.log('[rpSearchFormCtrl] subSearch(), $scope.subs.length: ' + $scope.subs.length);
			return $scope.params.sub ? $scope.subs.filter(createFilterFor($scope.params.sub)) : [];
		};

		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(sub) {
				return (sub.data.display_name.indexOf(lowercaseQuery) === 0);
			};
		}

		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function () {
			$scope.params = rpSearchUtilService.params;
		});

		$scope.submitSearchForm = function (e) {

			//prevent submission with enter making a new line

			if (e) {
				e.preventDefault();

			}

			onSearchPage = searchPathRe.test($location.path());
			console.log('[rpSearchFormCtrl] submitSearchForm, onSearchPage: ' + onSearchPage);
			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params: ' + $scope.params);
			console.log('[rpSearchFormCtrl] submitSearchForm, rpSubredditsUtilService.currentSub' + rpSubredditsUtilService.currentSub);

			//Set type to form type.
			// if ($scope.params.formType)
			// 	$scope.params.type = $scope.params.formType;

			//params.sub = string in the input box.
			//If sub selected through autocomplete, set params.sub to selected item
			if ($scope.subSelectedItem) {
				$scope.params.sub = $scope.subSelectedItem.data.display_name;
				console.log('[rpSearchFormCtrl] submitSearchForm, $scope.subSelectedItem.data.display_name: ' + $scope.subSelectedItem.data.display_name);
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
			if (!$scope.params.sub || $scope.params.sub === "") {
				console.log('[rpSearchFormCtrl] settings sub to all. rpSearchUtilService.params.sub: ' + rpSearchUtilService.params.sub);
				$scope.params.sub = 'all';

			}

			//Cannot search a subreddit for a subreddit..
			//If sub is not all, type should be link.

			//disabled because we shouldn't change the search type to link,
			//instead we should set the subreddit to all (disabled actually because it won't be used)
			// if ($scope.params.type !== 'link' && $scope.params.sub !== 'all') {
			//     $scope.params.type = 'link';
			//     $scope.searchSubreddits = false;
			//     $scope.searchLinks = true;
			//
			// }
			// This is better set the sub to all and respect the setting of the search type.
			if ($scope.params.type !== 'link' && $scope.params.sub !== 'all') {
				$scope.params.sub = 'all';
			}
			//Basically the question comes down to respecting the sub entry or the search type selection.


			//If we search for subs but there is still a subreddit specified in form clear it.
			if ($scope.params.type === 'sub' && $scope.params.sub !== '') {
				$scope.params.sub = '';
			}

			//if sub is all restrist_sr must be false.
			if ($scope.params.sub === 'all') {
				$scope.params.restrict_sr = false;

			} else {
				$scope.params.restrict_sr = true;

			}

			//Enable to have every new search use default sort
			$scope.params.sort = 'relevance';

			// //if we search for subs or all clear the subreddit form field.
			// if ($scope.params.type === 'sub' || $scope.params.type === 'sub') {
			//     $scope.params.sub = '';
			// }

			//reset after.
			$scope.params.after = "";

			console.log('[rpSearchFormCtrl] submitSearchForm, $scope.params: ' + JSON.stringify($scope.params));

			calcType();

			$timeout(function () {
				rpLocationService(null, '/search',
					'q=' + $scope.params.q +
					'&sub=' + $scope.params.sub +
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, !onSearchPage, false);

				if (onSearchPage) {
					$rootScope.$emit('rp_search_form_submitted');
				}

			}, 250);

		};

		$scope.resetSearchForm = function () {

		};

		$scope.$on('$destroy', function () {
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
	'$timeout',
	'$mdDialog',
	'$mdBottomSheet',
	'rpSubredditsUtilService',
	'rpSearchUtilService',
	'rpSearchFormUtilService',
	'rpLocationService',
	'rpSettingsService',
	'rpTitleChangeService',
	'rpAuthUtilService',
	'rpIdentityUtilService',

	function (
		$scope,
		$rootScope,
		$routeParams,
		$location,
		$window,
		$timeout,
		$mdDialog,
		$mdBottomSheet,
		rpSubredditsUtilService,
		rpSearchUtilService,
		rpSearchFormUtilService,
		rpLocationService,
		rpSettingsService,
		rpTitleChangeService,
		rpAuthUtilService,
		rpIdentityUtilService

	) {


		console.log('[rpSearchCtrl] loaded, $scope.$id: ' + $scope.$id);
		/*
			UI Updates
		 */

		$rootScope.$emit('rp_hide_all_buttons');
		$rootScope.$emit('rp_button_visibility', 'showLayout', true);

		$scope.singleColumnLayout = rpSettingsService.settings.singleColumnLayout;


		console.log('[rpSearchCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);

		$scope.posts = [];
		$scope.links = [];
		$scope.subs = [];
		$scope.haveSubs = $scope.haveLinks = $scope.havePosts = false;
		var loadingMore = false;
		$scope.nothingPosts = false;
		$scope.nothingSubs = false;
		$scope.nothingLinks = false;
		$scope.noMorePosts = false;
		var currentLoad = 0;

		/*
			Set search parameters.
		 */
		$scope.params = rpSearchUtilService.params;

		if (rpAuthUtilService.isAuthenticated) {
			rpIdentityUtilService.getIdentity(function (identity) {
				$scope.identity = identity;
			});
		}

		$scope.showSub = true;

		if ($routeParams.q) {
			$scope.params.q = $routeParams.q;
			rpTitleChangeService('search: ' + $scope.params.q, true, true);

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

		if ($routeParams.restrict_sr) {
			$scope.params.restrict_sr = $routeParams.restrict_sr;

		}

		if ($routeParams.t) $scope.params.t = $routeParams.t;

		if ($routeParams.sort) {
			$scope.params.sort = $routeParams.sort;

		}

		if ($routeParams.after) {
			$scope.params.after = $routeParams.after;
		} else {
			$scope.params.after = "";
		}

		if ($routeParams.limit) {
			$scope.params.limit = $routeParams.limit;
		}

		//make sure the search form is open.
		rpSearchFormUtilService.show();

		$rootScope.$emit('rp_button_visibility', 'showSearchSort', $scope.params.type === 'link');


		/*
			Initiate first search.
		 */
		$rootScope.$emit('rp_progress_start');

		/*
			Perform two search requests if we want both subs and links.

		 */
		console.log('[rpSearchCtrl] rpSearchUtilService, author test after.');

		var thisLoad = ++currentLoad;

		if ($scope.params.type === "sr, link") {

			console.log('[rpSearchCtrl] load sr and link');
			console.log('[rpSearchCtrl] foo');

			$rootScope.$emit('rp_button_visibility', 'showSearchTime', false);

			$scope.subs = [];
			$scope.haveSubs = false;

			$scope.params.type = "sr";
			$scope.params.limit = 4;
			console.log('[rpSearchCtrl] rpSearchUtilService.params.limit: ' + rpSearchUtilService.params.limit);

			rpSearchUtilService.search(function (err, data) {

				if (thisLoad === currentLoad) {
					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {

						console.log('[rpSearchCtrl] sr, data.data.children.length: ' + data.data.children.length);
						console.log('[rpSearchCtrl] sr, asdf');

						if (data.data.children.length > 0) {
							$scope.noMorePosts = data.data.children.length < $scope.params.limit;
							console.log('[rpSearchCtrl] sr + link search(sr), data.data.children.length: ' + data.data.children.length);
							$scope.subs = data.data.children;
							// $scope.subs.push({
							// 	more: true
							// });
							$scope.haveSubs = true;
							console.log('[rpSearchCtrl] $scope.haveSubs: ' + $scope.haveSubs);

						} else {
							$scope.nothingSubs = true;

						}
						console.log('[rpSearchCtrl] sr, qwer');

						if ($scope.haveLinks || $scope.nothingLinks) {

							$rootScope.$emit('rp_progress_stop');
							$scope.params.limit = 8;
							$scope.params.type = "sr, link";

						}

					}

				}




			});

			$scope.links = [];
			$scope.haveLinks = false;

			$scope.params.type = "link";
			$scope.params.limit = 4;

			rpSearchUtilService.search(function (err, data) {

				if (thisLoad === currentLoad) {
					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {

						if (data.data.children.length > 0) {
							$scope.noMorePosts = data.data.children.length < $scope.params.limit;
							console.log('[rpSearchCtrl] sr + link search(link), data.data.children.length: ' + data.data.children.length);

							$scope.links = data.data.children;

							// $scope.links.push({
							// 	more: true
							// });

							$scope.haveLinks = true;
							console.log('[rpSearchCtrl] $scope.haveLinks: ' + $scope.haveLinks);

						} else {
							$scope.nothingLinks = true;
						}

						if ($scope.haveSubs || $scope.nothingSubs) {
							console.log('[rpSearchCtrl] sr + link search(link) over, this should only run once.');

							$rootScope.$emit('rp_progress_stop');
							$scope.params.limit = 8;
							$scope.params.type = "sr, link";
						}

					}
				}

			});

			$scope.params.type = "sr, link";

		} else {
			console.log('[rpSearchCtrl] load sr or link');

			if ($scope.params.type === 'link' && $scope.params.sort === 'top') {
				$rootScope.$emit('rp_button_visibility', 'showSearchTime', true);
			} else {
				$rootScope.$emit('rp_button_visibility', 'showSearchTime', false);

			}


			rpSearchUtilService.search(function (err, data) {

				if (thisLoad === currentLoad) {
					$rootScope.$emit('rp_progress_stop');

					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {

						console.log('[rpSearchCtrl] data.data.children.length: ' + data.data.children.length);

						if (data && data.data.children.length > 0) {

							$scope.noMorePosts = data.data.children.length < $scope.params.limit;

							if (data.data.children.length > 0) {
								addPosts(data.data.children, false);

							}
							// $scope.posts = data.data.children;
							$scope.havePosts = true;

						} else {
							$scope.nothingPosts = true;
						}
					}

				}

			});
		}

		/**
		 * CONTROLLER API
		 * */

		$scope.thisController = this;

		this.completeDeleting = function (id) {
			console.log('[rpSearchCtrl] this.completeDeleting(), id:' + id);


			var posts;

			if ($scope.params.type === 'link') {
				posts = $scope.posts;
			} else if ($scope.params.type === 'sr, link') {
				posts = $scope.links;
			}

			posts.forEach(function (postIterator, i) {
				if (postIterator.data.name === id) {
					posts.splice(i, 1);
				}

			});

		};

		var deregisterSearchSortClick = $rootScope.$on('rp_search_sort_click', function (e, sort) {
			console.log('[rpSearchCtrl] rp_sort_click, sort:' + sort);


			$scope.params.sort = sort;
			$scope.params.after = '';

			if ($scope.params.sort === 'top') {
				$rootScope.$emit('rp_button_visibility', 'showSearchTime', true);
			} else {
				$rootScope.$emit('rp_button_visibility', 'showSearchTime', false);
			}

			rpLocationService(null, '/search',
				'q=' + $scope.params.q +
				'&sub=' + $scope.params.sub +
				'&type=' + $scope.params.type +
				'&restrict_sr=' + $scope.params.restrict_sr +
				'&sort=' + $scope.params.sort +
				'&after=' + $scope.params.after +
				'&t=' + $scope.params.t, false, true);

			$scope.posts = [];
			$scope.havePosts = false;
			$scope.noMorePosts = false;
			$rootScope.$emit('rp_progress_start');

			var thisLoad = ++currentLoad;

			rpSearchUtilService.search(function (err, data) {

				if (thisLoad === currentLoad) {
					if (err) {
						console.log('[rpSearchCtrl] this.tabClick(), err');
					} else {
						$scope.noMorePosts = data.data.children.length < $scope.params.limit;
						if (data.data.children.length > 0) {
							addPosts(data.data.children, false);
						}
						$rootScope.$emit('rp_progress_stop');
						// $scope.posts = data.data.children;
						$scope.havePosts = true;

					}
				}
			});

		});

		/**
		 * SCOPE FUNCTIONS
		 * */

		$scope.morePosts = function () {
			console.log('[rpSearchCtrl] morePost()');

			if ($scope.posts && $scope.posts.length > 0) {

				var lastPostName = $scope.posts[$scope.posts.length - 1].data.name;
				console.log('[rpSearchCtrl] morePosts(), lastPostName: ' + lastPostName);
				console.log('[rpSearchCtrl] morePosts(), loadingMore: ' + loadingMore);


				if (lastPostName && !loadingMore) {
					loadingMore = true;
					$scope.params.after = lastPostName;

					rpLocationService(null, '/search',
						'q=' + $scope.params.q +
						'&sub=' + $scope.params.sub +
						'&type=' + $scope.params.type +
						'&restrict_sr=' + $scope.params.restrict_sr +
						'&sort=' + $scope.params.sort +
						'&after=' + $scope.params.after +
						'&limit=' + $scope.params.limit +
						'&t=' + $scope.params.t, false, true);


					$rootScope.$emit('rp_progress_start');

					var thisLoad = ++currentLoad;

					rpSearchUtilService.search(function (err, data) {

						if (thisLoad === currentLoad) {
							if (err) {
								console.log('[rpSearchCtrl] err');
							} else {
								console.log('[rpSearchCtrl] morePosts() data.data.children.length: ' + data.data.children.length);
								console.log('[rpSearchCtrl] $scope.params.limit: ' + $scope.params.limit);
								$scope.noMorePosts = data.data.children.length < $scope.params.limit;

								$rootScope.$emit('rp_progress_stop');
								if (data.data.children.length > 0) {
									addPosts(data.data.children, true);
								}
								// Array.prototype.push.apply($scope.posts, data.data.children);
								$scope.havePosts = true;
								loadingMore = false;

							}

						}

						loadingMore = false;

					});
				}
			}
		};

		$scope.searchSub = function (e, post) {

			console.log('[rpSearchCtrl] searchSub, post.data.display_name: ' + post.data.display_name);
			console.log('[rpSearchCtrl] searchSub, e.ctrlKey: ' + e.ctrlKey);



			if (e.ctrlKey) {

				rpLocationService(e, '/search',
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

				$rootScope.$emit('rp_button_visibility', 'showSearchSort', true);
				$scope.scroll = true;

				rpLocationService(null, '/search',
					'q=' + $scope.params.q +
					'&sub=' + $scope.params.sub +
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, false);

				$scope.posts = [];
				$scope.havePosts = false;

				$scope.nothingPosts = false;
				$scope.nothingSubs = false;
				$scope.nothingLinks = false;
				$scope.noMorePosts = false;


				$rootScope.$emit('rp_progress_start');

				var thisLoad = ++currentLoad;

				rpSearchUtilService.search(function (err, data) {

					if (thisLoad === currentLoad) {
						if (err) {
							console.log('[rpSearchCtrl] err');
						} else {
							$scope.noMorePosts = data.data.children.length < $scope.params.limit;
							$rootScope.$emit('rp_progress_stop');
							if (data.data.children.length > 0) {
								addPosts(data.data.children, false);
							}
							// $scope.posts = data.data.children;
							$scope.havePosts = true;

						}

					}

				});

			}

		};

		$scope.moreSubs = function (e) {
			console.log('[rpSearchCtrl] moreSubs()');

			$rootScope.$emit('rp_button_visibility', 'showSearchSort', false);
			$rootScope.$emit('rp_button_visibility', 'showSearchTime', false);
			$scope.scroll = false;

			if (e.ctrlKey) {
				rpLocationService(e, '/search',
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

				rpLocationService(null, '/search',
					'q=' + $scope.params.q +
					'&sub=' + $scope.params.sub +
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, false);

				$scope.posts = [];
				$scope.subs = [];
				$scope.links = [];

				$scope.havePosts = false;
				$scope.haveLinks = false;
				$scope.haveSubs = false;
				$scope.noMorePosts = false;

				$rootScope.$emit('rp_progress_start');

				var thisLoad = ++currentLoad;

				rpSearchUtilService.search(function (err, data) {
					if (thisLoad === currentLoad) {
						if (err) {
							console.log('[rpSearchCtrl] err');
						} else {
							$scope.noMorePosts = data.data.children.length < $scope.params.limit;
							$rootScope.$emit('rp_progress_stop');

							if (data.data.children.length > 0) {
								addPosts(data.data.children, false);

							}
							// $scope.posts = data.data.children;
							$scope.havePosts = true;

						}

					}


				});

			}

		};

		$scope.moreLinks = function (e) {
			console.log('[rpSearchCtrl] moreSubs()');


			if (e.ctrlKey) {
				rpLocationService(e, '/search',
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

				$rootScope.$emit('rp_button_visibility', 'showSearchSort', true);
				$scope.scroll = true;

				rpLocationService(null, '/search',
					'q=' + $scope.params.q +
					'&sub=' + $scope.params.sub +
					'&type=' + $scope.params.type +
					'&restrict_sr=' + $scope.params.restrict_sr +
					'&sort=' + $scope.params.sort +
					'&after=' + $scope.params.after +
					'&t=' + $scope.params.t, false, false);

				$scope.posts = [];
				$scope.subs = [];
				$scope.links = [];

				$scope.havePosts = false;
				$scope.haveLinks = false;
				$scope.haveSubs = false;
				$scope.noMorePosts = false;

				$rootScope.$emit('rp_progress_start');

				var thisLoad = ++currentLoad;

				rpSearchUtilService.search(function (err, data) {
					if (thisLoad === currentLoad) {
						if (err) {
							console.log('[rpSearchCtrl] err');
						} else {
							$scope.noMorePosts = data.data.children.length < $scope.params.limit;
							$rootScope.$emit('rp_progress_stop');

							if (data.data.children.length > 0) {
								addPosts(data.data.children, false);

							}
							// $scope.posts = data.data.children;
							$scope.havePosts = true;

						}

					}
				});

			}
		};

		$scope.sharePost = function (e, post) {
			console.log('[rpSearchCtrl] sharePost(), post.data.url: ' + post.data.url);

			post.bottomSheet = true;

			var shareBottomSheet = $mdBottomSheet.show({
				templateUrl: 'rpShareBottomSheet.html',
				controller: 'rpShareCtrl',
				targetEvent: e,
				parent: '.rp-view',
				disbaleParentScroll: true,
				locals: {
					post: post
				}
			}).then(function () {
				console.log('[rpSearchCtrl] bottomSheet Resolved: remove rp-bottom-sheet class');
				post.bottomSheet = false;
			}).catch(function () {
				console.log('[rpSearchCtrl] bottomSheet Rejected: remove rp-bottom-sheet class');
				post.bottomSheet = false;
			});

		};

		var deregisterSearchTimeClick = $rootScope.$on('rp_search_time_click', function (e, time) {

			console.log('[rpSearchCtrl] search_time_click, time: ' + time);


			$scope.posts = [];
			$scope.havePosts = false;
			$scope.noMorePosts = false;

			$scope.params.t = time;
			$scope.params.after = '';

			rpLocationService(null, '/search',
				'q=' + $scope.params.q +
				'&sub=' + $scope.params.sub +
				'&type=' + $scope.params.type +
				'&restrict_sr=' + $scope.params.restrict_sr +
				'&sort=' + $scope.params.sort +
				'&after=' + $scope.params.after +
				'&t=' + $scope.params.t, false, true);

			$scope.havePosts = false;
			$rootScope.$emit('rp_progress_start');

			var thisLoad = ++currentLoad;

			rpSearchUtilService.search(function (err, data) {
				if (thisLoad === currentLoad) {
					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {
						$scope.noMorePosts = data.data.children.length < $scope.params.limit;
						$rootScope.$emit('rp_progress_stop');

						if (data.data.children.length > 0) {
							addPosts(data.data.children, false);

						}
						// $scope.posts = data.data.children;
						$scope.havePosts = true;

					}

				}

			});

		});

		var deregisterSearchFormSubmitted = $rootScope.$on('rp_search_form_submitted', function () {

			console.log('[rpSearchCtrl] rp_search_form_submitted');

			$scope.posts = [];

			$scope.havePosts = false;
			$scope.nothingPosts = false;
			$scope.nothingSubs = false;
			$scope.nothingLinks = false;
			$scope.noMorePosts = false;

			$rootScope.$emit('rp_progress_start');
			$rootScope.$emit('rp_init_select');

			/*
				Test the search string,
				if author:xxx specified must change type to link.
			 */
			var authorRe = /[.]*(author\:)[,]*/;
			if (authorRe.test($scope.params.q)) {
				$scope.type = $scope.params.type = 'link';
			}

			$scope.type = $scope.params.type;

			$rootScope.$emit('rp_button_visibility', 'rpSearchSort', $scope.params.type === 'link');
			$scope.scroll = $scope.params.type === 'link';

			var thisLoad = ++currentLoad;

			rpTitleChangeService('search: ' + $scope.params.q, true, true);

			/*
				Perform two search requests if we want both subs and links.
		 	*/
			if ($scope.params.type === "sr, link") {

				console.log('[rpSearchCtrl] load sr and link');

				$rootScope.$emit('rp_button_visibility', 'showSearchTime', false);


				$scope.subs = [];
				$scope.haveSubs = false;

				$scope.params.type = "sr";
				$scope.params.limit = 4;
				console.log('[rpSearchCtrl] rpSearchUtilService.params.limit: ' + rpSearchUtilService.params.limit);

				rpSearchUtilService.search(function (err, data) {
					if (thisLoad === currentLoad) {
						if (err) {
							console.log('[rpSearchCtrl] err');
						} else {

							console.log('[rpSearchCtrl] sr, data.data.children.length: ' + data.data.children.length);

							if (data && data.data.children.length > 0) {
								$scope.noMorePosts = data.data.children.length < $scope.params.limit;
								console.log('[rpSearchCtrl] sr + link search(sr), data.data.children.length: ' + data.data.children.length);
								$scope.subs = data.data.children;
								// $scope.subs.push({
								// 	more: true
								// });
								$scope.haveSubs = true;

							} else {
								$scope.nothingSubs = true;

							}

							if ($scope.haveLinks || $scope.nothingLinks) {
								console.log('[rpSearchCtrl] sr + link search(sr) over, this should only run once.');

								$rootScope.$emit('rp_progress_stop');
								$scope.params.limit = 8;
								$scope.params.type = "sr, link";

							}

						}

					}


				});

				$scope.links = [];
				$scope.haveLinks = false;

				$scope.params.type = "link";
				$scope.params.limit = 4;

				rpSearchUtilService.search(function (err, data) {
					if (thisLoad === currentLoad) {
						if (err) {
							console.log('[rpSearchCtrl] err');
						} else {

							if (data && data.data.children.length > 0) {
								$scope.noMorePosts = data.data.children.length < $scope.params.limit;
								console.log('[rpSearchCtrl] sr + link search(link), data.data.children.length: ' + data.data.children.length);

								$scope.links = data.data.children;

								// $scope.links.push({
								// 	more: true
								// });

								$scope.haveLinks = true;

							} else {
								$scope.nothingLinks = true;
							}

							if ($scope.haveSubs || $scope.nothingSubs) {
								console.log('[rpSearchCtrl] sr + link search(link) over, this should only run once.');

								$rootScope.$emit('rp_progress_stop');
								$scope.params.limit = 8;
								$scope.params.type = "sr, link";
							}

						}

					}

				});

				$scope.params.type = "sr, link";

			} else {
				console.log('[rpSearchCtrl] load sr or link');

				if ($scope.params.type === 'link' && $scope.params.sort === 'top') {
					$rootScope.$emit('rp_button_visibility', 'showSearchTime', true);
				}


				rpSearchUtilService.search(function (err, data) {
					$rootScope.$emit('rp_progress_stop');

					if (err) {
						console.log('[rpSearchCtrl] err');
					} else {

						console.log('[rpSearchCtrl] data.data.children.length: ' + data.data.children.length);

						if (data && data.data.children.length > 0) {

							$scope.noMorePosts = data.data.children.length < $scope.params.limit;

							if (data.data.children.length > 0) {
								addPosts(data.data.children, false);

							}
							// $scope.posts = data.data.children;
							$scope.havePosts = true;

						} else {
							$scope.nothingPosts = true;
						}
					}
				});
			}

		});

		function addPosts(posts, putInShortest) {
			console.log('[rpSearchCtrl] addPosts, posts.length: ' + posts.length);
			console.log('[rpSearchCtrl] addPosts, typeof $scope.posts: ' + typeof $scope.posts);
			var post = posts.shift();
			post.column = getColumn(putInShortest);
			$scope.posts.push(post);

			$timeout(function () {
				if (posts.length > 0) {
					addPosts(posts, putInShortest);
				}

			}, 50);

		}

		function getColumn(putInShortest) {

			// console.time('getShortestColumn');

			// var columns = angular.element('.rp-posts-col');
			var columns = angular.element('.rp-col-wrapper');

			var shortestColumn;
			var shortestHeight;

			if (putInShortest) {
				columns.each(function (i) {
					var thisHeight = jQuery(this).height();
					if (angular.isUndefined(shortestColumn) || thisHeight < shortestHeight) {
						shortestHeight = thisHeight;
						shortestColumn = i;
					}
				});

				return shortestColumn;

			} else {
				return $scope.posts.length % columns.length;
			}


			// console.log('[rpPostsCtrl] getShortestColumn(), shortestColumn: ' + shortestColumn + ', shortestHeight: ' + shortestHeight);

			// console.timeEnd('getShortestColumn');

		}

		var deregisterWindowResize = $rootScope.$on('rp_window_resize', function (e, to) {

			if (!angular.isUndefined($scope.posts)) {
				for (var i = 0; i < $scope.posts.length; i++) {
					$scope.posts[i].column = i % to;
				}

			}


			// var posts = $scope.posts;
			// $scope.posts = [];
			// addPosts(posts);

		});

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
			console.log('[rpPostsCtrl] rp_settings_changed, $scope.singleColumnLayout: ' + $scope.singleColumnLayout);

			if ($scope.singleColumnLayout !== rpSettingsService.settings.singleColumnLayout) {
				$scope.singleColumnLayout = rpSettingsService.settings.singleColumnLayout;

			}
		});

		$scope.$on('$destroy', function () {
			console.log('[rpSearchCtrl] destroy()');
			deregisterSearchFormSubmitted();
			deregisterSearchSortClick();
			deregisterSearchTimeClick();
			deregisterWindowResize();
			deregisterSettingsChanged();
		});

	}
]);

rpSearchControllers.controller('rpSearchTimeFilterCtrl', ['$scope', '$rootScope', 'rpSearchUtilService',
	function ($scope, $rootScope, rpSearchUtilService) {

		$scope.type = rpSearchUtilService.params.type;

		console.log('[rpSearchTimeFilterCtrl] $scope.type: ' + $scope.type);

		$scope.selectTime = function (value) {
			$rootScope.$emit('search_time_click', value);
		};
	}
]);

rpSearchControllers.controller('rpSearchSortCtrl', ['$scope', '$rootScope', '$routeParams',
	function ($scope, $rootScope, $routeParams) {
		console.log('[rpSearchSortCtrl] $routeParams.sort: ' + $routeParams.sort);
		$scope.searchSort = $routeParams.sort || 'relevance';

		$scope.selectSort = function (sort) {
			$scope.searchSort = sort;
			$rootScope.$emit('rp_sort_click', sort);
		};

	}
]);

rpSearchControllers.controller('rpSearchSubscriptionCtrl', ['$scope', '$rootScope', '$timeout', 'rpSubredditsUtilService',
	function ($scope, $rootScope, $timeout, rpSubredditsUtilService) {
		console.log('[rpSearchSubscriptionCtrl] loaded.');

		$scope.loadingSubscription = false;
		// $scope.subscribed = false;
		$scope.subscribed = rpSubredditsUtilService.isSubscribed($scope.post.data.display_name);

		$scope.toggleSubscription = function () {
			$scope.loadingSubscription = true;
			//$timeout(angular.noop, 0);


			var action = $scope.subscribed ? 'unsub' : 'sub';

			console.log('[rpSearchSubscriptionCtrl] toggleSubscription(), $scope.post.data.title: ' + $scope.post.data.display_name + ', subscribed: ' + $scope.subscribed);

			rpSubredditsUtilService.subscribe(action, $scope.post.data.name, function (err, data) {
				console.log('[rpSearchSubscriptionCtrl] callback, $scope.post.data.title: ' + $scope.post.data.title);
				if (err) {
					console.log('[rpSearchSubscriptionCtrl] err');
				} else {
					console.log('[rpSearchSubscriptionCtrl] callback, subscribed: ' + $scope.subscribed);
					$scope.loadingSubscription = false;
					console.log('[rpSearchSubscriptionCtrl] callback, subscribed: ' + $scope.subscribed);

				}
			});

		};

		var deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function () {

			$scope.subscribed = rpSubredditsUtilService.isSubscribed($scope.post.data.display_name);

		});

		$scope.$on('$destroy', function () {
			deregisterSubredditsUpdated();

		});

	}
]);