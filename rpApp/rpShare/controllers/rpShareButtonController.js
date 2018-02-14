(function() {
	'use strict';
	angular.module('rpShare').controller('rpShareButtonCtrl', [
		'$scope',
		'$rootScope',
		'$mdBottomSheet',
		rpShareButtonCtrl
	]);

	function rpShareButtonCtrl(
		$scope,
		$rootScope,
		$mdBottomSheet
	) {

		$scope.share = function(e) {
			// console.log("[rpShareButtonCtrl] share(), angular.element('.rp-tab-toolbar').css('top'): " +
			// 	parseInt(angular.element('.rp-tab-toolbar').css('top')));

			$mdBottomSheet.show({
				templateUrl: 'rpShare/views/rpShareBottomSheet.html',
				controller: 'rpShareCtrl',
				targetEvent: e,
				parent: '#article-bottom-sheet-parent', //rp-main
				disbaleParentScroll: true,
				locals: {
					post: $scope.post
				}
			}).then(function() {

			}, function() {
				// console.log('[rpShareControllers] bottom sheet closed');
			}).catch(function() {

			});

			// bottomSheetPromise.reject('close').then(function() {
			// 	console.log('[rpShareControllers] bottom sheet closed');
			// });

		};

	}
})();