(function () {
  'use strict';


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
    var deregisterOver18Watcher;
    console.log('[rpLinkCtrl]');
    $scope.thisController = this;
    this.settings = rpSettingsService.getSettings();

    $scope.showThumb = false;
    if ($scope.post.data.thumbnail !== 'default' &&
      $scope.post.data.thumbnail !== 'self' &&
      $scope.post.data.thumbnail !== 'nsfw'
    ) {
      $scope.showThumb = true;
    }

    function calcWarning() {
      $scope.showWarning = false;

      if (angular.isDefined($scope.post.data.title) && angular.isDefined($scope.post.data.over_18)) {
        if (($scope.post.data.title.toLowerCase()
          .indexOf('nsfw') > 0 ||
            $scope.post.data.title.toLowerCase()
              .indexOf('gore') > 0 ||
            $scope.post.data.title.toLowerCase()
              .indexOf('nsfl') > 0 ||
            $scope.post.data.over_18) && rpSettingsService.getSetting('over18')) {
          $scope.showWarning = true;
        }
      }
    }

    $scope.showMedia = function () {
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

      // Dodgy because depends on $scope.identity being set by a parentCtrl like rpPostCtrl or
      // rpUserCtrl.
      // Could change to look up identity here instead, but then you are doing it for every single link so..
      // This way works, you just have to be careful and make sure the parentCtrl is actually looking up the
      // identity And setting it on $scope.identity.
      $scope.isMine = $scope.identity ? $scope.post.data.author === $scope.identity.name : false;

      /**
       * CONTOLLER API
       */
      $scope.thisController = this;

      this.completeDeleting = function (id) {
        console.log('[rpLinkCtrl] completeDeleting()');
        $scope.parentCtrl.completeDeleting(id);
      };

      this.completeReplying = function (data) {
        console.log('[rpLinkCtrl] completeReplying()');
        $scope.postComment = data.json.data.things[0];
        $scope.post.data.num_comments++;
      };
    }

    $scope.openMediaPreview = function () {
      var position = $mdPanel.newPanelPosition()
        .absolute()
        .center();
      console.log('[rpLinkCtrl] openMediaPreview()');

      $mdPanel.open({
        attachTo: angular.element(document.body),
        controller: 'rpMediaPreviewPanelCtrl',
        controllerAs: 'mediaPreviewPanelCtrl',
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
    $scope.toggleListMedia = function () {
      console.log('[rpLinkCtrl] toggleListMedia(), $scope.showListMedia: ' + $scope.showListMedia);
      $scope.showListMedia = !$scope.showListMedia;
    };

    deregisterOver18Watcher = $scope.$watch(() => {
      return rpSettingsService.getSetting('over18');
    }, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        console.log('[rpLinkCtrl()] over18Watcher');
        calcWarning();
      }
    });

    calcWarning();

    $scope.$on('$destroy', function () {
      deregisterOver18Watcher();
    });
  }

  angular.module('rpLink')
    .controller('rpLinkCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      '$filter',
      '$mdPanel',
      'rpAppLocationService',
      'rpSettingsService',
      rpLinkCtrl
    ]);
}());
