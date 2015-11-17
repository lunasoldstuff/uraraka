'use strict';

var rpEditFormControllers = angular.module('rpEditFormControllers', []);

rpEditFormControllers.controller('rpEditFormCtrl', 
	[
		'$scope',
		'rpEditUtilService',
		 
		function($scope, rpEditUtilService) {
			$scope.editText = $scope.selfText;
			
			$scope.submit = function() {
				console.log('[rpEditFormCtrl] submit()');
		
				$scope.isSubmitting = true;
	
				rpEditUtilService($scope.editText, $scope.id, function(err, data) {
					if (err) {
						console.log('[rpArticleEditFormCtrl] err');
					} else {
						$scope.parentCtrl.completeEdit();
						
						
					}
	
				});
		
				
			}
			
		}
	]
);