'use strict';

var rpMessageControllers = angular.module('rpMessageControllers', []);

rpMessageControllers.controller('rpMessageCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', '$mdDialog', 'rpMessageService', 'rpUpvoteUtilService', 'rpDownvoteUtilService', 'rpByIdService',
	function($scope, $rootScope, $routeParams, $filter, $mdDialog, rpMessageService, rpUpvoteUtilService, rpDownvoteUtilService, rpByIdService) {

		var loadingMore = false;
		var where = $routeParams.where || 'inbox';
		$scope.havePosts = false;
		$scope.showReply =- false;

		$rootScope.$emit('progressLoading');
		rpMessageService.query({where: where}, function(data) {

			$scope.messages = data;

			$scope.havePosts = true;
			$rootScope.$emit('progressComplete');
			// console.log('[rpMessageCtrl] data: ' + JSON.stringify(data));

		});

		$scope.morePosts = function() {

			if ($scope.messages && $scope.messages.length > 0) {

				var lastMessageName = $scope.messages[$scope.messages.length-1].data.name;

				if (lastMessageName && !loadingMore) {
					loadingMore = true;
					$rootScope.$emit('progressLoading');

					rpMessageService.query({where: where, after: lastMessageName}, function(data) {
						Array.prototype.push.apply($scope.messages, data);
						$rootScope.$emit('progressComplete');
						loadingMore = false;
					});
				}
			}
		};

		$rootScope.$on('message_tab_click', function(e, tab) {
			where = tab;
			$scope.havePosts = false;
			
			$rootScope.$emit('message_tab_change', tab);
			$rootScope.$emit('progressLoading');
			
			rpMessageService.query({where: tab}, function(data) {
				
				$rootScope.$emit('progressComplete');
				$scope.messages = data;

				$scope.havePosts = true;
			});
		});

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

				console.log(JSON.stringify("[rpMessageCommentReplyCtrl] reply data: " + JSON.stringify(data)));

				$scope.reply = "";
				$scope.rpPostReplyForm.$setUntouched();


				if ($scope.$parent.showReply) {

					$scope.$parent.toggleReply();

				}

				/*
					Add the comment to the thread.					
				 */
				
				 $scope.$parent.messages.splice(index+1, 0, data);

			});

		};
	}
]);


rpMessageControllers.controller('rpMessageTabsCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
	
	$scope.selectedIndex = 0;

		$rootScope.$on('message_tab_change', function(e, tab){
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
		});

		$scope.tabClick = function(tab) {
			$rootScope.$emit('message_tab_click', tab);
		};	
	}
]);