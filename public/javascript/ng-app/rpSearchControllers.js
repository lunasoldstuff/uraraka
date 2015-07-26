'use strict';

var rpSearchControllers = angular.module('rpSearchControllers', []);

rpSearchControllers.controller('rpSearchToolbarCtrl', ['$scope', 
	function ($scope) {
	
		$scope.isOpen = false;
		$scope.count = 0;

	}
]);