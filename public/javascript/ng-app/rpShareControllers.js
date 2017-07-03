'use strict';

var rpShareControllers = angular.module('rpShareControllers', []);

rpShareControllers.controller('rpShareButtonCtrl', [
	'$scope',
	'$rootScope',
	'$mdBottomSheet',

	function (
		$scope,
		$rootScope,
		$mdBottomSheet
	) {

		$scope.share = function (e) {
			// console.log("[rpShareButtonCtrl] share(), angular.element('.rp-tab-toolbar').css('top'): " +
			// 	parseInt(angular.element('.rp-tab-toolbar').css('top')));

			$mdBottomSheet.show({
				templateUrl: 'rpShareBottomSheet.html',
				controller: 'rpShareCtrl',
				targetEvent: e,
				parent: '#article-bottom-sheet-parent', //rp-main
				disbaleParentScroll: true,
				locals: {
					post: $scope.post
				}
			}).then(function () {

			}, function () {
				// console.log('[rpShareControllers] bottom sheet closed');
			}).catch(function () {

			});

			// bottomSheetPromise.reject('close').then(function() {
			// 	console.log('[rpShareControllers] bottom sheet closed');
			// });

		};

	}
]);

rpShareControllers.controller('rpShareCtrl', [
	'$scope',
	'$window',
	'$filter',
	'$mdBottomSheet',
	'$mdDialog',
	'rpLocationUtilService',
	'rpSettingsUtilService',
	'rpGoogleUrlUtilService',
	'rpAuthUtilService',
	'rpToastUtilService',
	'post',

	function (
		$scope,
		$window,
		$filter,
		$mdBottomSheet,
		$mdDialog,
		rpLocationUtilService,
		rpSettingsUtilService,
		rpGoogleUrlUtilService,
		rpAuthUtilService,
		rpToastUtilService,
		post
	) {
		console.log('[rpShareCtrl] $scope.$parent.animations: ' + $scope.$parent.animations);
		console.log('[rpShareCtrl] shareLink: ' + post.data.url);

		var shareLink = post ? "http://www.reddup.co" + post.data.permalink : 'http://www.reddup.co';
		var shareTitle = post ? post.data.title : 'reddup.co';


		var shareThumb = 'http://reddup.co/images/reddup.png';

		if (post && post.data.thumbnail !== "" && post.data.thumbnail !== "self") {
			shareThumb = post.data.thumbnail;
		}

		$scope.items = [
			// {name: 'buffer', icon: '/icons/ic_warning_black_48px.svg'},
			{
				name: 'reddit user',
				icon: '/icons/reddit-square.svg'
			}, {
				name: 'email',
				icon: '/icons/ic_email_black_48px.svg'
			}, {
				name: 'facebook',
				icon: '/icons/facebook-box.svg'
			}, {
				name: 'twitter',
				icon: '/icons/twitter-box.svg'
			},
		];

		$scope.listItemClicked = function (e, $index) {

			console.log('[rpShareCtrl] listItemClicked, $index: ' + $index);

			$mdBottomSheet.hide();

			switch ($index) {
				case 0:

					// var composeDialog = rpSettingsUtilService.settings.composeDialog;
					// console.log('[rpShareCtrl] reddit, composeDialog: ' + composeDialog);

					// if (composeDialog) {

					if (rpAuthUtilService.isAuthenticated) {

						if (rpSettingsUtilService.settings.composeDialog) {
							$mdDialog.show({
								controller: 'rpMessageComposeDialogCtrl',
								templateUrl: 'rpMessageComposeDialog.html',
								clickOutsideToClose: false,
								escapeToClose: false,
								targetEvent: e,
								locals: {
									shareLink: shareLink,
									shareTitle: shareTitle
								}

							});

						} else {
							rpLocationUtilService(e, '/message/compose/', 'shareTitle=' + shareTitle + '&shareLink=' + shareLink, true, false);

						}


					} else {
						rpToastUtilService("you must log in to share to another user", "sentiment_neutral");
					}


					break;

				case 1:
					console.log('[rpShareCtrl] email');

					if (rpAuthUtilService.isAuthenticated) {

						if (rpSettingsUtilService.settings.composeDialog) {
							$mdDialog.show({
								controller: 'rpShareEmailDialogCtrl',
								templateUrl: 'rpShareEmailDialog.html',
								clickOutsideToClose: false,
								escapeToClose: false,
								targetEvent: e,
								locals: {
									shareLink: shareLink,
									shareTitle: shareTitle
								}

							});

						} else {
							rpLocationUtilService(e, '/share/email/', 'shareTitle=' + shareTitle + '&shareLink=' + shareLink, true, false);

						}



					} else {
						rpToastUtilService("you must log in to share via email", "sentiment_neutral");
					}


					break;

				case 2:
					console.log('[rpShareCtrl] facebook');
					console.log('[rpShareCtrl] facebook, shareThumb: ' + shareThumb);

					var fbUrl = 'https://www.facebook.com/dialog/feed?app_id=868953203169873&name=';
					fbUrl += encodeURIComponent(shareTitle);
					fbUrl += '&link=';
					fbUrl += encodeURIComponent(shareLink);
					fbUrl += '&redirect_uri=';
					fbUrl += encodeURIComponent('http://reddup.co/facebookComplete');
					fbUrl += '&picture=';
					fbUrl += shareThumb;
					fbUrl += '&display=popup';

					$window.open(fbUrl, 'Share with facebook', "height=500,width=500");

					break;

				case 3:
					console.log('[rpShareCtrl] twitter, shareTitle: ' + shareTitle);
					var text;
					if (shareTitle.length + shareLink.length < 127) {
						text = shareTitle + ", " + shareLink + " via @reddup";

						$window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) +
							' via @reddup', 'Share with twitter', "height=500,width=500");
					} else {

						rpGoogleUrlUtilService(shareLink, function (err, data) {
							if (err) {
								console.log('[rp_twitter_message] error occurred shortening url.');
							} else {
								console.log('[rp_twitter_message] data.id: ' + data.id);
								console.log('[rp_twitter_message] shareTitle.length: ' + shareTitle.length);
								console.log('[rp_twitter_message] data.id.length: ' + data.id.length);

								if (shareTitle.length + data.id.length < 123) {

									text = shareTitle + ", " + data.id + " via @reddup";

								} else {

									console.log('[rp_twitter_message] use short title');

									var shortTitle = shareTitle.substr(0, 123 - data.id.length);
									text = shortTitle + ".. " + data.id + " via @reddup";

								}

								$window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text),
									'Share with twitter', "height=500,width=500");

							}
						});
					}

					break;

				default:
			}

		};
	}
]);

