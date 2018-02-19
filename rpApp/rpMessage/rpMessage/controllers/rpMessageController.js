(function() {
	'use strict';
	angular.module('rpMessage').controller('rpMessageCtrl', ['$scope',
		'$rootScope',
		'$routeParams',
		'$timeout',
		'rpMessageService',
		'rpIdentityService',
		'rpAppTitleChangeService',
		'rpMessageReadAllService',
		'rpAppLocationService',
		'rpAppSettingsService',
		'rpMessageReadService',
		rpMessageCtrl
	]);

	function rpMessageCtrl(
		$scope,
		$rootScope,
		$routeParams,
		$timeout,
		rpMessageService,
		rpIdentityService,
		rpAppTitleChangeService,
		rpMessageReadAllService,
		rpAppLocationService,
		rpAppSettingsService,
		rpMessageReadService

	) {
		console.log('[rpMessageCtrl] load');

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

		rpAppTitleChangeService('Messages', true, true);

		var where = $routeParams.where || 'inbox';

		console.log('[rpMessageCtrl] where: ' + where);

		$rootScope.$emit('rp_progress_start');

		rpIdentityService.reloadIdentity(function(data) {
			$scope.identity = data;
			$scope.hasMail = $scope.identity.has_mail;

			// console.log('[rpMessageCtrl] $scope.identity: ' + JSON.stringify($scope.identity));
			console.log('[rpMessageCtrl] $scope.hasMail: ' + $scope.hasMail);

			if ($scope.hasMail && where !== 'unread') {
				where = 'unread';
				rpAppLocationService(null, '/message/' + where, '', true, true);
			} else {
				console.log('[rpMessageCtrl] where: ' + where);

				$rootScope.$emit('rp_init_select');

				loadPosts();

			}


		});


		/**
		 * EVENT HANDLERS
		 */
		var deregisterMessageWhereClick = $rootScope.$on('rp_message_where_click', function(e, tab) {
			console.log('[rpMessageCtrl] on rp_message_where_click, tab: ' + tab);

			where = tab;
			rpAppLocationService(null, '/message/' + where, '', false, false);
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

					rpMessageService(where, lastMessageName, limit, function(err, data) {
						$rootScope.$emit('rp_progress_stop');

						if (err) {
							console.log('[rpMessageService] err');
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

			console.log('[rpMessageCtrl] loadPosts()');

			$scope.messages = [];
			$scope.havePosts = false;
			$scope.hasMail = false;
			$scope.noMorePosts = false;
			$rootScope.$emit('rp_progress_start');


			rpMessageService(where, '', limit, function(err, data) {
				$rootScope.$emit('rp_progress_stop');
				console.log('[rpMessageCtrl] received message data, data.get.data.children.length: ' + data.get.data.children.length);

				if (err) {
					console.log('[rpMessageService] err');
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
					// rpAppTitleChangeService(where, true, true);

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

						rpMessageReadService(message, function(data) {
							if (err) {
								console.log('[rpMessageCtrl] err');
							} else {
								console.log('[rpMessageCtrl] all messages read.');
								$scope.hasMail = false;
								$rootScope.$emit('rp_messages_read');
							}
						});

						// rpMessageReadAllService(function(err, data) {
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

		});

	}


})();