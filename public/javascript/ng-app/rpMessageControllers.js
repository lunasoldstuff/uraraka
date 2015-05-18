'use strict';

var rpMessageControllers = angular.module('rpMessageControllers', []);

rpMessageControllers.controller('rpMessageCtrl', 
	[
		'$scope', 
		'$rootScope', 
		'$routeParams', 
		'$location',
		'rpMessageService', 
		'rpIdentityUtilService',
		'rpMessageTabUtilService',
		'rpTitleChangeService',
		'rpPostFilterButtonUtilService',

	function($scope, $rootScope, $routeParams, $location, rpMessageService, 
		rpIdentityUtilService, rpMessageTabUtilService, rpTitleChangeService, rpPostFilterButtonUtilService) {

		rpPostFilterButtonUtilService.hide();


		var loadingMore = false;
		var haveAll = false;
		
		var where = $routeParams.where || 'inbox';

		rpMessageTabUtilService.setTab(where);

		rpTitleChangeService.prepTitleChange('Messages');

		$scope.havePosts = false;

		rpIdentityUtilService(function(data) {
			$scope.identity = data;
		});

		$rootScope.$emit('progressLoading');
		rpMessageService.query({where: where}, function(data) {

			haveAll = data.length < 25;

			$scope.messages = data;

			$scope.havePosts = true;
			$rootScope.$emit('progressComplete');

		});

		$rootScope.$on('message_tab_click', function(e, tab) {

			where = tab;
			$location.path('/message/' + where, false);
			
			$scope.havePosts = false;

			$rootScope.$emit('progressLoading');
			rpMessageService.query({where: tab}, function(data) {
				
				haveAll = data.length < 25;
				
				$rootScope.$emit('progressComplete');
				$scope.messages = data;

				$scope.havePosts = true;
			});
		});

		$scope.morePosts = function() {

			if ($scope.messages && $scope.messages.length > 0) {

				var lastMessageName = $scope.messages[$scope.messages.length-1].data.name;

				if (lastMessageName && !loadingMore && !haveAll) {
					loadingMore = true;
					$rootScope.$emit('progressLoading');

					rpMessageService.query({where: where, after: lastMessageName}, function(data) {
						
						// console.log('[rpMessageCtrl] data: ' + JSON.stringify(data));
						
						haveAll = data.length < 25;

						Array.prototype.push.apply($scope.messages, data);
						$rootScope.$emit('progressComplete');
						loadingMore = false;
					});
				}
			}
		};		


	}
]);

rpMessageControllers.controller('rpMessageCommentCtrl', ['$scope', '$filter', '$mdDialog', 'rpIdentityUtilService', 
	'rpUpvoteUtilService', 'rpDownvoteUtilService', 'rpByIdService',
	function($scope, $filter, $mdDialog, rpIdentityUtilService, rpUpvoteUtilService, rpDownvoteUtilService, rpByIdService) {

		rpIdentityUtilService(function(data) {
			$scope.identity = data;
		});

		$scope.childDepth = $scope.depth + 1;

		$scope.showReply = false;

		$scope.toggleReply = function() {
			$scope.showReply = !$scope.showReply;
		};

		$scope.upvotePost = function(message) {

			rpUpvoteUtilService(message);

		};
		
		$scope.downvotePost = function(message) {
			
			rpDownvoteUtilService(message);

		};

		$scope.showComments = function(e, message) {

			var id = $filter('rp_link_id')(message.data.context);

			rpByIdService.query({
				name:  't3_' + id
			}, function(data) {
				
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
			});
		};

	}
]);

rpMessageControllers.controller('rpMessageCommentReplyCtrl', ['$scope', 'rpPostCommentUtilService', 
	function($scope, rpPostCommentUtilService) {

		$scope.postCommentReply = function(name, comment, index) {

			rpPostCommentUtilService(name, comment, function(data) {

				// console.log("[rpMessageCommentReplyCtrl] reply data: " + JSON.stringify(data));

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();


				if ($scope.$parent.showReply) {

					$scope.$parent.toggleReply();

				}

				/*
					Add the comment to the thread.					
				 */
				
				$scope.$parent.$parent.comments = data.json.data.things;

			});

		};
	}
]);

rpMessageControllers.controller('rpDirectMessageReplyCtrl', ['$scope', 'rpPostCommentUtilService',
	function($scope, rpPostCommentUtilService) {

		$scope.postDirectMessageReply = function(name, comment) {

			rpPostCommentUtilService(name, comment, function(data) {

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();


				if ($scope.$parent.showReply) {

					$scope.$parent.toggleReply();

				}

				if (!$scope.message.data.replies) {

					$scope.message.data.replies = {
						data: {
							children: data.json.data.things
						}
					};

				} else {
					$scope.message.data.replies.data.children.push(data.json.data.things[0]);
				}

				


			});

		};

	}
]);

rpMessageControllers.controller('rpMessageTabsCtrl', ['$scope', '$rootScope', 'rpMessageTabUtilService',
	function($scope, $rootScope, rpMessageTabUtilService) {
	
		selectTab();

		$rootScope.$on('message_tab_change', function(e){
			selectTab();
		});

		$scope.tabClick = function(tab) {
			$rootScope.$emit('message_tab_click', tab);
			rpMessageTabUtilService.setTab(tab);
		};

		function selectTab() {
		
			var tab = rpMessageTabUtilService.tab;

			switch(tab) {
				case 'inbox':
					$scope.selectedIndex = 0;
					break;
				case 'unread':
					$scope.selectedIndex = 1;
					break;
				case 'messages':
					$scope.selectedIndex = 2;
					break;
				case 'comments':
					$scope.selectedIndex = 3;
					break;
				case 'selfreply':
					$scope.selectedIndex = 4;
					break;
				case 'mentions':
					$scope.selectedIndex = 5;
					break;
				default:
					$scope.selectedIndex = 0;
					break;
			}
		}
	}
]);