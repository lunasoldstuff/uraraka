(function() {
	'use strict';
	angular.module('rpMessage').controller('rpMessageSidenavCtrl', ['$scope',
		'$rootScope',
		'$mdDialog',
		'rpSettingsService',
		'rpLocationService',
		'rpIdentityService',
		'rpIsMobileViewService',
		rpMessageSidenavCtrl
	]);

	function rpMessageSidenavCtrl(
		$scope,
		$rootScope,
		$mdDialog,
		rpSettingsService,
		rpLocationService,
		rpIdentityService,
		rpIsMobileViewService
	) {


		$scope.isOpen = false;

		$scope.toggleOpen = function() {
			$scope.isOpen = !$scope.isOpen;
		};

		$scope.hasMail = false;

		rpIdentityService.getIdentity(function(data) {
			$scope.hasMail = data.has_mail;

		});

		$scope.showCompose = function(e) {
			console.log('[rpMessageSidenavCtrl] $scope.animations: ' + $scope.animations);

			if ((rpSettingsService.settings.composeDialog && !e.ctrlKey) || rpIsMobileViewService.isMobileView()) {

				$mdDialog.show({
					controller: 'rpMessageComposeDialogCtrl',
					templateUrl: 'rpMessage/views/rpMessageComposeDialog.html',
					targetEvent: e,
					clickOutsideToClose: false,
					escapeToClose: false,
					locals: {
						shareLink: null,
						shareTitle: null
					}

				});

			} else {
				rpLocationService(e, '/message/compose', '', true, false);
			}

		};

		$scope.showInbox = function(e) {
			rpLocationService(e, '/message/inbox', '', true, false);
		};

		$scope.showSent = function(e) {
			rpLocationService(e, '/message/sent', '', true, false);
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