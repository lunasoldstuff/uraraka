(function() {
	'use strict';
	angular.module('rpSearch').controller('rpSearchFormCtrl', [
		'$scope',
		'$rootScope',
		'$location',
		'$routeParams',
		'$timeout',
		'rpSearchService',
		'rpSubredditsUtilService',
		'rpAppLocationService',
		rpSearchFormCtrl
	]);

	function rpSearchFormCtrl(
		$scope,
		$rootScope,
		$location,
		$routeParams,
		$timeout,
		rpSearchService,
		rpSubredditsUtilService,
		rpAppLocationService

	) {
		console.log('[rpSearchFormCtrl] loaded, $scope.$id: ' + $scope.$id);

		$scope.params = rpSearchService.params;

		//Set the current sub if we open the search form on a page other than frontpage, all or search page.
		if (rpSubredditsUtilService.currentSub && rpSubredditsUtilService.currentSub !== '') {
			console.log('[rpSearchFormCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);
			$scope.params.sub = rpSubredditsUtilService.currentSub;
		} else {
			$scope.params.sub = rpSearchService.params.sub;
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

		$scope.toggleSearchSubreddits = function() {
			console.log('[rpSearchFormCtrl] toggleSearchSubreddits');
			$scope.searchSubreddits = !$scope.searchSubreddits;

			if (!$scope.searchLinks) {
				$scope.searchLinks = true;
			}

			calcType();
		};

		$scope.toggleSearchLinks = function() {
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

		$scope.subSearch = function() {
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

		var deregisterSearchParamsChanged = $rootScope.$on('search_params_changed', function() {
			$scope.params = rpSearchService.params;
		});

		$scope.submitSearchForm = function(e) {

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
				console.log('[rpSearchFormCtrl] settings sub to all. rpSearchService.params.sub: ' + rpSearchService.params.sub);
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

			$timeout(function() {
				rpAppLocationService(null, '/search',
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

		$scope.resetSearchForm = function() {

		};

		$scope.$on('$destroy', function() {
			deregisterSearchParamsChanged();
		});

	}

})();