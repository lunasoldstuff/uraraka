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

		$scope.testProps = {
			number: 22
		};

		$scope.incrementTestPropNumber = function() {
			console.log('[rpTestsCtrl] incrementPropNumber()');
			var inc = $scope.testProps.number + 1;

			$scope.testProps = {
				number: inc
			};
		};

		$scope.incrementPropNumber = function(number) {
			console.log('[rpTestsCtrl] incrementPropNumber(), $scope.number: ' + $scope.number);
			$scope.number = number + 1;
			console.log('[rpTestsCtrl] incrementPropNumber $scope.number: ' + $scope.number);

		};

		$scope.multiply = function(factor) {
			console.log('[rpTestsCtrl] multiply(), factor: ' + factor);
			for (var i = 0; i < $scope.numbers.length; i++) {
				$scope.numbers[0][i] = $scope.numbers[0][i] * factor;
			}
		};


	}

]);



rpTestsControllers.controller('rpTestsRecursiveDirectiveCtrl', ['$scope', 
	function() {

		console.log('[rpTestsRecursiveDirectiveCtrl] Hi I exist!');

	}
]);