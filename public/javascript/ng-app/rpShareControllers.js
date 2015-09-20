'use strict';

var rpShareControllers = angular.module('rpShareControllers', []);

rpShareControllers.controller('rpShareCtrl', ['$scope', '$window', '$mdBottomSheet', 
	'$mdDialog', 'rpLocationUtilService', 'rpSettingsUtilService', 'post',
	function($scope, $window, $mdBottomSheet, $mdDialog, rpLocationUtilService,
	 rpSettingsUtilService, post) {
		console.log('[rpShareCtrl] shareLink: ' + post.data.url);
		
		var shareLink = post ? "http://www.reddup.com" + post.data.permalink : 'http://www.reddup.com';
		var shareTitle = post ? post.data.title : 'reddup.com';
		

		var shareThumb = 'http://pacific-river-1673.herokuapp.com/logo';

		if (post && post.data.thumbnail !== "" && post.data.thumbnail !== "self") {
			shareThumb = post.data.thumbnail;
		}

		$scope.items = [
			{name: 'reddit user', icon: '/icons/reddit-square.svg'},
			{name: 'email', icon: '/icons/ic_email_black_48px.svg'},
			{name: 'facebook', icon: '/icons/facebook-box.svg'},
			{name: 'twitter', icon: '/icons/twitter-box.svg'},
		];

		$scope.listItemClicked = function(e, $index) {
			
			console.log('[rpShareCtrl] listItemClicked, $index: ' + $index);

			$mdBottomSheet.hide();

			switch($index) {
				case 0: 
					// var composeDialog = rpSettingsUtilService.settings.composeDialog;
					// console.log('[rpShareCtrl] reddit, composeDialog: ' + composeDialog);

					// if (composeDialog) {

						$mdDialog.show({
							controller: 'rpMessageComposeDialogCtrl',
							templateUrl: 'partials/rpMessageComposeDialog',
							clickOutsideToClose: false,
							escapeToClose: false,
							locals: {
								shareLink: shareLink,
								shareTitle: shareTitle
							}

						});
					
					// } else {
					// 	rpLocationUtilService(e, '/message/compose', '', true, false);
					// }
					// 
					break;
				
				case 1:
					console.log('[rpShareCtrl] email');

					$mdDialog.show({
						controller: 'rpShareEmailDialogCtrl',
						templateUrl: 'partials/rpShareEmailDialog',
						clickOutsideToClose: false,
						escapeToClose: false,
						locals: {
							shareLink: shareLink,
							shareTitle: shareTitle
						}

					});

					break;

				case 2:
					console.log('[rpShareCtrl] facebook');
					console.log('[rpShareCtrl] facebook, shareThumb: ' + shareThumb);

					var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=868953203169873&name=';
					fbUrl += encodeURIComponent(shareTitle);
					fbUrl += '&link=';
					fbUrl += encodeURIComponent(shareLink);
					fbUrl += '&redirect_uri=';
					fbUrl += encodeURIComponent('http://reddup.co');
					fbUrl += '&picture=';
					fbUrl += shareThumb;
					fbUrl += '&display=popup';

					$window.open(fbUrl, 'Share with facebook', "height=500,width=500");

					break;

				case 3:
					console.log('[rpShareCtrl] twitter');
					$window.open('https://twitter.com/intent/tweet?text='+ encodeURIComponent(shareTitle) + 
						', ' + encodeURIComponent(shareLink) + 
						' via @reddup', 'Share with twitter', "height=500,width=500");
					break;

				default:
			}

		};
	}
]);

rpShareControllers.controller('rpShareEmailDialogCtrl', ['$scope', '$location', '$mdDialog', 'shareLink', 'shareTitle',
	function($scope, $location, $mdDialog, shareLink, shareTitle) {

		console.log('[rpShareEmailDialogCtrl] shareLink: ' + shareLink);
		console.log('[rpShareEmailDialogCtrl] shareTitle: ' + shareTitle);

		$scope.shareLink = shareLink;
		$scope.shareTitle = shareTitle;

		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
		});

		$scope.$on('$destroy', function() {
			deregisterLocationChangeSuccess();
		});


	}
]);

rpShareControllers.controller('rpShareEmailFormCtrl', ['$scope', '$mdDialog', 'rpShareEmailUtilService',
	function ($scope, $mdDialog, rpShareEmailUtilService) {
	
		console.log('[rpShareEmailFormCtrl]');

		resetForm();

		function resetForm() {
			$scope.to = "";
			$scope.text = 'Check this out, [' + $scope.shareTitle +'](' + $scope.shareLink + ')';
			$scope.showAnother = false;
			$scope.showButtons = true;
			$scope.showSubmit = true;
			angular.element('#share-to').focus();
		}

		$scope.submitForm = function() {

			$scope.showProgress = true;
			$scope.showButtons = false;

			var subject = "reddup shared link: " + $scope.shareTitle;

			rpShareEmailUtilService($scope.to, $scope.text, subject, function(err, data) {

				if (err) {
					console.log('[rpShareEmailFormCtrl] err');
				} else {
					$scope.feedbackMessage = "Email sent :).";
					
					$scope.showProgress = false;
					$scope.showAnother = true;
					$scope.showSubmit = false;
					$scope.showButtons = true;
					
				}

			});

		};

		$scope.resetForm = function() {
			resetForm();
		};

		$scope.closeDialog = function() {
			$mdDialog.hide();
		};


	}
]);