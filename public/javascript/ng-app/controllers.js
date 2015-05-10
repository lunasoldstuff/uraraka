'use strict';

/* Controllers */

var redditPlusControllers = angular.module('redditPlusControllers', []);

/*
	Top level controller.
	controls sidenav toggling. (This might be better suited for the sidenav controller no?)
 */
redditPlusControllers.controller('AppCtrl', 
	[
		'$scope', 
		'$rootScope',
		'$timeout', 
		'$mdSidenav', 
		'$log', 
		'titleChangeService',
		'rpAuthUtilService',
	
	function($scope, $rootScope, $timeout, $mdSidenav, $log, titleChangeService, rpAuthUtilService) {
		

		$scope.appTitle = 'reddit: the frontpage of the internet';

		$scope.$on('handleTitleChange', function(e, d) {
			$scope.appTitle = titleChangeService.title;
		});

		$scope.toggleLeft = function() {
			$mdSidenav('left').toggle();
		};

		$scope.close = function() {
			$mdSidenav('left').close();
		};

		$scope.$watch('authenticated', function(newValue, oldValue) {

			rpAuthUtilService.setAuthenticated(newValue);

		});

	}
]);

redditPlusControllers.controller('identityCtrl', ['$scope', 'identityService',
	function($scope, identityService){
		$scope.identity = identityService.query();
	}
]);

redditPlusControllers.controller('toastCtrl', ['$scope', '$rootScope', '$mdToast', 'toastMessage',
	function($scope, $rootScope, $mdToast, toastMessage){
		$scope.toastMessage = toastMessage;

		$scope.closeToast = function() {
			$mdToast.close();
		};

		$rootScope.$on('show_toast', function(e, message) {
			$mdToast.show({
				locals: {toastMessage: message},
				controller: 'toastCtrl',
				templateUrl: 'partials/rpToast',
				hideDelay: 2000,
				position: "top left",
			});			
		});

	}
]);

// redditPlusControllers.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
//   $scope.close = function() {
// 	$mdSidenav('left').close();
//   };
// });

/*
	Toolbar controller handles title change through titleService.
 */
redditPlusControllers.controller('toolbarCtrl', ['$scope', '$rootScope', '$log', 'titleChangeService',
	function($scope, $rootScope, $log, titleChangeService) {
		$scope.filter = false;

	$scope.toolbarTitle = 'reddit: the frontpage of the internet';
	$scope.$on('handleTitleChange', function(e, d) {
		$scope.toolbarTitle = titleChangeService.title;
	});

	$rootScope.$on('tab_change', function(e, tab) {
		if (tab == 'top' || tab == 'controversial') {
			$scope.filter = true;
		} else {
			$scope.filter = false;
		}
	});
	}
]);

redditPlusControllers.controller('tabsCtrl', ['$scope', '$rootScope', '$log', 'subredditService',
	function($scope, $rootScope, $log, subredditService) {
	$scope.subreddit = 'all';
	$scope.selectedIndex = 0;

	$scope.$on('handleSubredditChange', function(e, d){
		$scope.subreddit = subredditService.subreddit;
	});

	$rootScope.$on('tab_change', function(e, tab){
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
	});

	$scope.tabClick = function(tab) {

		console.log('[tabsCtrl] tabClick: ' + tab);

		$rootScope.$emit('tab_click', tab);
	};
	}
]);

redditPlusControllers.controller('timeFilterCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {
		$scope.selectTime = function(value){
			$rootScope.$emit('t_click', value);
		};

	}
]);

