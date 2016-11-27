'use strict';

var rpMessageControllers = angular.module('rpMessageControllers', []);

rpMessageControllers.controller('rpMessageCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$timeout',
	'rpMessageUtilService',
	'rpIdentityUtilService',
	'rpTitleChangeUtilService',
	'rpToolbarShadowUtilService',
	'rpReadAllMessagesUtilService',
	'rpLocationUtilService',
	'rpSettingsUtilService',
	'rpReadMessageUtilService',

	function(
		$scope,
		$rootScope,
		$routeParams,
		$timeout,
		rpMessageUtilService,
		rpIdentityUtilService,
		rpTitleChangeUtilService,
		rpToolbarShadowUtilService,
		rpReadAllMessagesUtilService,
		rpLocationUtilService,
		rpSettingsUtilService,
		rpReadMessageUtilService

	) {

		/*
			UI Stuff
		 */
		$rootScope.$emit('rp_hide_all_buttons');
		$rootScope.$emit('rp_button_visibility', 'showMessageWhere', true);

		var loadingMore = false;

		$scope.noMorePosts = false;
		var limit = 25;

		/*
			Changing the tab delayed until we have checked identity
			for new messages.
			Set to some arbitrary value 'nothing' to stop it showing the
			tab that we were previously on before navigating away from messages.
		 */

		rpTitleChangeUtilService('Messages', true, true);

		var where = $routeParams.where || 'inbox';

		var tabs = [{
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
			}

		];

		$rootScope.$emit('rp_tabs_changed', tabs);

		console.log('[rpMessageCtrl] where: ' + where);

		$rootScope.$emit('rp_progress_start');

		rpIdentityUtilService.reloadIdentity(function(data) {
			$scope.identity = data;
			$scope.hasMail = $scope.identity.has_mail;

			console.log('[rpMessageCtrl] $scope.identity: ' + JSON.stringify($scope.identity));
			console.log('[rpMessageCtrl] $scope.hasMail: ' + $scope.hasMail);

			if ($scope.hasMail && where !== 'unread') {
				where = 'unread';
				rpLocationUtilService(null, '/message/' + where, '', true, true);
			}

			console.log('[rpMessageCtrl] where: ' + where);

			$rootScope.$emit('rp_init_select');


			// for (var i = 0; i < tabs.length; i++) {
			// 	if (where === tabs[i].value) {
			// 		$rootScope.$emit('rp_tabs_selected_index_changed', i);
			// 		break;
			// 	}
			// }

			loadPosts();

		});


		/**
		 * EVENT HANDLERS
		 */
		var deregisterMessageWhereClick = $rootScope.$on('rp_message_where_click', function(e, tab) {
			console.log('[rpMessageCtrl] on rp_message_where_click, tab: ' + tab);

			where = tab;
			rpLocationUtilService(null, '/message/' + where, '', false, false);
			loadPosts();


		});

		var deregisterRefresh = $rootScope.$on('rp_refresh', function() {
			console.log('[rpMessageCtrl] rp_refresh');
			$rootScope.$emit('rp_refresh_button_spin', true);
			loadPosts();
		});

		/**
		 * CONTROLLER API
		 */

		$scope.thisController = this;

		/**
		 * SCOPE FUNCTIONS
		 * */

		$scope.morePosts = function() {

			console.log('[rpMessageCtrl] morePosts()');

			if ($scope.messages && $scope.messages.length > 0) {

				var lastMessageName = $scope.messages[$scope.messages.length - 1].data.name;

				if (lastMessageName && !loadingMore) {
					loadingMore = true;
					$rootScope.$emit('rp_progress_start');

					rpMessageUtilService(where, lastMessageName, limit, function(err, data) {
						$rootScope.$emit('rp_progress_stop');

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

		function loadPosts() {
			$scope.messages = [];
			$scope.havePosts = false;
			$scope.hasMail = false;
			$scope.noMorePosts = false;
			$rootScope.$emit('rp_progress_start');


			rpMessageUtilService(where, '', limit, function(err, data) {
				$rootScope.$emit('rp_progress_stop');
				console.log('[rpMessageCtrl] received message data, data.get.data.children.length: ' + data.get.data.children.length);

				if (err) {
					console.log('[rpMessageUtilService] err');
				} else {
					$scope.noMorePosts = data.get.data.children.length < limit;

					/*
					Add the messages
					 */
					if (data.get.data.children.length > 0) {
						$scope.messages = data.get.data.children;

						//while this works, adding all at once is faster.
						// addMessages(data.get.data.children);

					}


					/*
					Not exactly sure why this is requred, but without it sometimes angular hangs
					and does not update the scope/view/ui with the new messages, until something like clicking
					a button or resizing the window jolts it back.
					the timeout below which I believe forces an apply to be called solves this problem.
					we also use it in the rpArticleCtrl when we add new comments.

					 */
					// $timeout(angular.noop, 0);

					$scope.havePosts = true;
					$rootScope.$emit('rp_button_visibility', 'showRefresh', true);
					$rootScope.$emit('rp_refresh_button_spin', false);

					//enable to have the where (current tab) added to the page title
					// rpTitleChangeUtilService(where, true, true);

					/*
					if viewing unread messages set them to read.
					*/
					if (where === "unread") {

						console.log('[rpMessageControllers] unread messages, set to read');

						var messageIdArray = [];

						for (var i = 0; i < $scope.messages.length; i++) {
							console.log('[rpMessageCtrl] read_message, $scope.messages[i].data.name: ' + $scope.messages[i].data.name);
							messageIdArray.push($scope.messages[i].data.name);
						}

						var message = messageIdArray.join(', ');

						console.log('[rpMessageCtrl] message: ' + message);

						rpReadMessageUtilService(message, function(data) {
							if (err) {
								console.log('[rpMessageCtrl] err');
							} else {
								console.log('[rpMessageCtrl] all messages read.');
								$scope.hasMail = false;
								$rootScope.$emit('rp_messages_read');
							}
						});

						// rpReadAllMessagesUtilService(function(err, data) {
						//
						// 	if (err) {
						// 		console.log('[rpMessageCtrl] err');
						// 	} else {
						// 		console.log('[rpMessageCtrl] all messages read.');
						// 		$scope.hasMail = false;
						// 		$rootScope.$emit('rp_messages_read');
						// 	}
						// });
					}

				}


			});
		}

		function addMessages(messages) {
			var message = messages.shift();

			$scope.messages.push(message);

			$timeout(function() {
				if (messages.length > 0) {
					addMessages(messages);
				}
			}, 200);

		}

		$scope.$on('$destroy', function() {
			console.log('[rpMessageCtrl] $destroy()');
			deregisterMessageWhereClick();
			deregisterRefresh();
			// $rootScope.$emit('rp_tabs_hide');

		});

	}
]);

rpMessageControllers.controller('rpMessageCommentCtrl', ['$scope', '$filter', '$mdDialog', 'rpIdentityUtilService',
	'rpLocationUtilService',
	function($scope, $filter, $mdDialog, rpIdentityUtilService, rpLocationUtilService) {

		if ($scope.identity) {
			console.log('[rpMessageCommentCtrl] $scope.identity.name: ' + $scope.identity.name);

		}


		// rpIdentityUtilService.getIdentity(function(data) {
		// 	$scope.identity = data;
		// });

		$scope.childDepth = $scope.depth + 1;

		$scope.isReplying = false;

		/**
		 * CONTROLLER API
		 * */

		$scope.thisController = this;

		this.completeReplying = function(data, post) {
			console.log('[rpMessageCommentCtrl] this.completeReplying(), $scope.message.kind: ' + $scope.message.kind);

			this.isReplying = false;

			if ($scope.message.kind === 't1') {
				$scope.comments = data.json.data.things;

			} else if ($scope.message.kind === 't4') {

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

		};

		this.completeDeleting = function(id) {
			this.isDeleting = false;
			console.log('[rpMessageCtrl] this.completeDeleting()');

			for (var i = 0; i < $scope.$parent.messages.length; i++) {
				if ($scope.$parent.messages[i].data.name === id) {
					$scope.$parent.messages.splice(i, 1);
				}
			}

		};

	}
]);

rpMessageControllers.controller('rpMessageSidenavCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'rpSettingsUtilService',
	'rpLocationUtilService',
	'rpIdentityUtilService',
	function(
		$scope,
		$rootScope,
		$mdDialog,
		rpSettingsUtilService,
		rpLocationUtilService,
		rpIdentityUtilService
	) {


		$scope.isOpen = false;

		$scope.toggleOpen = function() {
			$scope.isOpen = !$scope.isOpen;
		};

		$scope.hasMail = false;

		rpIdentityUtilService.getIdentity(function(data) {
			$scope.hasMail = data.has_mail;

		});

		$scope.showCompose = function(e) {
			console.log('[rpMessageSidenavCtrl] $scope.animations: ' + $scope.animations);

			if (rpSettingsUtilService.settings.composeDialog) {

				$mdDialog.show({
					controller: 'rpMessageComposeDialogCtrl',
					templateUrl: 'rpMessageComposeDialog.html',
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

		var deregisterMessagesRead = $rootScope.$on('rp_messages_read', function() {
			console.log('[rpMessageSidenavCtrl] rp_messages_read');
			$scope.hasMail = false;
		});

		$scope.$on('$destroy', function() {
			deregisterMessagesRead();
		});

	}
]);

rpMessageControllers.controller('rpMessageComposeDialogCtrl', [
	'$scope',
	'$location',
	'$mdDialog',
	'rpSettingsUtilService',
	'shareLink',
	'shareTitle',

	function(
		$scope,
		$location,
		$mdDialog,
		rpSettingsUtilService,
		shareLink,
		shareTitle
	) {
		$scope.animations = rpSettingsUtilService.settings.animations;

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

rpMessageControllers.controller('rpMessageComposeCtrl', [
	'$scope',
	'$rootScope',
	'$mdDialog',
	'$routeParams',
	'rpLocationUtilService',
	'rpSubredditsUtilService',
	'rpTitleChangeUtilService',

	function(
		$scope,
		$rootScope,
		$mdDialog,
		$routeParams,
		rpLocationUtilService,
		rpSubredditsUtilService,
		rpTitleChangeUtilService

	) {

		console.log('[rpMessageCompose] $scope.dialog: ' + $scope.dialog);
		console.log('[rpMessageCompose] $routeParams.shareTitle: ' + $routeParams.shareTitle);
		console.log('[rpMessageCompose] $routeParams.shareLink: ' + $routeParams.shareLink);

		if ($routeParams.shareTitle) {
			$scope.shareTitle = $routeParams.shareTitle;
		}

		if ($routeParams.shareLink) {
			$scope.shareLink = $routeParams.shareLink;
		}

		if (!$scope.dialog) {
			$rootScope.$emit('rp_hide_all_buttons');
			$rootScope.$emit('rp_tabs_hide');
		}

		$scope.title = angular.isDefined($scope.shareLink) && $scope.shareLink !== null ?
			"share a link with a reddit user" : "send a message";

		if (!$scope.dialog) {
			rpTitleChangeUtilService($scope.title, true, true);
		}

	}
]);

rpMessageControllers.controller('rpMessageComposeFormCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$mdDialog',
	'rpMessageComposeUtilService',
	'rpLocationUtilService',
	function(
		$scope,
		$rootScope,
		$timeout,
		$mdDialog,
		rpMessageComposeUtilService,
		rpLocationUtilService
	) {
		$scope.showText = false;
		$scope.messageSending = false;
		//$timeout(angular.noop, 0);

		$scope.showSend = true;
		// $scope.iden = "";

		var shareMessage = false;
		console.log('[rpMessageComposeFormCtrl] $scope.shareLink: ' + $scope.shareLink);

		if (angular.isDefined($scope.shareLink) && $scope.shareLink !== null) {
			shareMessage = true;

			$scope.subject = 'Check this out, ' + $scope.shareTitle;
			$scope.text = $scope.shareLink;

		}

		// $scope.rpMessageComposeForm.$setUntouched();

		$scope.closeDialog = function(e) {

			console.log('[rpMessageComposeFormCtrl] closeDialog(), $scope.dialog: ' + $scope.dialog);

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
			//$timeout(angular.noop, 0);


			rpMessageComposeUtilService($scope.subject, $scope.text, $scope.to, $scope.iden, $scope.captcha, function(err, data) {
				$scope.messageSending = false;
				$timeout(angular.noop, 0);


				if (err) {

					var errorBody = JSON.parse(err.body);

					console.log('[rpMessageComposeFormCtrl] err.body: ' + err.body);
					console.log('[rpMessageComposeFormCtrl] errorBody: ' + JSON.stringify(errorBody));

					if (errorBody.json.errors[0][0] === 'BAD_CAPTCHA') {
						$rootScope.$emit('reset_captcha');

						$scope.feedbackMessage = "You entered the CAPTCHA incorrectly. Please try again.";

						$scope.showFeedbackAlert = true;
						$scope.showFeedback = true;

						$scope.showButtons = true;
					} else {
						$rootScope.$emit('reset_captcha');
						$scope.feedbackMessage = errorBody.json.errors[0][1];
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
			if (!shareMessage) {
				$scope.subject = "";
				$scope.text = "";

			}
			$scope.to = "";

			$scope.rpMessageComposeForm.$setUntouched();
		}

	}
]);