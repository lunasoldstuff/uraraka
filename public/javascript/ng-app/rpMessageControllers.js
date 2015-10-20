'use strict';

var rpMessageControllers = angular.module('rpMessageControllers', []);

rpMessageControllers.controller('rpMessageCtrl', 
	[
		'$scope', 
		'$rootScope', 
		'$routeParams', 
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
		'rpReadAllMessagesUtilService',
		'rpLocationUtilService',
		'rpSidebarButtonUtilService',

	function(
			$scope,
			$rootScope,
			$routeParams,
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
			rpToolbarShadowUtilService,
			rpReadAllMessagesUtilService,
			rpLocationUtilService,
			rpSidebarButtonUtilService
		) {

		rpPostFilterButtonUtilService.hide();
		rpSubscribeButtonUtilService.hide();
		rpUserFilterButtonUtilService.hide();
		rpUserSortButtonUtilService.hide();
		rpSearchFormUtilService.hide();
		rpSearchFilterButtonUtilService.hide();
		rpToolbarShadowUtilService.hide();
		rpSidebarButtonUtilService.hide();

		var loadingMore = false;
		$scope.havePosts = false;
		$scope.hasMail = false;
		$scope.noMorePosts = false;
		var limit = 25;
		
		/*
			Changing the tab delayed until we have checked identity
			for new messages. 
			Set to some arbitrary value 'nothing' to stop it showing the
			tab that we were previously on before navigating away from messages.
		 */
		rpMessageTabUtilService.setTab('nothing');
		

		rpTitleChangeService.prepTitleChange('Messages');

		var where = $routeParams.where || 'inbox';

		console.log('[rpMessageCtrl] where: ' + where);

		rpIdentityUtilService.reloadIdentity(function(data) {
			$scope.identity = data;
			$scope.hasMail = $scope.identity.has_mail;
			
			console.log('[rpMessageCtrl] $scope.identity: ' + JSON.stringify($scope.identity));
			console.log('[rpMessageCtrl] $scope.hasMail: ' + $scope.hasMail);

			if ($scope.hasMail && where === 'inbox') {
				where = 'unread';
				rpLocationUtilService(null, '/messages/' + where, '', false, true);
			}
			
			rpMessageTabUtilService.setTab(where);

		});

		$rootScope.$emit('progressLoading');

		rpMessageUtilService(where, '', limit, function(err, data) {
			$rootScope.$emit('progressComplete');

			if (err) {
				console.log('[rpMessageUtilService] err');
			} else {
				$scope.noMorePosts = data.get.data.children.length < limit;

				$scope.messages = data.get.data.children;

				// console.log('[rpMessageUtilService] data.get.data.children[0]: ' + JSON.stringify(data.get.data.children[0]));

				$scope.havePosts = true;

				//if viewing unread messages set them to read.
				if (where === "unread") {
					rpReadAllMessagesUtilService(function(err, data) {

						if (err) {
							console.log('[rpMessageCtrl] err');
						} else {
							console.log('[rpMessageCtrl] all messages read.');
							$scope.hasMail = false;
							
						}
					});
				}

			}


		});

		var deregisterMessageTabClick = $rootScope.$on('message_tab_click', function(e, tab) {
			console.log('[rpMessageCtrl] message_tab_click, tab: ' + tab);
			$scope.messages = {};
			$scope.noMorePosts = false;

			where = tab;
			rpLocationUtilService(null, '/message/' + where, '', false, false);
			
			$scope.havePosts = false;

			$rootScope.$emit('progressLoading');
			
			rpMessageUtilService(tab, '', limit, function(err, data) {

				$rootScope.$emit('progressComplete');
				if (err) {
					console.log('[rpMessageUtilService] err');
				} else {
					$scope.noMorePosts = data.get.data.children.length < limit;
					$scope.messages = data.get.data.children;

					$scope.havePosts = true;

				}
			});
		});

		$scope.morePosts = function() {

			console.log('[rpMessageCtrl] morePosts()');

			if ($scope.messages && $scope.messages.length > 0) {

				var lastMessageName = $scope.messages[$scope.messages.length-1].data.name;

				if (lastMessageName && !loadingMore) {
					loadingMore = true;
					$rootScope.$emit('progressLoading');

					rpMessageUtilService(where, lastMessageName, limit, function(err, data) {
						$rootScope.$emit('progressComplete');
						
						if (err) {
							console.log('[rpMessageUtilService] err');
						} else {
							// console.log('[rpMessageCtrl] data: ' + JSON.stringify(data));
							$scope.noMorePosts = data.get.data.children.length < 25;

							Array.prototype.push.apply($scope.messages, data.get.data.children);
							loadingMore = false;

						}
						
					});
				}
			}
		};

		$scope.$on('$destroy', function() {
			console.log('[rpMessageCtrl] $destroy()');
			deregisterMessageTabClick();
		});

	}
]);

