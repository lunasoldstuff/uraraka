(function() {
	'use strict';
	angular.module('rpShare').controller('rpShareCtrl', [
		'$scope',
		'$window',
		'$filter',
		'$mdBottomSheet',
		'$mdDialog',
		'rpAppLocationService',
		'rpAppSettingsService',
		'rpAppGoogleUrlService',
		'rpAppAuthService',
		'rpToastService',
		'rpAppIsMobileViewService',
		'post',
		rpShareCtrl
	]);

	function rpShareCtrl(
		$scope,
		$window,
		$filter,
		$mdBottomSheet,
		$mdDialog,
		rpAppLocationService,
		rpAppSettingsService,
		rpAppGoogleUrlService,
		rpAppAuthService,
		rpToastService,
		rpAppIsMobileViewService,
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

		$scope.listItemClicked = function(e, $index) {

			console.log('[rpShareCtrl] listItemClicked, $index: ' + $index);

			$mdBottomSheet.hide();

			switch ($index) {
				case 0:

					// var composeDialog = rpAppSettingsService.settings.composeDialog;
					// console.log('[rpShareCtrl] reddit, composeDialog: ' + composeDialog);

					// if (composeDialog) {

					if (rpAppAuthService.isAuthenticated) {

						if ((rpAppSettingsService.settings.composeDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
							$mdDialog.show({
								controller: 'rpMessageComposeDialogCtrl',
								templateUrl: 'rpMessage/rpMessageCompose/views/rpMessageComposeDialog.html',
								clickOutsideToClose: false,
								escapeToClose: false,
								targetEvent: e,
								locals: {
									shareLink: shareLink,
									shareTitle: shareTitle
								}

							});

						} else {
							rpAppLocationService(e, '/message/compose/', 'shareTitle=' + shareTitle + '&shareLink=' + shareLink, true, false);

						}


					} else {
						rpToastService("you must log in to share to another user", "sentiment_neutral");
					}


					break;

				case 1:
					console.log('[rpShareCtrl] email');

					if (rpAppAuthService.isAuthenticated) {

						if ((rpAppSettingsService.settings.composeDialog && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
							$mdDialog.show({
								controller: 'rpShareEmailDialogCtrl',
								templateUrl: 'rpShare/views/rpShareEmailDialog.html',
								clickOutsideToClose: false,
								escapeToClose: false,
								targetEvent: e,
								locals: {
									shareLink: shareLink,
									shareTitle: shareTitle
								}

							});

						} else {
							rpAppLocationService(e, '/share/email/', 'shareTitle=' + shareTitle + '&shareLink=' + shareLink, true, false);

						}



					} else {
						rpToastService("you must log in to share via email", "sentiment_neutral");
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

						rpAppGoogleUrlService(shareLink, function(err, data) {
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
})();