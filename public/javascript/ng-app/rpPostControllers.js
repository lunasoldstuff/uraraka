'use strict';

var rpPostControllers = angular.module('rpPostControllers', []);

rpPostControllers.controller('rpPostsCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$log',
		'$window',
		'$location',
		'$timeout',
		'rpPostsService',
		'rpTitleChangeService',
		'rpSubredditService',
		'$mdToast',
		'$mdDialog',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',
		'rpPostsTabUtilService',
		'rpUserFilterButtonUtilService',
		'rpUserSortButtonUtilService',

		function($scope, $rootScope, $routeParams, $log, $window, $location, $timeout, rpPostsService, rpTitleChangeService, rpSubredditService, 
			$mdToast, $mdDialog, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService, rpPostTabsUtilService, rpUserFilterButtonUtilService, rpUserSortButtonUtilService) {

			rpUserFilterButtonUtilService.hide();
			rpUserSortButtonUtilService.hide();

			var value = $window.innerWidth;
			
			if (value > 1550) {
				// $log.log("Changing to 3 columns, window size: " + value);
				$scope.columns = [1, 2, 3];
			} else if (value > 970) {
				// $log.log("Changing to 2 columns, window size: " + value);
				$scope.columns = [1, 2];
			} else {
				// $log.log("Changing to 1 column, window size: " + value);
				$scope.columns = [1];
			}

			var sort = $routeParams.sort ? $routeParams.sort : 'hot';
			var sub = $routeParams.sub ? $routeParams.sub : 'all';
			var t = $routeParams.t ? $routeParams.t : '';
			var loadingMore = false;
			$scope.showSub = true;
			$scope.havePosts = false;

			rpPostTabsUtilService.setTab(sort);

			if (sub == 'all'){
				$scope.showSub = true;
				rpTitleChangeService.prepTitleChange('reddit: the frontpage of the internet');
			}
			else{
				$scope.showSub = false;
				rpTitleChangeService.prepTitleChange('r/' + sub);
			}
			rpSubredditService.prepSubredditChange(sub);

			/*
				Loading Posts
			 */
			$rootScope.$emit('progressLoading');
			rpPostsService.query({sub: sub, sort: sort, t: t}, function(data){
				$rootScope.$emit('progressComplete');
				$scope.posts = data;
				$scope.havePosts = true;

			});

			/*
				Load more posts using the 'after' parameter.
			 */
			$scope.morePosts = function() {
				if ($scope.posts && $scope.posts.length > 0){
					var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
					if(lastPostName && !loadingMore){
						loadingMore = true;
						$rootScope.$emit('progressLoading');
						rpPostsService.query({sub: sub, sort: sort, after: lastPostName, t: t}, function(data) {
							Array.prototype.push.apply($scope.posts, data);
							loadingMore = false;
							$rootScope.$emit('progressComplete');
						});
					}
				}
			};

			$rootScope.$on('t_click', function(e, time){
				
				t = time;

				$location.path('/r/' + sub + '/' + sort, false).search('t=' + t);

				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;

				rpPostsService.query({sub: sub, sort: sort, t: t}, function(data) {

					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
					
				});

			});

			$rootScope.$on('posts_tab_click', function(e, tab){
				
				sort = tab;
				$location.path('/r/' + sub + '/' + sort, false);

				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;
				rpPostsService.query({sub: sub, sort: sort, t: t}, function(data) {
					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
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
				
				$mdDialog.show({
					controller: 'rpCommentsDialogCtrl',
					templateUrl: 'partials/rpCommentsDialog',
					targetEvent: e,
					// parent: angular.element('#rp-content'),
					locals: {
						post: post
					},
					clickOutsideToClose: true,
					escapeToClose: false

				});
			};

		}
	]
);

rpPostControllers.controller('rpPostReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {


		$scope.postReply = function(name, comment) {

			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();

			});

		};
	}
]);

rpPostControllers.controller('rpPostsTabsCtrl', ['$scope', '$rootScope', 'rpPostsTabUtilService', 'rpPostFilterButtonUtilService',
	function($scope, $rootScope, rpPostsTabUtilService, rpPostFilterButtonUtilService) {

		selectTab();

		$rootScope.$on('posts_tab_change', function(e, tab){

			selectTab();

		});

		$scope.tabClick = function(tab) {
			$rootScope.$emit('posts_tab_click', tab);
			rpPostsTabUtilService.setTab(tab);
		};

		function selectTab() {

			var tab = rpPostsTabUtilService.tab;

			if (tab === 'top' || tab === 'controversial') {
				rpPostFilterButtonUtilService.show();
			} else {
				rpPostFilterButtonUtilService.hide();
			}

			switch(tab) {
				case 'hot':
					$scope.selectedIndex = 0;
					break;
				case 'new':
					$scope.selectedIndex = 1;
					break;
				case 'rising':
					$scope.selectedIndex = 2;
					break;
				case 'controversial':
					$scope.selectedIndex = 3;
					break;
				case 'top':
					$scope.selectedIndex = 4;
					break;
				default:
					$scope.selectedIndex = 0;
					break;
			}			
		}
	}
]);

rpPostControllers.controller('rpPostsTimeFilterCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {
		$scope.selectTime = function(value){
			$rootScope.$emit('t_click', value);
		};
	}
]);

