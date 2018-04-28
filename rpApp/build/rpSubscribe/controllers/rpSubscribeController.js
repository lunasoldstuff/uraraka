'use strict';

(function () {
  'use strict';

  angular.module('rpSubscribe').controller('rpSubscribeCtrl', ['$scope', '$rootScope', '$timeout', 'rpSubredditsService', 'rpToolbarButtonVisibilityService', rpSubscribeCtrl]);

  function rpSubscribeCtrl($scope, $rootScope, $timeout, rpSubredditsService, rpToolbarButtonVisibilityService) {
    console.log('[rpSubscribeCtrl] loaded');

    $scope.subscribed = rpSubredditsService.subscribed;
    $scope.loadingSubscription = false;

    $scope.toggleSubscription = function () {
      console.log('[rpSubscribeCtrl] toggleSubscription');
      $scope.loadingSubscription = true;
      $timeout(angular.noop, 0);

      rpSubredditsService.subscribeCurrent(function (err, data) {
        if (err) {
          console.log('[rpSubscribeCtrl] err');
        } else {}
      });
    };

    $scope.showSubscribe = rpToolbarButtonVisibilityService.visibilitySettings.showSubscribe;

    var deregisterSubscriptionStatusChanged = $rootScope.$on('subscription_status_changed', function (e, subscribed) {
      console.log('[rpSubscribeCtrl] on subscription_status_changed, subscribed: ' + subscribed);

      if ($scope.loadingSubscription) {
        $scope.loadingSubscription = false;
        $timeout(angular.noop, 0);
      }

      $scope.subscribed = subscribed;
    });

    $scope.$on('$destroy', function () {
      deregisterSubscriptionStatusChanged();
      deregisterShowButton();
      deregisterHideAllButtons();
    });
  }
})();