(function () {
  function rpLayoutButtonCtrl(
    $scope,
    rpSettingsService
  ) {
    console.log('[rpLayoutButtonCtrl()]');

    $scope.onChange = function (e) {
      console.log('[rpLayoutButtonCtrl()] onChange()');
      rpSettingsService.setSetting('layout', rpSettingsService.settings.layout);
    };
  }

  angular.module('rpLayoutButton')
    .controller('rpLayoutButtonCtrl', [
      '$scope',
      'rpSettingsService',
      rpLayoutButtonCtrl
    ]);
}());
