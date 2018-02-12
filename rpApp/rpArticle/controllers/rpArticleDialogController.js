(function() {
	'use strict';
	angular.module('rpArticle').controller('rpArticleDialogCtrl', rpArticleDialogCtrl);

	function rpArticleDialogCtrl(
		$scope,
		$rootScope,
		$location,
		$filter,
		$mdDialog,
		$mdBottomSheet,
		rpSettingsService,
		post,
		article,
		comment,
		subreddit
	) {
		console.log('[rpArticleDialogCtrl]');
		$scope.animations = rpSettingsService.settings.animations;
		$scope.dialog = true;

		$scope.post = post;
		$scope.article = article;
		$scope.comment = comment;
		$scope.subreddit = subreddit;

		console.log('[rpArticleDialogCtrl] $scope.article: ' + $scope.article);
		console.log('[rpArticleDialogCtrl] $scope.subreddit: ' + $scope.subreddit);
		console.log('[rpArticleDialogCtrl] $scope.comment: ' + $scope.comment);

		if (!angular.isUndefined($scope.post)) {
			console.log('[rpArticleDialogCtrl] $scope.post.data.title: ' + $scope.post.data.title);
		}

		//Close the dialog if user navigates to a new page.
		var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
			$mdDialog.hide();
			$mdBottomSheet.hide();
		});

		$scope.$on('destroy', function() {
			// $rootScope.$emit('rp_suspendable_resume');
			deregisterLocationChangeSuccess();
		});

	}
})();