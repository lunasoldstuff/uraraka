(function () {
  'use strict';


  function rpSpeedDialCtrl(
    $scope,
    $rootScope,
    $mdDialog,
    rpAppAuthService,
    rpToastService,
    rpSettingsService,
    rpAppLocationService,
    rpAppIsMobileViewService

  ) {
    var sub = $scope.subreddit !== 'all' ? $scope.subreddit : '';
    var search = '';

    console.log('[rpSpeedDialCtrl] load, $scope.subreddit: ' + $scope.subreddit);

    console.log('[rpSpeedDialCtrl] load, sub: ' + sub);

    $scope.isOpen = false;
    $scope.direction = 'up';

    $scope.open = function () {
      if ($scope.isOpen === false) {
        $scope.isOpen = true;
      }
    };

    $scope.collapse = function () {
      if ($scope.isOpen === true) {
        $scope.isOpen = false;
      }
    };


    $scope.newLink = function (e) {
      if (rpAppAuthService.isAuthenticated) {
        if ((rpSettingsService.getSetting('submitDialog') && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
          $mdDialog.show({
            controller: 'rpSubmitDialogCtrl',
            templateUrl: 'rpSubmit/views/rpSubmitLinkDialog.html',
            targetEvent: e,
            locals: {
              subreddit: sub
            },
            clickOutsideToClose: false,
            escapeToClose: false

          });
        } else {
          if (sub) {
            search = 'sub=' + sub;
          }
          console.log('[rpPostFabCtrl] submit link page, search: ' + search);
          rpAppLocationService(e, '/submitLink', search, true, false);
        }


        $scope.fabState = 'closed';
      } else {
        $scope.fabState = 'closed';
        rpToastService('you must log in to submit a link', 'sentiment_neutral');
      }
    };

    $scope.newText = function (e) {
      console.log('[rpSpeedDialCtrl] newText() e.ctrlKey: ' + e.ctrlKey);

      if (rpAppAuthService.isAuthenticated) {
        if ((rpSettingsService.getSetting('submitDialog') && !e.ctrlKey) || rpAppIsMobileViewService.isMobileView()) {
          $mdDialog.show({
            controller: 'rpSubmitDialogCtrl',
            templateUrl: 'rpSubmit/views/rpSubmitTextDialog.html',
            targetEvent: e,
            locals: {
              subreddit: sub
            },
            clickOutsideToClose: false,
            escapeToClose: false

          });
        } else {
          if (sub) {
            search = 'sub=' + sub;
          }
          console.log('[rpPostFabCtrl] submit text page, search: ' + search);
          rpAppLocationService(e, '/submitText', search, true, false);
        }

        $scope.fabState = 'closed';
      } else {
        $scope.fabState = 'closed';
        rpToastService('you must log in to submit a self post', 'sentiment_neutral');
      }
    };

    $scope.$on('$destroy', function () {});
  }

  angular.module('rpSpeedDial')
    .controller('rpSpeedDialCtrl', [
      '$scope',
      '$rootScope',
      '$mdDialog',
      'rpAppAuthService',
      'rpToastService',
      'rpSettingsService',
      'rpAppLocationService',
      'rpAppIsMobileViewService',
      rpSpeedDialCtrl
    ]);
}());
