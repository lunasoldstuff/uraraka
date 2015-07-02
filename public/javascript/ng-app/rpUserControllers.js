'use strict';

var rpUserControllers = angular.module('rpUserControllers', []);

rpUserControllers.controller('rpUserCtrl', 
	[
		'$scope', 
		'$rootScope',
		'$window',
		'$routeParams',
		'$location',
		'$filter',
		'$mdDialog',
		'rpUserUtilService',
		'rpTitleChangeService',
		'rpSettingsUtilService',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',
		'rpByIdUtilService',
		'rpUserTabUtilService',
		'rpUserFilterButtonUtilService',
		'rpPostFilterButtonUtilService',
	
	function($scope, $rootScope, $window, $routeParams, $location, $filter, $mdDialog, rpUserUtilService, rpTitleChangeService, rpSettingsUtilService, rpSaveUtilService, 
		rpUpvoteUtilService, rpDownvoteUtilService, rpByIdUtilService, rpUserTabUtilService, rpUserFilterButtonUtilService, rpPostFilterButtonUtilService) {

		rpPostFilterButtonUtilService.hide();

		var loadingMore = false;
		$scope.havePosts = false;
		
		var value = $window.innerWidth;
		if (value > 1550) $scope.columns = [1, 2, 3];
		else if (value > 970) $scope.columns = [1, 2];
		else $scope.columns = [1];

		var username = $routeParams.username;
		var where = $routeParams.where || 'overview';
		var sort = $routeParams.sort || 'new';
		var t = $routeParams.t || 'none';

		rpUserTabUtilService.setTab(where);
		console.log('[rpUserCtrl] where: ' + where);

		if (sort === 'top' || sort === 'controversial') {
			rpUserFilterButtonUtilService.show();
		} else {
			rpUserFilterButtonUtilService.hide();
		}

		rpTitleChangeService.prepTitleChange('u/' + username);

		/*
			Manage setting to open comments in a dialog or window.
		*/
		$scope.commentsDialog = rpSettingsUtilService.settings.commentsDialog;

		$rootScope.$emit('progressLoading');

		rpUserUtilService(username, where, sort, '', t, function(data) {
			//$rootScope.$emit('progressComplete');
			
			if (data)
				rpTitleChangeService.prepTitleChange('u/' + data[0].data.author);
			
			$scope.posts = data;
			$scope.havePosts = true;
		});

		$scope.morePosts = function() {
			if ($scope.posts && $scope.posts.length > 0) {
				
				var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
				
				if (lastPostName && !loadingMore) {
				
					loadingMore = true;
				
					$rootScope.$emit('progressLoading');
				
					rpUserUtilService(username, where, sort, lastPostName, t, function(data) {
						Array.prototype.push.apply($scope.posts, data);
						//$rootScope.$emit('progressComplete');
						loadingMore = false;
					});
				
				}
			}
		};

		$rootScope.$on('user_sort_click', function(e, s){
			console.log('[rpUserCtrl] user_sort_click');
				
			sort = s;

			$location.path('/u/' + username + '/' + where, false).search('sort=' + sort).replace();


			$scope.havePosts = false;
			
			$rootScope.$emit('progressLoading');
			
			rpUserUtilService(username, where, sort, '', t, function(data) {
				
				//$rootScope.$emit('progressComplete');
				
				$scope.posts = data;
				$scope.havePosts = true;

			});

		});

		$rootScope.$on('user_t_click', function(e, time){
			console.log('[rpUserCtrl] user_t_click');

			t = time;

			$location.path('/u/' + username + '/' + where, false).search('sort=' + sort + '&t=' + t).replace();

			$scope.havePosts = false;
			
			$rootScope.$emit('progressLoading');

			rpUserUtilService(username, where, sort, '', t, function(data) {
				
				//$rootScope.$emit('progressComplete');
				
				$scope.posts = data;
				$scope.havePosts = true;

			});

		});

		$rootScope.$on('user_tab_click', function(e, tab) {
			console.log('[rpUserCtrl] user_tab_click');
			where = tab;

			$location.path('/u/' + username + '/' + where, false).replace();

			$scope.havePosts = false;
			
			$rootScope.$emit('user_tab_change', tab);
			$rootScope.$emit('progressLoading');
			
			rpUserUtilService(username, where, sort, '', t, function(data) {
				
				//$rootScope.$emit('progressComplete');
				
				$scope.posts = data;
				$scope.havePosts = true;

			});
		});

		$scope.savePost = function(post) {
				
			rpSaveUtilService(post);

		};

		$scope.upvotePost = function(post) {

			rpUpvoteUtilService(post);

		};
		
		$scope.downvotePost = function(post) {
			
			rpDownvoteUtilService(post);

		};

		$scope.showComments = function(e, post) {
			var id = post.data.link_id || post.data.name;
			rpByIdUtilService(id, function(data) {
			
				if ($scope.commentsDialog) {
					$mdDialog.show({
						controller: 'rpCommentsDialogCtrl',
						templateUrl: 'partials/rpCommentsDialog',
						targetEvent: e,
						// parent: angular.element('#rp-content'),
						locals: {
							post: data
						},
						clickOutsideToClose: true,
						escapeToClose: false

					});
				
				} else {
					$location.path('/r/' + data.data.subreddit + '/comments/' + data.data.id, true);
				}

			});
		};

		$scope.showContext = function(post) {
			console.log('[rpUserCtrl] showContext()');

			$location.path(
				'/r/' + post.data.subreddit + 
				'/comments/' + 
				$filter('rp_name_to_id36')(post.data.link_id) + 
				'/' + post.data.id + '/', true)
				.search('context=8');
		};
	}
]);

