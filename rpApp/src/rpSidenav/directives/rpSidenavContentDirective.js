(function() {
	'use strict';
	angular.module('rpSidenav').directive('rpSidenavContent', [
		'$templateCache',
		'$timeout',
		'$mdMedia',
		rpSidenavContent
	]);

	function rpSidenavContent(
		$templateCache,
		$timeout,
		$mdMedia
	) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'rpSidenav/views/rpSidenavContent.html',
			link: function(scope, elem, attrs) {
				$timeout(function() {
					scope.showSidenav = $mdMedia('gt-md');

				}, 0);
				scope.$watch(function() {
					return $mdMedia('gt-md');
				}, function(showSidenav) {
					$timeout(function() {
						scope.showSidenav = showSidenav;

					}, 0);
				});

			}
		};
	}
})();