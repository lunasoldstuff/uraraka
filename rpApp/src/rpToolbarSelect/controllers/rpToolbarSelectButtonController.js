(function () {
  'use strict';

  function rpToolbarSelectButtonCtrl(
    $scope,
    $rootScope,
    $routeParams,
    rpAppAuthService,
    rpIdentityService
  ) {
    var deregisterRouteChangeSuccess;
    var deregisterSearchFormSubmitted;

    // Use the routeParam to set the initial selection
    function setInitialSelection() {
      var i;
      var selection;
      var routeParam = $routeParams[$scope.config.routeParam];

      if (angular.isDefined(routeParam)) {
        console.log('[rpToolbarSelectCtrl] init(), bar, $scope.config.options.length: ' +
            $scope.config.options.length);
        for (i = 0; i < $scope.config.options.length; i++) {
          if ($scope.config.options[i].value === routeParam) {
            selection = $scope.config.options[i];
            break;
          }
        }
      }

      if (angular.isUndefined(selection)) {
        selection = $scope.config.options[$scope.config.defaultOption];
      }

      $scope.selection = selection;
    }

    function setUserWhereOptions() {
      // Add extra options if user is viewing their own user page
      console.log('[rpToolbarSelectButtonCtrl] setUserWhereOptions(), user on their profile, add restricted options');

      rpIdentityService.getIdentity(function (identity) {
        if ($routeParams.username === identity.name) {
          console.log('[rpToolbarSelectButtonCtrl] setUserWhereOptions(), user on their profile, add restricted options');
          $scope.config.options = [
            ...$scope.config.options,
            {
              label: 'upvoted',
              value: 'upvoted'
            },
            {
              label: 'downvoted',
              value: 'downvoted'
            },
            {
              label: 'hidden',
              value: 'hidden'
            },
            {
              label: 'saved',
              value: 'saved'
            }
          ];
        } else {
          // make sure they are removed
          // in case you are going from your profile to someone elses
          $scope.config.options = $scope.config.options.slice(0, 3);
        }
      });
      // }
    }

    function init() {
      console.log('[rpToolbarSelectButtonCtrl] init(), $scope.config.type: ' +
          $scope.config.type);
      if (
        $scope.config.type === 'userWhere' &&
        rpAppAuthService.isAuthenticated
      ) {
        setUserWhereOptions();
      }
      setInitialSelection();
    }

    $scope.select = function () {
      $rootScope.$emit($scope.config.event, $scope.selection.value);
    };

    deregisterRouteChangeSuccess = $rootScope.$on(
      '$routeChangeSuccess',
      function () {
        console.log('[rpToolbarSelectCtrl] onRouteChange');
        init();
      }
    );

    deregisterSearchFormSubmitted = $rootScope.$on(
      'rp_init_select',
      function () {
        init();
      }
    );

    $scope.$on('$destroy', function () {
      deregisterRouteChangeSuccess();
    });

    console.log('[rpToolbarSelectCtrl] $scope.config.type: ' + $scope.config.type);
    init();
  }

  angular
    .module('rpToolbarSelect')
    .controller('rpToolbarSelectButtonCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      'rpAppAuthService',
      'rpIdentityService',
      rpToolbarSelectButtonCtrl
    ]);
}());
