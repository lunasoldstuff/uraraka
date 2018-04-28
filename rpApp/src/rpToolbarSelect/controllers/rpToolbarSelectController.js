(function() {
	'use strict';
	angular.module('rpToolbarSelect').controller('rpToolbarSelectCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		'rpAppAuthService',
		'rpIdentityService',
		rpToolbarSelectCtrl
	]);

	function rpToolbarSelectCtrl(
		$scope,
		$rootScope,
		$routeParams,
		rpAppAuthService,
		rpIdentityService

	) {

		console.log('[rpToolbarSelectCtrl] $scope.type: ' + $scope.type);

		var configurations = {
			postSort: {
				event: 'rp_post_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: 0,
				options: [{
					label: 'hot',
					value: 'hot'
				}, {
					label: 'new',
					value: 'new'
				}, {
					label: 'rising',
					value: 'rising'
				}, {
					label: 'controversial',
					value: 'controversial'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'gilded',
					value: 'gilded'
				}]

			},
			postTime: {
				event: 'rp_post_time_click',
				routeParam: 't',
				ariaLabel: 'time',
				defaultOption: 2,
				options: [{
					label: 'this hour',
					value: 'hour'
				}, {
					label: 'today',
					value: 'day'
				}, {
					label: 'this week',
					value: 'week'
				}, {
					label: 'this month',
					value: 'month'
				}, {
					label: 'this year',
					value: 'year'
				}, {
					label: 'all time',
					value: 'all'
				}]
			},
			articleSort: {
				event: 'rp_article_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: '0',
				options: [{
					label: 'best',
					value: 'confidence'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'new',
					value: 'new'
				}, {
					label: 'hot',
					value: 'hot'
				}, {
					label: 'controversial',
					value: 'controversial'
				}, {
					label: 'old',
					value: 'old'
				}, {
					label: 'q&a',
					value: 'qa'
				}]
			},
			userWhere: {
				event: 'rp_user_where_click',
				routeParam: 'where',
				ariaLabel: 'where',
				defaultOption: 0,
				options: [{
					label: 'overview',
					value: 'overview'
				}, {
					label: 'submitted',
					value: 'submitted'
				}, {
					label: 'comments',
					value: 'comments'
				}, {
					label: 'gilded',
					value: 'gilded'
				}]
			},
			userSort: {
				event: 'rp_user_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: 0,
				options: [{
					label: 'new',
					value: 'new'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'hot',
					value: 'hot'
				}, {
					label: 'controversial',
					value: 'controversial'
				}]
			},
			userTime: {
				event: 'rp_user_time_click',
				routeParam: 't',
				ariaLabel: 'time',
				defaultOption: 1,
				options: [{
					label: 'this hour',
					value: 'hour'
				}, {
					label: 'today',
					value: 'day'
				}, {
					label: 'this week',
					value: 'week'
				}, {
					label: 'this month',
					value: 'month'
				}, {
					label: 'this year',
					value: 'year'
				}, {
					label: 'all time',
					value: 'all'
				}]
			},
			searchSort: {
				event: 'rp_search_sort_click',
				routeParam: 'sort',
				ariaLabel: 'sort',
				defaultOption: '0',
				options: [{
					label: 'relevance',
					value: 'relevance'
				}, {
					label: 'hot',
					value: 'hot'
				}, {
					label: 'top',
					value: 'top'
				}, {
					label: 'new',
					value: 'new'
				}, {
					label: 'comments',
					value: 'comments'
				}]
			},
			searchTime: {
				event: 'rp_search_time_click',
				routeParam: 't',
				ariaLabel: 'time',
				defaultOption: 1,
				options: [{
					label: 'this hour',
					value: 'hour'
				}, {
					label: 'today',
					value: 'day'
				}, {
					label: 'this week',
					value: 'week'
				}, {
					label: 'this month',
					value: 'month'
				}, {
					label: 'this year',
					value: 'year'
				}, {
					label: 'all time',
					value: 'all'
				}]
			},
			messageWhere: {
				event: 'rp_message_where_click',
				routeParam: 'where',
				ariaLabel: 'where',
				defaultOption: 0,
				options: [{
					label: 'all',
					value: 'inbox'
				}, {
					label: 'unread',
					value: 'unread'
				}, {
					label: 'messages',
					value: 'messages'
				}, {
					label: 'comment replies',
					value: 'comments'
				}, {
					label: 'post replies',
					value: 'selfreply'
				}, {
					label: 'username mentions',
					value: 'mentions'
				}]
			}
		};

		var config = configurations[$scope.type];
		$scope.ariaLabel = config.ariaLabel;
		// console.log('[rpToolbarSelectCtrl] config: ' + JSON.stringify(config));

		$scope.options = config.options;

		initSelect();

		$scope.select = function() {
			$rootScope.$emit(config.event, $scope.selection.value);
		};

		var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
			console.log('[rpToolbarSelectCtrl] onRouteChange');
			initSelect();
		});

		var deregisterSearchFormSubmitted = $rootScope.$on('rp_init_select', function() {
			initSelect();
		});

		function initSelect() {
			console.log('[rpToolbarSelectCtrl] initSelect(), config.routeParam: ' + config.routeParam);
			console.log('[rpToolbarSelectCtrl] initSelect(), $routeParams[config.routeParam]: ' + $routeParams[config.routeParam]);
			console.log('[rpToolbarSelectCtrl] initSelect(), $scope.type: ' + $scope.type);

			var selection;

			var routeParam = $routeParams[config.routeParam];

			if (rpAppAuthService.isAuthenticated && $scope.type === 'userWhere') {

				rpIdentityService.getIdentity(function(identity) {
					console.log('[rpToolbarSelectCtrl] initSelect(), foo');

					if ($routeParams.username === identity.name) {
						$scope.options = $scope.options.concat([{
							label: 'upvoted',
							value: 'upvoted'
						}, {
							label: 'downvoted',
							value: 'downvoted'
						}, {
							label: 'hidden',
							value: 'hidden'
						}, {
							label: 'saved',
							value: 'saved'
						}]);
					} else { //make sure they are removed
						//in case you are going from your profile to someone elses
						$scope.options = config.options;
					}

					setSelection();

				});


			} else {
				setSelection();
			}

			function setSelection() {
				if (angular.isDefined(routeParam)) {
					console.log('[rpToolbarSelectCtrl] initSelect(), bar, $scope.options.length: ' + $scope.options.length);
					for (var i = 0; i < $scope.options.length; i++) {
						if ($scope.options[i].value === routeParam) {
							selection = $scope.options[i];
							break;
						}
					}
				}

				if (angular.isUndefined(selection)) {
					selection = config.options[config.defaultOption];
				}

				$scope.selection = selection;
			}



		}

		$scope.$on('$destroy', function() {
			deregisterRouteChangeSuccess();
		});

	}
})();