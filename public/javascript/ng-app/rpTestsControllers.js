'use strict';

var rpTestsControllers = angular.module('rpTestsControllers', []);

rpTestsControllers.controller('rpTestsCtrl', ['$scope', 
	function($scope) {

		$scope.testType = 'recursive directive';

		$scope.numbers = new Array(10);

		for (var i = 0; i < 10; i++) {

			$scope.numbers[i] = new Array(10);

			for (var j = 0; j <10; j++) {


				$scope.numbers[i][j] = j;
			}
		}

		console.log('[rpTestsCtrl] numbers: ' + $scope.numbers);
		$scope.numbersString = '[rpTestsCtrl] numbers: ' + $scope.numbers;



	}

]);

rpTestsControllers.controller('rpTestsRecursiveDirectiveCtrl', ['$scope', 
	function() {

		console.log('[rpTestsRecursiveDirectiveCtrl] Hi I exist!');

	}
]);