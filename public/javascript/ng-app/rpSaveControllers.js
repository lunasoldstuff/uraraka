'use strict';

var rpSaveControllers = angular.module('rpSaveControllers', []);

rpSaveControllers.controller('rpSaveCtrl', 
	[
		'$scope', 
		'rpSaveUtilService', 
		'rpAuthUtilService',
		'rpToastUtilService',

		function(
			$scope, 
			rpSaveUtilService,
			rpAuthUtilService, 
			rpToastUtilService

		) {
		
			$scope.save = function() {
				if (rpAuthUtilService.isAuthenticated) {

					$scope.saved = !$scope.saved;
					
					rpSaveUtilService($scope.id, $scope.saved, function(err, data) {
						if (err) {
							console.log('[rpSaveCtrl] err');
						} else {
							console.log('[rpSaveCtrl] success');
							
						}
					});
	
				} else {
					rpToastUtilService("You've got to log in to save posts");
				}			
				
				
			}
		
		}
	]
);