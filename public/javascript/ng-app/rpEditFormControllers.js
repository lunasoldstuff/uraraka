'use strict';

var rpEditFormControllers = angular.module('rpEditFormControllers', []);

rpEditFormControllers.controller('rpEditFormCtrl', 
	[
		'$scope',
		'rpEditUtilService',
		 
		function($scope, rpEditUtilService) {
			
			console.log('[rpEditFormCtrl]');
			
			$scope.submit = function() {
				console.log('[rpEditFormCtrl] submit()');
				$scope.inputIsDisabled = true;
		
				$scope.isSubmitting = true;
	
				rpEditUtilService($scope.editText, $scope.id, function(err, data) {
					if (err) {
						console.log('[rpEditFormCtrl] err');
						
					} else {
						$scope.parentCtrl.completeEdit();
						
					}
	
				});
			};
		}
	]
);