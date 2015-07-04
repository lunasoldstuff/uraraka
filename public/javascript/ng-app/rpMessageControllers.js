'use strict';

var rpMessageControllers = angular.module('rpMessageControllers', []);

rpMessageControllers.controller('rpMessageCtrl', 
	[
		'$scope', 
		'$rootScope', 
		'$routeParams', 
		'$location',
		'rpMessageUtilService', 
		'rpIdentityUtilService',
		'rpMessageTabUtilService',
		'rpTitleChangeService',
		'rpPostFilterButtonUtilService',
		'rpUserFilterButtonUtilService',
		'rpUserSortButtonUtilService',
		'rpSubscribeButtonUtilService',

	function($scope, $rootScope, $routeParams, $location, rpMessageUtilService, rpIdentityUtilService, 
		rpMessageTabUtilService, rpTitleChangeService, rpPostFilterButtonUtilService, rpUserFilterButtonUtilService, 
		rpUserSortButtonUtilService, rpSubscribeButtonUtilService) {

		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();


		var loadingMore = false;
		var haveAll = false;
		
		var where = $routeParams.where || 'inbox';

		console.log('[rpMessageCtrl] where: ' + where);
		rpMessageTabUtilService.setTab(where);

		rpTitleChangeService.prepTitleChange('Messages');

		$scope.havePosts = false;

		rpIdentityUtilService(function(data) {
			$scope.identity = data;
		});

		$rootScope.$emit('progressLoading');

		rpMessageUtilService(where, '', function(data) {

			haveAll = data.length < 25;

			$scope.messages = data;

			$scope.havePosts = true;
			$rootScope.$emit('progressComplete');

		});

		$rootScope.$on('message_tab_click', function(e, tab) {
			console.log('[rpMessageCtrl] message_tab_click');

			where = tab;
			$location.path('/message/' + where, false).replace();
			
			$scope.havePosts = false;

			$rootScope.$emit('progressLoading');
			
			rpMessageUtilService(tab, '', function(data) {
				
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

					rpMessageUtilService(where, lastMessageName, function(data) {
						
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

		var firstLoadOver = false;

		$scope.tabClick = function(tab) {
			console.log('[rpMessageTabsCtrl] tabClick()');
			
			if (firstLoadOver) {
				$rootScope.$emit('message_tab_click', tab);
				rpMessageTabUtilService.setTab(tab);
				
			} else {
				firstLoadOver = true;
			}
		};

		$rootScope.$on('message_tab_change', function(e){
			console.log('[rpMessageTabsCtrl] message_tab_change');
			selectTab();
		});

		function selectTab() {
			console.log('[rpMessageTabsCtrl] selectTab()');
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

rpMessageControllers.controller('rpMessageSidenavCtrl', ['$scope', '$rootScope', '$location', '$mdDialog', 'rpSettingsUtilService',
	function($scope, $rootScope, $location, $mdDialog, rpSettingsUtilService) {

		$scope.composeDialog = rpSettingsUtilService.settings.composeDialog;
		console.log('[rpMessageSidenavCtrl] $scope.composeDialog: ' + $scope.composeDialog);

		$rootScope.$on('settings_changed', function(data) {
			$scope.composeDialog = rpSettingsUtilService.settings.composeDialog;
			console.log('[rpMessageSidenavCtrl] $scope.composeDialog: ' + $scope.composeDialog);
		});

		$scope.showCompose = function(e) {

			if ($scope.composeDialog) {

				$mdDialog.show({
					controller: 'rpMessageComposeDialogCtrl',
					templateUrl: 'partials/rpMessageComposeDialog',
					targetEvent: e,
					clickOutsideToClose: false,
					escapeToClose: false,

				});
			
			} else {
				$location.path('/message/compose');
			}

		};

		$scope.showInbox = function(e) {
			$location.path('/message/inbox', true);
		};

	}
]);

rpMessageControllers.controller('rpMessageComposeCtrl', ['$scope', function ($scope) {
	
}]);

rpMessageControllers.controller('rpMessageComposeDialogCtrl', ['$scope', '$location', '$mdDialog',
	function($scope, $location, $mdDialog) {
		
		$scope.dialog = true;

		//Close the dialog if user navigates to a new page.
		$scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

	}
]);

rpMessageControllers.controller('rpMessageComposeFormCtrl', ['$scope', '$rootScope', '$location', '$mdDialog', 'rpMessageComposeUtilService', 
	function($scope, $rootScope, $location, $mdDialog, rpMessageComposeUtilService) {

		$scope.messageSending = false;
		$scope.showSend = true;	
		// $scope.iden = "";

		$scope.closeDialog = function() {
			
			if ($scope.dialog) {
				console.log('[rpMessageComposeFormCtrl] closeDialog: Dialog.');
				clearForm();
				$mdDialog.hide();
			} else {
				console.log('[rpMessageComposeFormCtrl] closeDialog: Window.');
				$location.path('/', true);
			}

		};

		$scope.sendMessage = function() {

			console.log('[rpMessageComposeFormCtrl] sendMessage(), $scope.iden: ' + $scope.iden);
			console.log('[rpMessageComposeFormCtrl] sendMessage(), $scope.captcha: ' + $scope.captcha);

			$scope.messageSending = true;

			rpMessageComposeUtilService($scope.subject, $scope.text, $scope.to, $scope.iden, $scope.captcha, function(data) {

				$scope.messageSending = false;

				if (data.json.errors.length > 0) {

					if (data.json.errors[0][0] === 'BAD_CAPTCHA') {
						$rootScope.$emit('reset_captcha');					
						
						$scope.feedbackMessage = "You entered the CAPTCHA incorrectly. Please try again.";
					
						$scope.showFeedbackAlert = true;
						$scope.showFeedback = true;
					
						$scope.showButtons = true;
					}

					else {
						$rootScope.$emit('reset_captcha');
						$scope.feedbackMessage = data.json.errors[0][1];
						$scope.showFeedbackAlert = true;
						$scope.showFeedback = true;
					}

				} else {
					$scope.feedbackMessage = "Your message was sent successfully :)";
					$scope.showFeedbackAlert = false;
					$scope.showFeedback = true;
					$scope.showSendAnother = true;
					$scope.showSend = false;
				}

			});

		};

		$scope.sendAnother = function() {
			clearForm();
			$rootScope.$emit('reset_captcha');
			$scope.showFeedback = false;
			$scope.showSendAnother = false;
			$scope.showSend = true;
		};

		function clearForm() {
			$scope.subject = "";
			$scope.text = "";
			$scope.to = "";

			$scope.rpMessageComposeForm.$setUntouched();			
		}

	}
]);