(function () {
  'use strict';

  function rpGotoSubredditFormCtrl(
    $scope,
    rpAppLocationService
  ) {
    var subredditRe = /(?:r\/)?(\w+)/i;
    var sub;
    var search;
    console.log('[rpGotoSubredditFormCtrl] load');


    $scope.GotoSubredditFormSubmit = function (e) {
      var groups;
      console.log('[rpGotoSubredditFormCtrl] $scope.search: ' + $scope.s);

      groups = $scope.s.match(subredditRe);

      if (groups) {
        sub = groups[1];
      }


      if (sub) {
        rpAppLocationService(e, '/r/' + sub, '', true, false);
      }
    };
  }

  angular.module('rpGotoSubreddit')
    .controller('rpGotoSubredditFormCtrl', [
      '$scope',
      'rpAppLocationService',
      rpGotoSubredditFormCtrl
    ]);
}());
