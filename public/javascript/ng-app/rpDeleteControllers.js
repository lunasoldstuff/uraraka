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
				if (err) {
					console.log('[rpDeleteCtrl] err');
					
				} else {
					$scope.isDeleteInProgress = false;
					$scope.parentCtrl.completeDelete();
					
				}
				
			});
			
		}
	}
]);