(function () {
  'use strict';

  function rpMediaRedditVideoCtrl($scope, $window) {
    console.log('[rpMediaRedditVideoCtrl]');
  }

  angular
    .module('rpMediaRedditVideo')
    .controller('rpMediaRedditVideoCtrl', [
      '$scope',
      '$window',
      rpMediaRedditVideoCtrl
    ]);
}());
