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

rpPostControllers.controller('rpPostFabCtrl', ['$scope', '$mdDialog', 'rpAuthUtilService', 'rpToastUtilService',
	function($scope, $mdDialog, rpAuthUtilService, rpToastUtilService) {

		$scope.fabState = 'closed';

		$scope.newLink = function(e) {
			if (rpAuthUtilService.isAuthenticated) {

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
			
			} else {
				$scope.fabState = 'closed';
				rpToastUtilService("You've got to log in to submit a link");
			}
		};

		$scope.newText = function(e) {

			if (rpAuthUtilService.isAuthenticated) {
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

			} else {
				$scope.fabState = 'closed';
				rpToastUtilService("You've got to log in to submit a self post");
			}
		};

	}
]);

rpPostControllers.controller('rpPostSubmitDialogCtrl', ['$scope', 
	function($scope) {

	}
]);

rpPostControllers.controller('rpPostSubmitFormCtrl', ['$scope', '$rootScope', '$interval', '$mdDialog', 'rpSubmitUtilService', 'rpCaptchaUtilService', 'rpSubredditsUtilService',
	function ($scope, $rootScope, $interval, $mdDialog, rpSubmitUtilService, rpCaptchaUtilService, rpSubredditsUtilService) {

		clearForm();
		var searchText;
		
		rpSubredditsUtilService(function(data) {
			$scope.subs = data;
		});

		$scope.subSearch = function(subSearchText) {
			searchText = subSearchText;
			var results = subSearchText ? $scope.subs.filter(createFilterFor(subSearchText)) : [];
			return results;
		};

		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(sub) {
				return (sub.data.display_name.indexOf(lowercaseQuery) === 0);
			};
		}

		function clearForm() {
			$scope.title = "";
			$scope.url = "";
			$scope.text = "";
			$scope.subreddit = "";
			$scope.sendreplies = true;
			$scope.iden = "";
			$scope.cpatcha = "";

			$scope.showSubmit = true;
			$scope.showRatelimit = false;
			$scope.showAnother = false;
			$scope.showRepost = false;

			$scope.showMessage = false;
			$scope.showButtons = true;


			if ($scope.rpSubmitNewLinkForm)
				$scope.rpSubmitNewLinkForm.$setUntouched();	
		}

		$scope.resetForm = function() {
			clearForm();
			$rootScope.$emit('reset_captcha');
		};

		$scope.submitLink = function() {
			$scope.showProgress = true;
			$scope.showButtons = false;
			$scope.showFeedback = false;

			var kind = $scope.url ? 'link' : 'self';

			console.log('[rpPostSubmitFormCtrl] submitLink(), $scope.subreddit: ' + $scope.subreddit);
			console.log('[rpPostSubmitFormCtrl] submitLink(), searchText: ' + searchText);

			$scope.subreddit = $scope.mdSelectedItem ? $scope.mdSelectedItem.data.display_name : searchText;

			rpSubmitUtilService(kind, $scope.resubmit, $scope.sendreplies, $scope.subreddit, 
				$scope.text, $scope.title, $scope.url, $scope.iden, $scope.captcha, function(data) {

				console.log('[rpPostSubmitFormCtrl] submitLink(), $scope.subreddit: ' + $scope.subreddit);

				$scope.showProgress = false;

				if (data.json.errors.length > 0) {


					console.log('[rpPostSubmitFormCtrl] error in submission, data.json.errors[0][0]: ' + data.json.errors[0][0]);
					console.log('[rpPostSubmitFormCtrl] error in submission, data.json.errors[0][1]: ' + data.json.errors[0][1]);

					//ratelimit error. (Still untested)
					if (data.json.errors[0][0] === 'RATELIMIT') {
						console.log('[rpPostSubmitFormCtrl] ratelimit error. data: ' + JSON.stringify(data));

						$scope.showSubmit = false;
						$scope.showRatelimit = true;

						var duration = data.json.ratelimit;

						var countdown = $interval(function(){

							var minutes = parseInt(duration / 60, 10);
							var seconds = parseInt(duration % 60, 10);

							minutes = minutes < 10 ? "0" + minutes : minutes;
							seconds = seconds < 10 ? "0" + seconds : seconds;

							$scope.rateLimitTimer = minutes + ":" + seconds;

							if (--duration < 0) {

								$rootScope.$emit('reset_captcha');

								$scope.showRatelimit = false;
								$scope.showSubmit = true;
								$interval.cancel(countdown);
							}


						}, 1000);						
					
						$scope.feedbackMessage = data.json.errors[0][1];

						$scope.showFeedbackAlert = true;
						$scope.showFeedbackLink = false;
						$scope.showFeedback = true;

					
						$scope.showButtons = true;
					}

					else if (data.json.errors[0][0] === 'QUOTA_FILLED') {
						console.log('[rpPostSubmitFormCtrl] QUOTA_FILLED ERROR');

						$scope.feedbackMessage = data.json.errors[0][1];

						$scope.showFeedbackAlert = true;
						$scope.showFeedbackLink = false;
						$scope.showFeedback = true;
						$scope.showSubmit = false;
						$scope.showButtons = true;
					}

					else if (data.json.errors[0][0] === 'BAD_CAPTCHA') {
						console.log('[rpPostSubmitFormCtrl] bad captcha error.');
						$rootScope.$emit('reset_captcha');					
						
						$scope.feedbackMessage = "You entered the CAPTCHA incorrectly. Please try again.";
					
						$scope.showFeedbackAlert = true;
						$scope.showFeedbackLink = false;
						$scope.showFeedback = true;
					
						$scope.submitButtonText = 'Submit';
						$scope.showButtons = true;
					}
					
					//repost error ----not sure of this error name----
					else if (data.json.errors[0][0] === 'ALREADY_SUB') { 
						console.log('[rpPostSubmitFormCtrl] repost error: ' + JSON.stringify(data));
						$rootScope.$emit('reset_captcha');

						// $scope.feedbackLink = data;
						// $scope.feedbackLinkName = "The link";
						// $scope.feedbackMessage = "you tried to submit has been submitted to this subreddit before";

						$scope.resubmit = true;
					
						$scope.feedbackMessage = data.json.errors[0][1];
						$scope.showFeedbackAlert = true;
						$scope.showFeedbackLink = false;
						$scope.showFeedback = true;
					
						$scope.showSubmit = false;
						$scope.showRepost = true;

						$scope.showButtons = true;

					} 

					/*
						Catches unspecififed errors or ones that do not require special handling.
						Catches, SUBREDDIT_ERROR. 
					 */

					else { 
						console.log('[rpPostSubmitFormCtrl] error catchall: ' + JSON.stringify(data));
						$rootScope.$emit('reset_captcha');

						$scope.feedbackMessage = data.json.errors[0][1];
					
						$scope.showFeedbackAlert = true;
						$scope.showFeedbackLink = false;
						$scope.showFeedback = true;
					
						$scope.showSubmit = true;
						$scope.showButtons = true;
					} 

				} else if (!data.json.data.url) {
					console.log('[rpPostSubmitFormCtrl] garbage url error occurred.');

					$rootScope.$emit('reset_captcha');

					$scope.feedbackMessage = 'An error occurred trying to post your link.\nPlease check the url, wait a few minutes and try again.';
					$scope.showFeedbackLink = false;
					$scope.showFeedbackAlert = true;
					$scope.showFeedback = true;

					$scope.showButtons = true;
				
				} else { //Successful Post :)
					console.log('[rpPostSubmitFormCtrl] successful submission, data: ' + JSON.stringify(data));

					$scope.feedbackLink = data.json.data.url;
					$scope.feedbackLinkName = "Your link";
					$scope.feedbackMessage = "was submitted successfully.";
					
					$scope.showFeedbackAlert = false;
					$scope.showFeedbackLink = true;
					$scope.showFeedback = true;

					$scope.showRepost = false;
					$scope.showSubmit = false;
					$scope.showAnother = true;
					$scope.showButtons = true;
					
				}

			});
	
		};

		$scope.closeDialog = function() {
			$mdDialog.hide();
		};

		function startRateLimitTimer(duration) {

			$scope.rateLimitSubmitDisabled = true;
			console.log('[rpPostSubmitFormCtrl] duration: ' + duration);



		}


	}
]);