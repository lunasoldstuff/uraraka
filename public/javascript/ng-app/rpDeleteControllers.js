'use strict';

var rpDeleteControllers = angular.module('rpDeleteControllers', []);

rpDeleteControllers.controller('rpDeleteCtrl', ['$scope', 'rpDeleteUtilService', 
	function($scope, rpDeleteUtilService) {
		console.log('[rpDeleteCtrl]');
	
		$scope.isDeleteInProgress = false;
		
		$scope.confirmDelete = function() {
			console.log('[rpDeleteCtrl] confirmDelete()');
			
			$scope.isDeleteInProgress = true;
			
			rpDeleteUtilService($scope.id, function(err, data) {
				$scope.isDeleteInProgress = false;
				
				if (err) {
					console.log('[rpDeleteCtrl] err');
					
				} else {
					$scope.parentCtrl.completeDelete($scope.id);
					
				}
				
			});
			
		}
	}
]);