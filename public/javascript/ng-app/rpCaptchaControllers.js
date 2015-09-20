'use strict';

var rpCaptchaControllers = angular.module('rpCaptchaControllers', []);

rpCaptchaControllers.controller('rpCaptchaCtrl', ['$scope', '$rootScope', 'rpCaptchaUtilService',
	function($scope, $rootScope, rpCaptchaUtilService) {

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
					console.log('[rpCaptchaCtrl] rpCaptcha needsCaptcha, data: ' + JSON.stringify(data));
					
					$scope.needsCaptcha = data;
					if ($scope.needsCaptcha) getNewCaptcha();
					
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
					$scope.iden = data.json.data.iden;
					$scope.captchaImage = 'http://www.reddit.com/captcha/' + $scope.iden + '.png';
					$scope.showCaptchaProgress = false;
					
				}
			});

		}

		$scope.reloadCaptcha = function() {
			$scope.showCaptchaProgress = true;
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