rpUserControllers.controller('rpUserReplyCtrl', ['$scope', 'rpPostCommentUtilService', 
	function($scope, rpPostCommentUtilService) {
		
		$scope.postReply = function(name, comment) {

			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();

			});

		};
	}
]);

rpUserControllers.controller('rpUserTabsCtrl', ['$scope', '$rootScope', 'rpUserTabUtilService', 'rpUserSortButtonUtilService',
	
	function($scope, $rootScope, rpUserTabUtilService, rpUserSortButtonUtilService) {
	
		selectTab();
		var firstLoadOver = false;

		$scope.tabClick = function(tab) {
			console.log('[rpUserTabsCtrl] tabClick()');
			
			if (firstLoadOver) {
				$rootScope.$emit('user_tab_click', tab);
				rpUserTabUtilService.setTab(tab);
				
			} else {
				firstLoadOver = true;
			}
		};

		$rootScope.$on('user_tab_change', function(e, tab){
			console.log('[rpUserTabsCtrl] user_tab_change');

			selectTab();
		});

		function selectTab() {
			console.log('[rpUserTabsCtrl] selectTab()');

			var tab = rpUserTabUtilService.tab;

			if (tab === 'overview' || tab === 'submitted' || tab === 'comments') {
				rpUserSortButtonUtilService.show();
			} else {
				rpUserSortButtonUtilService.hide();
			}

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
		}
	}
]);

rpUserControllers.controller('rpUserSortCtrl', ['$scope', '$rootScope', 'rpUserFilterButtonUtilService',
	function($scope, $rootScope, rpUserFilterButtonUtilService) {
		$scope.selectSort = function(value) {
			console.log('[rpUserSortCtrl] selectSort()');

			if (value === 'top' || value === 'controversial') {
				rpUserFilterButtonUtilService.show();
			} else {
				rpUserFilterButtonUtilService.hide();
			}

			$rootScope.$emit('user_sort_click', value);
		};
	}
]);

rpUserControllers.controller('rpUserTimeFilterCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {
		$scope.selectTime = function(value){
			console.log('[rpUserTimeFilterCtrl] selectTime()');

			$rootScope.$emit('user_t_click', value);
		};
	}
]);
