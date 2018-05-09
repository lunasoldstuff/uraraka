(function () {
  'use strict';


  function rpSettingsCtrl(
    $scope,
    $rootScope,
    $routeParams,
    rpSettingsService,
    rpAppTitleChangeService,
    rpPlusSubscriptionService,
    rpToolbarButtonVisibilityService
  ) {
    var deregisterPlusSubscriptionUpdate;
    console.log('[rpSettingsCtrl]');
    console.log('[rpSettingsCtrl] $scope.theme: ' + $scope.theme);

    if (angular.isUndefined($scope.selected)) {
      $scope.selected = $routeParams.selected === 'plus' ? 1 : 0;
    }

    console.log('[rpSettingsCtrl] $scope.selected: ' + $scope.selected);
    console.log('[rpSettingsCtrl] $routeParams.selected: ' + $routeParams.selected);

    this.settings = rpSettingsService.getSettings();

    rpPlusSubscriptionService.isSubscribed(function (isSubscribed) {
      $scope.isSubscribed = isSubscribed;
    });

    $scope.themes = [{
      name: 'blue',
      value: 'default'
    },
    {
      name: 'indigo',
      value: 'indigo'
    },
    {
      name: 'green',
      value: 'green'
    },
    {
      name: 'deep-orange',
      value: 'deep-orange'
    },
    {
      name: 'red',
      value: 'red'
    },
    {
      name: 'pink',
      value: 'pink'
    },
    {
      name: 'purple',
      value: 'purple'
    }
    ];

    $scope.fontSizes = [{
      name: 'Smaller',
      value: 'smaller'
    },
    {
      name: 'Regular',
      value: 'regular'
    },
    {
      name: 'Larger',
      value: 'larger'
    }
    ];

    if (!$scope.isDialog) {
      rpAppTitleChangeService('Settings', true, true);
      rpToolbarButtonVisibilityService.hideAll();
    }

    $scope.settingChanged = function () {
      rpSettingsService.setSettings($scope.settings);
    };

    deregisterPlusSubscriptionUpdate = $rootScope.$on('rp_plus_subscription_update', function (
      e,
      isSubscribed
    ) {
      $scope.isSubscribed = isSubscribed;
    });

    $scope.$on('$destroy', function () {
      deregisterPlusSubscriptionUpdate();
    });
  }

  angular
    .module('rpSettings')
    .controller('rpSettingsCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      'rpSettingsService',
      'rpAppTitleChangeService',
      'rpPlusSubscriptionService',
      'rpToolbarButtonVisibilityService',
      rpSettingsCtrl
    ]);
}());
