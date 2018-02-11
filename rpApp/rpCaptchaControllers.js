'use strict';

var rpCaptchaControllers = angular.module('rpCaptchaControllers', []);

rpCaptchaControllers.controller('rpCaptchaCtrl', ['$scope', '$rootScope', '$timeout', 'rpCaptchaUtilService',
    function($scope, $rootScope, $timeout, rpCaptchaUtilService) {

        console.log('[rpCaptchaCtrl] rpCaptcha loaded');

        $scope.needsCaptcha = false;
        //Set captcha image to empty pixel to start (disables chrome showing a border around the image because it has an incorrect src)
        $scope.captchaImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

        resetCaptcha();

        function resetCaptcha() {

            rpCaptchaUtilService.needsCaptcha(function(err, data) {

                if (err) {
                    console.log('[rpCaptchaCtrl] err');
                } else {

                    if (data) {
                        console.log('[rpCaptchaCtrl] data true');
                        $scope.needsCaptcha = true;
                        getNewCaptcha();
                    }

                }

            });

        }

        function getNewCaptcha() {

            $scope.iden = "";
            $scope.captcha = "";
            $scope.showCaptchaProgress = true;

            rpCaptchaUtilService.newCaptcha(function(err, data) {
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

        $scope.reloadCaptcha = function() {
            $scope.showCaptchaProgress = true;
            //$timeout(angular.noop, 0);
            resetCaptcha();
            console.log('[rpCaptchaCtrl] reloadCaptcha, $scope.$parent.captcha: ' + $scope.captcha);
        };

        var deregisterSuccessfulCaptcha = $rootScope.$on('successful_captcha', function() {
            $scope.showBadCaptcha = false;
            $scope.needsCaptcha = false;
        });

        var deregisterResetCaptcha = $rootScope.$on('reset_captcha', function() {
            resetCaptcha();
        });

        $scope.$on('$destroy', function() {
            deregisterSuccessfulCaptcha();
            deregisterResetCaptcha();
        });

    }
]);