rpPostControllers.controller('rpPostFabCtrl', ['$scope', '$mdDialog',
	function($scope, $mdDialog) {

		$scope.fabState = 'closed';

		$scope.newLink = function(e) {
			// console.log('[rpPostFabCtrl] newLink, subreddit: ' + $scope.posts[0].data.subreddit);

			$mdDialog.show({
				controller: 'rpPostSubmitDialogCtrl',
				templateUrl: 'partials/rpSubmitLinkDialog',
				targetEvent: e,
				// locals: {
				// 	subreddit: subreddit
				// },
				clickOutsideToClose: true,
				escapeToClose: false

			});

			$scope.fabState = 'closed';
		};

		$scope.newText = function(e) {
			console.log('[rpPostFabCtrl] newText()');

			$mdDialog.show({
				controller: 'rpPostSubmitDialogCtrl',
				templateUrl: 'partials/rpSubmitTextDialog',
				targetEvent: e,
				// locals: {
				// 	subreddit: subreddit
				// },
				clickOutsideToClose: true,
				escapeToClose: false

			});

			$scope.fabState = 'closed';
		};

	}
]);

rpPostControllers.controller('rpPostSubmitDialogCtrl', ['$scope', 
	function($scope) {

	}
]);

rpPostControllers.controller('rpPostSubmitFormCtrl', ['$scope', '$rootScope', '$interval', '$mdDialog', 'rpSubmitUtilService', 'rpCaptchaUtilService',
	function ($scope, $rootScope, $interval, $mdDialog, rpSubmitUtilService, rpCaptchaUtilService) {

		clearForm();
		
		$scope.closeDialog = function() {
			clearForm();
			$mdDialog.hide();
		};

		$scope.submitLink = function(kind) {
			
			$scope.showProgress = true;
			$scope.showSubmit = false;
			$scope.showResubmit = false;
			$scope.showRatelimit = false;
			$scope.showSubmitted = false;
			$scope.showError = false;

			$rootScope.$emit('hide_bad_captcha');

			rpSubmitUtilService(kind, $scope.resubmit, $scope.sendreplies, $scope.subreddit, 
				$scope.text, $scope.title, $scope.url, $scope.iden, $scope.captcha, function(data) {

				console.log('[rpPostSubmitFormCtrl] submitLink, $scope.captcha: ' + $scope.captcha);
				console.log('[rpPostSubmitFormCtrl] submitLink, $scope.iden: ' + $scope.iden);
				
				$scope.showProgress = false;

				if (!data.json.url) {
					console.log('[rpPostSubmitFormCtrl] garbage url error occurred.');

					$rootScope.$emit('reset_captcha');
					$scope.showError = true;
					$scope.showSubmit = true;

				}


				else if (data.json.errors.length > 0) {
					$rootScope.$emit('reset_captcha');

					// check for repost error
					console.log('[rpPostSubmitFormCtrl] error in submission, data.json.errors[0][0]: ' + data.json.errors[0][0]);
					console.log('[rpPostSubmitFormCtrl] error in submission, data.json.errors[0][1]: ' + data.json.errors[0][1]);

					//ratelimit error. (Still untedted)
					if (data.json.errors[0][0] === 'RATELIMIT') {
						console.log('[rpPostSubmitFormCtrl] ratelimit error. data: ' + JSON.stringify(data));
						$scope.showRatelimit = true;
						$scope.ratelimitMessage = data.json.errors[0][1];
						startRateLimitTimer(data.json.ratelimit);
					}

					if (data.json.errors[0][0] === 'BAD_CAPTCHA') {
						console.log('[rpPostSubmitFormCtrl] bad captcha error.');
						$rootScope.$emit('bad_captcha');
						$scope.showSubmit = true;
					}
					
					//repost error ----not sure of this error name----
					if (data.json.errors[0][0] === 'REPOST_ERROR') { 
						console.log('[rpPostSubmitFormCtrl] repost error: ' + JSON.stringify(data));
						
						// $scope.submittedLink = data....
						// $scope.resubmit = true;

						$scope.showResubmit = true;

					} 

				} else { //Successful Post :)
					console.log('[rpPostSubmitFormCtrl] successful submission, data: ' + JSON.stringify(data));
					$scope.submittedLink = data.json.data.url;
					$scope.showSubmitted = true;
					
					console.log('[rpPostSubmitFormCtrl] submitLink successful, no errors, $scope.submittedLink: ' + $scope.submittedLink);
				}

			});
		};

		$scope.resubmit = function(kind) {
			$scope.showResubmit = true;
			$scope.submitLink(kind);
		};

		$scope.resetForm = function() {
			clearForm();
			$rootScope.$emit('reset_captcha');
		};

		function clearForm() {
			$scope.title = "";
			$scope.url = "";
			$scope.text = "";
			$scope.subreddit = "";
			$scope.sendreplies = true;
			$scope.iden = "";
			$scope.cpatcha = "";

			$scope.showResubmit = false;
			$scope.showProgress = false;
			$scope.showSubmitted = false;
			$scope.showRatelimit = false;
			$scope.showError = false;
			$scope.showSubmit = true;

			if ($scope.rpSubmitNewLinkForm)
				$scope.rpSubmitNewLinkForm.$setUntouched();			
		}

		function startRateLimitTimer(duration) {

			$scope.rateLimitSubmitDisabled = true;
			console.log('[rpPostSubmitFormCtrl] duration: ' + duration);

			$interval(function(){

				var minutes = parseInt(duration / 60, 10);
				var seconds = parseInt(duration % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
        		seconds = seconds < 10 ? "0" + seconds : seconds;

        		$scope.rateLimitTimer = minutes + ":" + seconds;

        		if (--duration < 0) {
        			$scope.rateLimitSubmitDisabled = false;
        			$scope.rateLimitTimer = "SUBMIT";
        		}


			}, 1000);

		}

	}
]);