rpMessageControllers.controller('rpMessageCommentCtrl', ['$scope', '$filter', '$mdDialog', 'rpIdentityUtilService', 
	'rpUpvoteUtilService', 'rpDownvoteUtilService', 'rpByIdUtilService',
	function($scope, $filter, $mdDialog, rpIdentityUtilService, rpUpvoteUtilService, rpDownvoteUtilService, rpByIdUtilService) {

		// rpIdentityUtilService.getIdentity(function(data) {
		// 	$scope.identity = data;
		// });

		$scope.childDepth = $scope.depth + 1;

		$scope.showReply = false;

		$scope.toggleReply = function() {
			$scope.showReply = !$scope.showReply;
		};

		$scope.upvotePost = function(message) {

			rpUpvoteUtilService(message, function(err, data) {

				if (err) {

				} else {
					
				}

			});

		};
		
		$scope.downvotePost = function(message) {
			
			rpDownvoteUtilService(message, function(err, data) {

				if (err) {

				} else {
					
				}

			});

		};

		$scope.showComments = function(e, message) {

			var id = $filter('rp_link_id')(message.data.context);

			rpByIdUtilService('t3_' + id, function(err, data) {
				
				if (err) {
					console.log('[rpMessageCtrl] showComments(), err getting comment info');
				} else {
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
					
				}

			});
		};

	}
]);

rpMessageControllers.controller('rpMessageCommentReplyFormCtrl', ['$scope', 'rpCommentUtilService', 
	function($scope, rpCommentUtilService) {

		$scope.postCommentReply = function(name, comment, index) {

			rpCommentUtilService(name, comment, function(err, data) {

				if (err) {
					console.log('[rpMessageCommentReplyFormCtrl] err');

				} else {
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
					
				}


			});

		};
	}
]);

rpMessageControllers.controller('rpDirectMessageReplyCtrl', ['$scope', 'rpCommentUtilService',
	function($scope, rpCommentUtilService) {

		$scope.postDirectMessageReply = function(name, comment) {

			rpCommentUtilService(name, comment, function(err, data) {

				if (err) {
					console.log('[rpDirectMessageReplyCtrl] err');
				} else {
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

		var composeDialog = rpSettingsUtilService.settings.composeDialog;
		console.log('[rpMessageSidenavCtrl] composeDialog: ' + composeDialog);

		var deregisterSettingsChanged = $rootScope.$on('settings_changed', function(data) {
			composeDialog = rpSettingsUtilService.settings.composeDialog;
			console.log('[rpMessageSidenavCtrl] composeDialog: ' + composeDialog);
		});

		$scope.showCompose = function(e) {

			if (composeDialog) {

				$mdDialog.show({
					controller: 'rpMessageComposeDialogCtrl',
					templateUrl: 'partials/rpMessageComposeDialog',
					targetEvent: e,
					clickOutsideToClose: false,
					escapeToClose: false,
					locals: {
						shareLink: null,
						shareTitle: null
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

		if ($scope.shareLink !== null && $scope.shareLink !== undefined) {
			$scope.title = "Share a link with a reddit user";
		} else {
			$scope.title = "Send a message";
		}
	
}]);

rpMessageControllers.controller('rpMessageComposeDialogCtrl', ['$scope', '$location', '$mdDialog', 'shareLink', 'shareTitle',
	function($scope, $location, $mdDialog, shareLink, shareTitle) {
		
		console.log('[rpMessageComposeDialogCtrl] shareLink: ' + shareLink);
		$scope.shareLink = shareLink || null;
		$scope.shareTitle = shareTitle || null;

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

		if ($scope.shareLink !== null && $scope.shareLink !== undefined) {
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

			rpMessageComposeUtilService($scope.subject, $scope.text, $scope.to, $scope.iden, $scope.captcha, function(err, data) {
				$scope.messageSending = false;

				if (err) {
					console.log('[rpMessageComposeFormCtrl] err');
						
					if (err.json.errors[0][0] === 'BAD_CAPTCHA') {
						$rootScope.$emit('reset_captcha');					
						
						$scope.feedbackMessage = "You entered the CAPTCHA incorrectly. Please try again.";
					
						$scope.showFeedbackAlert = true;
						$scope.showFeedback = true;
					
						$scope.showButtons = true;
					}

					else {
						$rootScope.$emit('reset_captcha');
						$scope.feedbackMessage = err.json.errors[0][1];
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