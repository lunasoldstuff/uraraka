'use strict';

var rpLinkControllers = angular.module('rpLinkControllers', []);

rpLinkControllers.controller('rpLinkCtrl', ['$scope',
  function($scope) {
    console.log('[rpLinkCtrl]');

    $scope.isMine = $scope.identity ? $scope.post.data.author === $scope.identity.name : false;

    /**
    * CONTOLLER API
    */
    $scope.thisController = this;

    this.completeDeleting = function(id) {
      console.log('[rpLinkCtrl] completeDeleting()');

      $scope.parentCtrl.completeDeleting(id);

    };

  }
]);
