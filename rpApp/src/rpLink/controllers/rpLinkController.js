(function() {
	'use strict';
	angular.module('rpLink').controller('rpLinkCtrl', [
		'$scope',
		'$rootScope',
		'$timeout',
		'$filter',
		'$mdPanel',
		'rpAppLocationService',
		'rpSettingsService',
		rpLinkCtrl
	]);

	function rpLinkCtrl(
		$scope,
		$rootScope,
		$timeout,
		$filter,
		$mdPanel,
		rpAppLocationService,
		rpSettingsService
	) {

		// console.log('[rpLinkCtrl] $scope.$parent.$index: ' + $scope.$parent.$index);
		// console.log('[rpLinkCtrl] $scope.post.isAd: ' + $scope.post.isAd);

		console.log('[rpLinkCtrl]');
		$scope.thisController = this;
		$scope.animations = $scope.$parent.animations;
		$scope.showNSFW = rpSettingsService.settings.over18;

		$scope.showThumb = false;
		if ($scope.post.data.thumbnail !== 'default' &&
			$scope.post.data.thumbnail !== 'self' &&
			$scope.post.data.thumbnail !== 'nsfw'
		) {
			$scope.showThumb = true;
		}


		calcWarning();

		function calcWarning() {
			$scope.showWarning = false;

			if (angular.isDefined($scope.post.data.title) && angular.isDefined($scope.post.data.over18)) {
				if (($scope.post.data.title.toLowerCase().indexOf('nsfw') > 0 ||
						$scope.post.data.title.toLowerCase().indexOf('gore') > 0 ||
						$scope.post.data.title.toLowerCase().indexOf('nsfl') > 0 ||
						$scope.post.data.over_18) && $scope.showNSFW) {
					$scope.showWarning = true;

				}
			}

		};

		$scope.showMedia = function() {
			$scope.showWarning = false;
			console.log('[rpLinkCtrl] showMedia(), $scope.post.data.thumbnail: ' + $scope.post.data.thumbnail);
			if ($scope.post.data.thumbnail === 'default' ||
				$scope.post.data.thumbnail === 'self' ||
				$scope.post.data.thumbnail === 'nsfw'
			) {
				$scope.showThumb = true;
				$scope.toggleListMedia();
			}
		};

		if (angular.isUndefined($scope.post.isAd)) {
			$scope.post.isAd = false;
		}

		if ($scope.post.isAd === false) {
			$scope.isComment = $filter('rpLinkIsCommentFilter')($scope.post.data.name);
			// console.log('[rpLinkCtrl] $scope.isComment: ' + $scope.isComment);

			//Dodgy because depends on $scope.identity being set by a parentCtrl like rpPostCtrl or
			//rpUserCtrl.
			//Could change to look up identity here instead, but then you are doing it for every single link so..
			//This way works, you just have to be careful and make sure the parentCtrl is actually looking up the
			//identity And setting it on $scope.identity.
			$scope.isMine = $scope.identity ? $scope.post.data.author === $scope.identity.name : false;

			/**
			 * CONTOLLER API
			 */
			$scope.thisController = this;

			this.completeDeleting = function(id) {
				console.log('[rpLinkCtrl] completeDeleting()');
				$scope.parentCtrl.completeDeleting(id);

			};

			this.completeReplying = function(data) {
				console.log('[rpLinkCtrl] completeReplying()');
				$scope.postComment = data.json.data.things[0];
				$scope.post.data.num_comments++;
			};

		}

		$scope.openMediaPreview = function() {
			console.log('[rpLinkCtrl] openMediaPreview()');

			var position = $mdPanel.newPanelPosition().absolute().center();

			$mdPanel.open({
				attachTo: angular.element(document.body),
				controller: 'rpMediaPreviewPanelCtrl',
				disableParentScroll: this.disableParentScroll,
				templateUrl: 'rpMedia/rpMedia/views/rpMediaPreviewPanel.html',
				hasBackdrop: true,
				position: position,
				trapFocus: true,
				zIndex: 150,
				clickOutsideToClose: true,
				escapeToClose: true,
				focusOnOpen: true,
				panelClass: 'rp-media-preview-panel',
				// fullscreen: true,
				locals: {
					post: $scope.post
				}
			});

		};

		$scope.showListMedia = false;
		$scope.toggleListMedia = function() {
			console.log('[rpLinkCtrl] toggleListMedia(), $scope.showListMedia: ' + $scope.showListMedia);
			$scope.showListMedia = !$scope.showListMedia;
		};

		var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
			console.log('[rpLinkCtrl] on rp_settings_changed');
			$scope.showNSFW = rpSettingsService.settings.over18;
			calcWarning();
		});

		$scope.$on('$destroy', function() {
			deregisterSettingsChanged();
		});

	}

})();