redditPlusControllers.controller('postsCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$log',
		'$window',
		'$timeout',
		'postsService',
		'titleChangeService',
		'subredditService',
		'$mdToast',
		'$mdDialog',
		'commentService',
		'rpSaveUtilService',
		'rpUpvoteUtilService',
		'rpDownvoteUtilService',

		function($scope, $rootScope, $routeParams, $log, $window, $timeout, postsService, titleChangeService, 
			subredditService, $mdToast, $mdDialog, commentService, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService) {

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
			var t;
			var loadingMore = false;
			$scope.showSub = true;
			$scope.havePosts = false;

			if (sub == 'all'){
				$scope.showSub = true;
				titleChangeService.prepTitleChange('reddit: the frontpage of the internet');
			}
			else{
				$scope.showSub = false;
				titleChangeService.prepTitleChange('r/' + sub);
			}
			subredditService.prepSubredditChange(sub);

			$rootScope.$emit('tab_change', sort);

			/*
				Loading Posts
			 */

			$rootScope.$emit('progressLoading');
			postsService.query({sub: sub, sort: sort}, function(data){
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
						postsService.query({sub: sub, sort: sort, after: lastPostName, t: t}, function(data) {
							Array.prototype.push.apply($scope.posts, data);
							loadingMore = false;
							$rootScope.$emit('progressComplete');
						});
					}
				}
			};

			$rootScope.$on('t_click', function(e, time){
				t = time;
				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;

				postsService.query({sub: sub, sort: sort, t: t}, function(data){
					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
				});
			});

			$rootScope.$on('tab_click', function(e, tab){
				sort = tab;
				$rootScope.$emit('tab_change', tab);
				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;
				postsService.query({sub: sub, sort: sort}, function(data) {
					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
				});
			});

			/*
				event handlers for post actions emitted from comments controller
			 */

			$rootScope.$on('post_comment', function(e, name, comment, callback) {
				console.log('[postsCtrl] post_comment event listener.');
				postComment($scope, $rootScope, $mdToast, commentService, name, comment, callback);
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

redditPlusControllers.controller('rpCommentsCtrl', 
		[
			'$scope', 
			'$rootScope', 
			'$routeParams', 
			'$mdDialog', 
			'commentsService',
			'rpSaveUtilService',
			'rpUpvoteUtilService',
			'rpDownvoteUtilService',
	
	function($scope, $rootScope, $routeParams, $mdDialog, commentsService, 
		voteService, saveService, unsaveService, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService) {
		

		$scope.subreddit = $scope.post ? $scope.post.data.subreddit : $routeParams.subreddit;
		$scope.article = $scope.post ? $scope.post.data.id : $routeParams.article;
		var sort = 'confidence';

		$scope.comment = $routeParams.comment;
		var context = $routeParams.context || 0;

		if ($scope.post)
			$scope.threadLoading = true;
		else
			$rootScope.$emit('progressLoading');

		commentsService.query({

			subreddit: $scope.subreddit, 
			article: $scope.article,
			sort: sort,
			comment: $scope.comment,
			context: context

		}, function(data) {

			$scope.post = $scope.post || data[0].data.children[0];
			$scope.comments = data[1].data.children;
			

			if ($scope.threadLoading)
				$scope.threadLoading = false;
			else
				$rootScope.$emit('progressComplete');

		});

		$rootScope.$on('comments_sort', function(e, sort) {
			
			$scope.threadLoading = true;

			commentsService.query({

				subreddit: $scope.subreddit, 
				article: $scope.article,
				sort: sort,
				comment: $scope.comment,
				context: context

			}, function(data) {

				$scope.post = $scope.post || data[0];
				$scope.comments = data[1].data.children;
			
				$scope.threadLoading = false;

			});		

		});

		$scope.closeDialog = function() {
			$mdDialog.hide();
		};

		$scope.commentsUpvotePost = function() {
			
			rpUpvoteUtilService($scope.post);

		};

		$scope.commentsDownvotePost = function() {
			
			rpDownvoteUtilService($scope.post);

		};

		$scope.commentsSavePost = function() {
			
			rpSaveUtilService($scope.post);

		};

	}

]);

redditPlusControllers.controller('commentCtrl', ['$scope', '$rootScope', '$element', '$compile', 'moreChildrenService',
	'rpSaveUtilService', 'rpUpvoteUtilService', 'rpDownvoteUtilService',
	function($scope, $rootScope, $element, $compile, moreChildrenService, rpSaveUtilService, rpUpvoteUtilService, rpDownvoteUtilService) {

		$scope.childDepth = 1;

		if ($scope.comment.data.replies) {
			$scope.childDepth = $scope.depth + 1;
		}

		$scope.showReply = false;

		$scope.showMore = function() {
			$scope.loadingMoreChildren = true;
			moreChildrenService.query({
				sort: $scope.sort,
				link_id: $scope.post.data.name,
				children: $scope.comment.data.children.join(",")
			}, function(data) {
				$scope.loadingMoreChildren = false;
				$scope.moreChildren = data.json.data.things;
				$compile("<rp-comment ng-repeat='comment in moreChildren' " + 
					"comment='comment' depth='depth' post='post' sort='sort'></rp-comment>")
					($scope, function(cloned, scope) {
						$element.replaceWith(cloned);
					});				
			});
		};

		$scope.toggleReply = function() {
			$scope.showReply = !$scope.showReply;
		};

		$scope.savePost = function() {
			rpSaveUtilService($scope.comment);
		};
		7		
		$scope.upvotePost = function() {
			rpUpvoteUtilService($scope.comment);
		};

		$scope.downvotePost = function() {
			rpDownvoteUtilService($scope.comment);
		};



	}
]);


redditPlusControllers.controller('rpPostReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {


		$scope.postReply = function(name, comment) {

			console.log('[rpPostReplyCtrl]');
			
			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();

			});

		};
	}
]);

