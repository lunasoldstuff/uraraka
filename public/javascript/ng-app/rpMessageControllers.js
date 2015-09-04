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
		'rpSearchFormUtilService',
		'rpSearchFilterButtonUtilService',
		'rpToolbarShadowUtilService',

	function(
			$scope,
			$rootScope,
			$routeParams,
			$location,
			rpMessageUtilService,
			rpIdentityUtilService,
			rpMessageTabUtilService,
			rpTitleChangeService,
			rpPostFilterButtonUtilService,
			rpUserFilterButtonUtilService,
			rpUserSortButtonUtilService,
			rpSubscribeButtonUtilService,
			rpSearchFormUtilService,
			rpSearchFilterButtonUtilService,
			rpToolbarShadowUtilService
		) {

		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpSearchFormUtilService.hide();
		rpSearchFilterButtonUtilService.hide();
		rpToolbarShadowUtilService.hide();

		var loadingMore = false;
		var haveAll = false;
		
		var where = $routeParams.where || 'inbox';

		console.log('[rpMessageCtrl] where: ' + where);
		rpMessageTabUtilService.setTab(where);

		rpTitleChangeService.prepTitleChange('Messages');

		$scope.havePosts = false;

		rpIdentityUtilService.getIdentity(function(data) {
			$scope.identity = data;
		});

		$rootScope.$emit('progressLoading');

		rpMessageUtilService(where, '', function(data) {

			haveAll = data.length < 25;

			$scope.messages = data;

			$scope.havePosts = true;
			$rootScope.$emit('progressComplete');

		});

		var deregisterMessageTabClick = $rootScope.$on('message_tab_click', function(e, tab) {
			console.log('[rpMessageCtrl] message_tab_click');
			$scope.messages = {};

			where = tab;
			$location.path('/message/' + where, false).search('').replace();
			
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

		$scope.$on('$destroy', function() {
			deregisterMessageTabClick();
		});

	}
]);

rpMessageControllers.controller('rpMessageCommentCtrl', ['$scope', '$filter', '$mdDialog', 'rpIdentityUtilService', 
	'rpUpvoteUtilService', 'rpDownvoteUtilService', 'rpByIdService',
	function($scope, $filter, $mdDialog, rpIdentityUtilService, rpUpvoteUtilService, rpDownvoteUtilService, rpByIdService) {

		rpIdentityUtilService.getIdentity(function(data) {
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

		var deregisterMessageTabChange = $rootScope.$on('message_tab_change', function(e){
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

		$scope.$on('$destroy', function() {
			deregisterMessageTabChange();
		});
	}
]);

rpMessageControllers.controller('rpMessageSidenavCtrl', ['$scope', '$rootScope', '$mdDialog', 'rpSettingsUtilService', 'rpLocationUtilService',
	function($scope, $rootScope, $mdDialog, rpSettingsUtilService, rpLocationUtilService) {

		$scope.composeDialog = rpSettingsUtilService.settings.composeDialog;
		console.log('[rpMessageSidenavCtrl] $scope.composeDialog: ' + $scope.composeDialog);

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function(data) {
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
					locals: {
						shareLink: null
					}

				});
			
			} else {
				rpLocationUtilService(e, '/message/compose', '', true, false);
			}

		};

		$scope.showInbox = function(e) {
			rpLocationUtilService(e, '/message/inbox', '', true, false);
		};

		$scope.showSent = function(e) {
			rpLocationUtilService(e, '/message/sent', '', true, false);
		};

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
		});

	}
]);

rpMessageControllers.controller('rpMessageComposeCtrl', ['$scope', function ($scope) {
	
}]);

rpMessageControllers.controller('rpMessageComposeDialogCtrl', ['$scope', '$location', '$mdDialog', 'shareLink', 'shareTitle',
	function($scope, $location, $mdDialog, shareLink, shareTitle) {
		
		console.log('[rpMessageComposeDialogCtrl] shareLink: ' + shareLink);
		$scope.shareLink = shareLink || null;
		$scope.shareTitle = shareTitle || null;

		if (shareLink !== null) {
			$scope.title = "Share a link with a reddit user";

		} else {
			$scope.title = "Send a message";

		}

		$scope.dialog = true;

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

		$scope.$on('$destroy', function() {
			deregisterLocationChangeSuccess();
		});

	}
]);

rpMessageControllers.controller('rpMessageComposeFormCtrl', ['$scope', '$rootScope', '$mdDialog', 'rpMessageComposeUtilService', 'rpLocationUtilService',
	function($scope, $rootScope, $mdDialog, rpMessageComposeUtilService, rpLocationUtilService) {

		$scope.messageSending = false;
		$scope.showSend = true;	
		// $scope.iden = "";
		// 
		console.log('[rpMessageComposeFormCtrl] $scope.shareLink: ' + $scope.shareLink);

		if ($scope.shareLink !== null) {
			$scope.text = 'Check this out, [' + $scope.shareTitle +'](' + $scope.shareLink + ')';
		}

		$scope.closeDialog = function(e) {
			
			if ($scope.dialog) {
				console.log('[rpMessageComposeFormCtrl] closeDialog: Dialog.');
				clearForm();
				$mdDialog.hide();
			} else {
				console.log('[rpMessageComposeFormCtrl] closeDialog: Window.');
				rpLocationUtilService(e, '/', '', true, false);
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