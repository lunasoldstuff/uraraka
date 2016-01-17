'use strict';

var rpTabsControllers = angular.module('rpTabsControllers', []);

rpTabsControllers.controller('rpTabsCtrl', ['$scope', '$timeout',
	function($scope, $timeout) {
		console.log('[rpTabsCtrl]');

		$scope.tabClick = function(tab) {
			console.log('[rpTabsCtrl] tabClick(), tab: ' + tab);
			$timeout(function() {
				$scope.parentCtrl.tabClick(tab);

			}, 350);
		};

	}

]);