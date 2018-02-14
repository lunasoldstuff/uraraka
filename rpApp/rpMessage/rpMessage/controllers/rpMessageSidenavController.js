(function() {
	'use strict';
	angular.module('rpMessage').controller('rpMessageSidenavCtrl', ['$scope',
		'$rootScope',
		'$mdDialog',
		'rpAppSettingsService',
		'rpAppLocationService',
		'rpAppIdentityService',
		'rpAppIsMobileViewService',
		rpMessageSidenavCtrl
	]);

	function rpMessageSidenavCtrl(
		$scope,
		$rootScope,
		$mdDialog,
		rpAppSettingsService,
		rpAppLocationService,
		rpAppIdentityService,
		rpAppIsMobileViewService
	) {


		$scope.isOpen = false;

		$scope.toggleOpen = function() {
			$scope.isOpen = !$scope.isOpen;
		};

		$scope.hasMail = false;

		rpAppIdentityService.getIdentity(function(data) {
			$scope.hasMail = data.has_mail;

		});

		$scope.showCompose = function(e) {
			console.log('[rpMessageSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpAppSettingsService.settings.composeDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {

				$mdDialog.show({
					controller: 'rpMessageComposeDialogCtrl',
					templateUrl: 'rpMessage/rpMessageCompose/views/rpMessageComposeDialog.html',
					targetEvent: e,
					clickOutsideToClose: false,
					escapeToClose: false,
					locals: {
						shareLink: null,
						shareTitle: null
					}

				});

			} else {
				rpAppLocationService(e, '/message/compose', '', true, false);
			}

		};

		$scope.showInbox = function(e) {
			rpAppLocationService(e, '/message/inbox', '', true, false);
		};

		$scope.showSent = function(e) {
			rpAppLocationService(e, '/message/sent', '', true, false);
		};

		var deregisterMessagesRead = $rootScope.$on('rp_messages_read', function() {
			console.log('[rpMessageSidenavCtrl] rp_messages_read');
			$scope.hasMail = false;
		});

		$scope.$on('$destroy', function() {
			deregisterMessagesRead();
		});

	}
})();