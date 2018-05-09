(function () {
  'use strict';

  function rpCaptchaCtrl($scope, $rootScope, $timeout, rpCaptchaService) {
    var deregisterResetCaptcha;
    var deregisterSuccessfulCaptcha;
    $scope.needsCaptcha = false;
    // Set captcha image to empty pixel to start (disables chrome showing a border around the image because it has an incorrect src)
    $scope.captchaImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    console.log('[rpCaptchaCtrl] rpCaptcha loaded');

    function getNewCaptcha() {
      $scope.iden = '';
      $scope.captcha = '';
      $scope.showCaptchaProgress = true;

      rpCaptchaService.newCaptcha(function (err, data) {
        if (err) {
          console.log('[rpCaptchaCtrl] err');
        } else {
          console.log('[rpCaptchaCtrl] getNewCaptcha(), iden: ' + data.json.data.iden);
          $scope.iden = data.json.data.iden;
          $scope.captchaImage = 'http://www.reddit.com/captcha/' + $scope.iden + '.png';
          $scope.showCaptchaProgress = false;
          $timeout(angular.noop, 0);
        }
      });
    }

    function resetCaptcha() {
      rpCaptchaService.needsCaptcha(function (err, data) {
        if (err) {
          console.log('[rpCaptchaCtrl] err');
        } else if (data) {
          console.log('[rpCaptchaCtrl] data true');
          $scope.needsCaptcha = true;
          getNewCaptcha();
        }
      });
    }

    $scope.reloadCaptcha = function () {
      $scope.showCaptchaProgress = true;
      // $timeout(angular.noop, 0);
      resetCaptcha();
      console.log('[rpCaptchaCtrl] reloadCaptcha, $scope.$parent.captcha: ' + $scope.captcha);
    };

    deregisterSuccessfulCaptcha = $rootScope.$on('successful_captcha', function () {
      $scope.showBadCaptcha = false;
      $scope.needsCaptcha = false;
    });

    deregisterResetCaptcha = $rootScope.$on('rp_reset_captcha', function () {
      resetCaptcha();
    });

    resetCaptcha();

    $scope.$on('$destroy', function () {
      deregisterSuccessfulCaptcha();
      deregisterResetCaptcha();
    });
  }

  angular.module('rpCaptcha')
    .controller('rpCaptchaCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      'rpCaptchaService',
      rpCaptchaCtrl
    ]);
}());
