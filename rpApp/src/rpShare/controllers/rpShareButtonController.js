(function () {
  'use strict';

  function rpShareButtonCtrl(
    $scope,
    $rootScope,
    $mdBottomSheet
  ) {
    $scope.share = function (e) {
      $mdBottomSheet.show({
        templateUrl: 'rpShare/views/rpShareBottomSheet.html',
        controller: 'rpShareCtrl',
        targetEvent: e,
        parent: '#article-bottom-sheet-parent', // rp-main
        disbaleParentScroll: true,
        locals: {
          post: $scope.post
        }
      })
        .then(function () {

        }, function () {
          // console.log('[rpShareControllers] bottom sheet closed');
        })
        .catch(function () {

        });
    };
  }

  angular.module('rpShare')
    .controller('rpShareButtonCtrl', [
      '$scope',
      '$rootScope',
      '$mdBottomSheet',
      rpShareButtonCtrl
    ]);
}());