rpShareControllers.controller('rpShareEmailDialogCtrl', [
	'$scope',
	'$location',
	'$mdDialog',
	'shareLink',
	'shareTitle',
	'rpSettingsUtilService',

	function (
		$scope,
		$location,
		$mdDialog,
		shareLink,
		shareTitle,
		rpSettingsUtilService

	) {
		$scope.animations = rpSettingsUtilService.settings.animations;

		console.log('[rpShareEmailDialogCtrl] shareLink: ' + shareLink);
		console.log('[rpShareEmailDialogCtrl] shareTitle: ' + shareTitle);

		$scope.shareLink = shareLink || null;
		$scope.shareTitle = shareTitle || null;

		$scope.dialog = true;

		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function () {
			$mdDialog.hide();
		});

		$scope.$on('$destroy', function () {
			deregisterLocationChangeSuccess();
		});


	}
]);

rpShareControllers.controller('rpShareEmailCtrl', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'rpIdentityUtilService',
	'rpTitleChangeUtilService',

	function (
		$scope,
		$rootScope,
		$routeParams,
		rpIdentityUtilService,
		rpTitleChangeUtilService

	) {

		console.log('[rpShareCtrl]');

		rpIdentityUtilService.getIdentity(function (identity) {
			console.log('[rpShareEmailCtrl] identity: ' + JSON.stringify(identity));
			$scope.identity = identity;

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

			if (!$scope.dialog) {
				rpTitleChangeUtilService("share via email", true, true);
			}

		});
	}
]);

rpShareControllers.controller('rpShareEmailFormCtrl', [
	'$scope',
	'$timeout',
	'$mdDialog',
	'$window',
	'rpShareEmailUtilService',
	'rpLocationUtilService',
	function (
		$scope,
		$timeout,
		$mdDialog,
		$window,
		rpShareEmailUtilService,
		rpLocationUtilService
	) {

		console.log('[rpShareEmailFormCtrl]');

		$scope.showAnother = false;
		$scope.showButtons = true;
		$scope.showSubmit = true;
		$scope.showFeedback = false;
		$scope.feedbackMessage = "";
		$scope.showFeedbackAlert = false;

		function resetForm() {
			$scope.to = "";
			$scope.optionalMessage = "";
			$scope.showAnother = false;
			$scope.showButtons = true;
			$scope.showSubmit = true;
			$scope.showFeedback = false;
			$scope.feedbackMessage = "";
			$scope.showFeedbackAlert = false;
			angular.element('#share-to').focus();
		}

		$scope.submitForm = function () {

			$scope.showProgress = true;
			$scope.showButtons = false;
			$scope.showFeedback = false;
			$scope.feedbackMessage = "";
			$scope.showFeedbackAlert = false;
			$scope.showFeedbackSuccess = false;

			rpShareEmailUtilService($scope.to, $scope.shareTitle, $scope.shareLink, $scope.identity.name, $scope.optionalMessage, function (err, data) {

				if (err) {
					console.log('[rpShareEmailFormCtrl] err');
					console.log('[rpShareEmailFormCtrl] err: ' + JSON.stringify(err));

					//handle recepient email address incorrect
					if (err.data.message.indexOf('Illegal email address') !== -1) {
						$scope.showFeedback = true;
						$scope.feedbackMessage = "Please check the email address provided";
						$scope.showFeedbackAlert = true;
						$scope.showProgress = false;
						$scope.showButtons = true;
					}

				} else {
					$scope.feedbackMessage = "Email sent.";
					$scope.showFeedbackSuccess = true;
					$scope.showFeedback = true;
					$scope.showProgress = false;
					$scope.showAnother = true;
					$scope.showSubmit = false;
					$scope.showButtons = true;
					//$timeout(angular.noop, 0);


				}

			});

		};

		$scope.resetForm = function () {
			resetForm();
		};

		$scope.closeDialog = function (e) {

			if ($scope.dialog) {
				console.log('[rpMessageComposeFormCtrl] closeDialog: Dialog.');
				$mdDialog.hide();
			} else {
				if ($window.history.length > 1) {
					$window.history.back();

				} else {
					rpLocationUtilService(null, '/', '', true, false);
				}

			}

		};
	}
]);