redditPlusControllers.controller('rpCommentsReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {


		$scope.postCommentsReply = function(name, comment) {

			console.log('[rpCommentsReplyCtrl]');


			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();

				$scope.$parent.comments.unshift(data.json.data.things[0]);


			});


		};
	}
]);

redditPlusControllers.controller('rpCommentReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {


		$scope.postCommentReply = function(name, comment) {

			console.log('[rpCommentReplyCtrl]');
			
			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();


				if ($scope.$parent.showReply) {

					$scope.$parent.toggleReply();

				}

				/*
					Add the comment to the thread.					
				 */
				if (!$scope.$parent.comment.data.replies) {
					

					$scope.$parent.childDepth = $scope.$parent.depth + 1;

					$scope.$parent.comment.data.replies = {
						
						data: {
							children: data.json.data.things
						}

					};

				} else {

					$scope.$parent.comment.data.replies.data.children.unshift(data.json.data.things[0]);
					
				}

			});

		};
	}
]);


redditPlusControllers.controller('commentsSortCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		
		$scope.selectedIndex = 0;
		$scope.sort = 'confidence';

		$scope.commentsSort = function(sort){

			$rootScope.$emit('comments_sort', sort);

			switch(sort) {
				case 'confidence':
					$scope.selectedIndex = 0;
					$scope.sort = 'confidence';
					break;
				case 'top':
					$scope.selectedIndex = 1;
					$scope.sort = 'top';
					break;
				case 'new':
					$scope.selectedIndex = 2;
					$scope.sort = 'new';
					break;
				case 'hot':
					$scope.selectedIndex = 3;
					$scope.sort = 'hot';
					break;
				case 'controversial':
					$scope.selectedIndex = 4;
					$scope.sort = 'controversial';
					break;
				case 'old':
					$scope.selectedIndex = 5;
					$scope.sort = 'old';
					break;
				default:
					$scope.selectedIndex = 0;
					$scope.sort = 'confidence';
					break;
			}
		};
	}
]);

redditPlusControllers.controller('rpCommentsDialogCtrl', ['$scope', 'post',
	function($scope, post) {

		$scope.post = post;

	}
]);

/*
	Determine the type of the media link
 */

redditPlusControllers.controller('commentMediaCtrl', ['$scope', '$element',
	function($scope, $element) {
		$scope.redditLink = false;
		if ($scope.href.indexOf('/r/') === 0) {
		 	$scope.redditLink = true;
		}
	}
]);

/*
	Sidenav Subreddits Controller
	Gets popular subreddits.
 */
redditPlusControllers.controller('subredditsCtrl', ['$scope', 'subredditsService',
	function($scope, subredditsService){
		$scope.subs = subredditsService.query();
	}
]);


// redditPlusControllers.controller('progressCtrl', ['$scope', '$rootScope', '$log', '$timeout',
//   function($scope, $rootScope, $log, $timeout){
// 	$scope.value = 0.2;
// 	$scope.loading = true;
// 	var incTimeout = 0;
//
// 	$rootScope.$on('progressLoading', function(e, d){
// 	  // $log.log('progressLoading');
// 	  $scope.loading = true;
// 	  set(20);
// 	});
// 	$rootScope.$on('progressComplete', function(e,d){
// 	  // $log.log('progressComplete');
// 	  set(100);
// 	  $timeout(function(){
// 		$scope.loading = false;
// 	  }, 600);
// 	});
// 	$rootScope.$on('progress', function(e, d){
// 	  // $log.log('progress: ' + d.value);
// 	  set(d.value);
// 	});
//
// 	function set(n) {
// 	  if ($scope.loading === false) return;
// 	  $scope.value = n;
//
// 	  $timeout.cancel(incTimeout);
// 	  incTimeout = $timeout(function(){
// 		inc();
// 	  }, 750);
// 	}
//
//
// 	function inc() {
// 	  var rnd = 0;
// 		// TODO: do this mathmatically instead of through conditions
// 		var stat = $scope.value/100;
// 		if (stat >= 0 && stat < 0.25) {
// 		  // Start out between 3 - 6% increments
// 		  rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
// 		} else if (stat >= 0.25 && stat < 0.65) {
// 		  // increment between 0 - 3%
// 		  rnd = (Math.random() * 3) / 100;
// 		} else if (stat >= 0.65 && stat < 0.9) {
// 		  // increment between 0 - 2%
// 		  rnd = (Math.random() * 2) / 100;
// 		} else if (stat >= 0.9 && stat < 0.99) {
// 		  // finally, increment it .5 %
// 		  rnd = 0.005;
// 		} else {
// 		  // after 99%, don't increment:
// 		  rnd = 0;
// 		}
// 		// $log.log("RANDOM INC: " + rnd*1000);
// 		$scope.value += rnd*500;
// 	}
//   }
// ]);
