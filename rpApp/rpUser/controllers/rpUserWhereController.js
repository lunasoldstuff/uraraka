(function() {
	'use strict';
	angular.module('rpUser').controller('rpUserWhereCtrl', [
		'$scope',
		'$rootScope',
		'$routeParams',
		'rpIdentityService',
		rpUserWhereCtrl
	]);

	function rpUserWhereCtrl($scope, $rootScope, $routeParams, rpIdentityService) {

		$scope.wheres = [{
			label: 'overview',
			value: 'overview'
		}, {
			label: 'submitted',
			value: 'submitted'
		}, {
			label: 'comments',
			value: 'comments'
		}, {
			label: 'gilded',
			value: 'gilded'
		}, ];

		if (angular.isDefined($routeParams.where)) {
			for (var i = 0; i < $scope.wheres.length; i++) {
				if ($scope.wheres[i].value === $routeParams.where) {
					$scope.userWhere = $scope.wheres[i];
					break;
				}
			}
		}

		if (angular.isUndefined($scope.userWhere)) {
			$scope.userWhere = {
				label: 'overview',
				value: 'overview'
			};
		}

		$scope.selectWhere = function() {
			$rootScope.$emit('user_where_click', $scope.userWhere.value);
		};

		rpIdentityService.getIdentity(function(identity) {
			if ($routeParams.username === identity.name) {
				$scope.wheres = $scope.wheres.concat([{
					label: 'upvoted',
					value: 'upvoted'
				}, {
					label: 'downvoted',
					value: 'downvoted'
				}, {
					label: 'hidden',
					value: 'hidden'
				}, {
					label: 'saved',
					value: 'saved'
				}]);

			}

		});

		function checkIsMe() {
			rpIdentityService.getIdentity(function(identity) {
				$scope.identity = identity;
				$scope.isMe = ($routeParams.username === identity.name);
			});
		}
	}

})();