(function () {
  'use strict';


  function rpSettingsCtrl(
    $scope,
    $rootScope,
    $routeParams,
    rpSettingsService,
    rpAppTitleService,
    rpToolbarButtonVisibilityService
  ) {
    console.log('[rpSettingsCtrl]');
    console.log('[rpSettingsCtrl] $scope.theme: ' + $scope.theme);

    if (angular.isUndefined($scope.selected)) {
      $scope.selected = $routeParams.selected === 'plus' ? 1 : 0;
    }

    console.log('[rpSettingsCtrl] $scope.selected: ' + $scope.selected);
    console.log('[rpSettingsCtrl] $routeParams.selected: ' + $routeParams.selected);

    this.settings = rpSettingsService.getSettings();

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
      rpAppTitleService.changeTitles('settings');
      rpToolbarButtonVisibilityService.hideAll();
    }

    $scope.settingChanged = function () {
      // works to trigger save settings
      rpSettingsService.setSettings(rpSettingsService.settings);
    };

    $scope.$on('$destroy', function () {});
  }

  angular
    .module('rpSettings')
    .controller('rpSettingsCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      'rpSettingsService',
      'rpAppTitleService',
      'rpToolbarButtonVisibilityService',
      rpSettingsCtrl
    ]);
}());
