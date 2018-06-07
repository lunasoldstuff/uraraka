(function () {
  'use strict';

  function rpMediaTwitterCtrl($scope, $sce, rpMediaTwitterResourceService) {
    const TWITTER_RE = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
    var groups = TWITTER_RE.exec($scope.url);
    $scope.tweet = '';

    if (groups) {
      rpMediaTwitterResourceService.get({
        id: groups[1]
      }, function (data) {
        $scope.tweet = $sce.trustAsHtml(data.html);
      });
    }
  }

  angular.module('rpMediaTwitter')
    .controller('rpMediaTwitterCtrl', [
      '$scope',
      '$sce',
      'rpMediaTwitterResourceService',
      rpMediaTwitterCtrl
    ]);
}());
