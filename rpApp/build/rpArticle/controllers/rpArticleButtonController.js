'use strict';

(function () {
	'use strict';

	angular.module('rpArticle').controller('rpArticleButtonCtrl', ['$scope', '$rootScope', '$filter', '$mdDialog', '$mdBottomSheet', '$window', 'rpSettingsService', 'rpAppLocationService', 'rpAppIsMobileViewService', rpArticleButtonCtrl]);

	function rpArticleButtonCtrl($scope, $rootScope, $filter, $mdDialog, $mdBottomSheet, $window, rpSettingsService, rpAppLocationService, rpAppIsMobileViewService) {

		$scope.showArticle = function (e, context) {
			console.log('[rpArticleButtonCtrl] $scope.showArticle(), comment: ' + comment);

			// $rootScope.$emit('rp_suspendable_suspend');

			var article;
			var subreddit;
			var comment;
			var anchor;

			if ($scope.post) {
				//rpLink passing in a post, easy.
				console.log('[rpArticleButtonCtrl] $scope.showArticle() post, isComment: ' + $scope.isComment);

				article = $scope.isComment ? $filter('rpAppNameToId36Filter')($scope.post.data.link_id) : $scope.post.data.id;
				console.log('[rpArticleButtonCtrl] $scope.showArticle() article: ' + article);

				subreddit = $scope.post.data.subreddit;
				console.log('[rpArticleButtonCtrl] $scope.showArticle() subreddit: ' + subreddit);

				comment = $scope.isComment ? $scope.post.data.id : "";

				anchor = '#' + $scope.post.data.name;
			} else if ($scope.message) {
				//rpMessageComment...
				console.log('[rpArticleButtonCtrl] $scope.showArticle() message.');

				var messageContextRe = /^\/r\/([\w]+)\/comments\/([\w]+)\/(?:[\w]+)\/([\w]+)/;
				var groups = messageContextRe.exec($scope.message.data.context);

				if (groups) {
					subreddit = groups[1];
					article = groups[2];
					comment = groups[3]; //only if we are showing context
				}

				anchor = '#' + $scope.message.data.name;
			}

			console.log('[rpArticleButtonCtrl] $scope.showArticle(), comment: ' + comment);

			var hideBottomSheet = function hideBottomSheet() {
				console.log('[rpArticleButtonCtrl] hideBottomSheet()');
				$mdBottomSheet.hide();
			};

			//check if we are in mobile and open in dialog

			if (rpSettingsService.settings.commentsDialog && !e.ctrlKey || rpAppIsMobileViewService.isMobileView()) {

				console.log('[rpArticleButtonCtrl] anchor: ' + anchor);
				$mdDialog.show({
					controller: 'rpArticleDialogCtrl',
					templateUrl: 'rpArticle/views/rpArticleDialog.html',
					targetEvent: e,
					locals: {
						post: $scope.isComment ? undefined : $scope.post,
						article: article,
						comment: context ? comment : '',
						subreddit: subreddit
					},
					clickOutsideToClose: true,
					escapeToClose: false,
					onRemoving: hideBottomSheet

				});
			} else {
				console.log('[rpArticleButtonCtrl] $scope.showArticle() dont open in dialog.');

				var search = '';
				var url = '/r/' + subreddit + '/comments/' + article;

				if (context) {
					url += '/' + comment + '/';
					search = 'context=8';
				}

				rpAppLocationService(e, url, search, true, false);
			}
		};
	}
})();