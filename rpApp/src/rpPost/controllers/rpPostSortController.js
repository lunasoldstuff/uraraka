(function () {
  'use strict';

  var deregisterRouteChangeSuccess;

  function rpPostSortCtrl($scope, $rootScope, $routeParams) {
    $scope.sorts = [{
      label: 'hot',
      value: 'hot'
    },
    {
      label: 'new',
      value: 'new'
    },
    {
      label: 'rising',
      value: 'rising'
    },
    {
      label: 'controversial',
      value: 'controversial'
    },
    {
      label: 'top',
      value: 'top'
    },
    {
      label: 'gilded',
      value: 'gilded'
    }
    ];

    $scope.selectSort = function () {
      $rootScope.$emit('rp_post_sort_click', $scope.postSort.value);
    };


    function initValue() {
      var sort;
      var i;
      console.log('[rpPostSortCtrl] initValue(), $routeParams.sort: ' + $routeParams.sort);


      if (angular.isDefined($routeParams.sort)) {
        for (i = 0; i < $scope.sorts.length; i++) {
          if ($scope.sorts[i].value === $routeParams.sort) {
            sort = $scope.sorts[i];
            break;
          }
        }
      }

      if (angular.isUndefined(sort)) {
        sort = {
          label: 'hot',
          value: 'hot'
        };
      }

      $scope.postSort = sort;
    }

    deregisterRouteChangeSuccess = $rootScope.$on(
      '$routeChangeSuccess',
      function () {
        console.log('[rpPostSortCtrl] onRouteChange');
        initValue();
      }
    );

    initValue();

    $scope.$on('$destroy', function () {
      deregisterRouteChangeSuccess();
    });
  }

  angular
    .module('rpPost')
    .controller('rpPostSortCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      rpPostSortCtrl
    ]);
}());
