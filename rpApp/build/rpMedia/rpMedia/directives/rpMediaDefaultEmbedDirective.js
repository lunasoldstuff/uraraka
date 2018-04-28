'use strict';

(function () {
	'use strict';

	angular.module('rpMedia').directive('rpMediaDefaultEmbed', ['$compile', rpMediaDefaultEmbed]);

	function rpMediaDefaultEmbed($compile) {
		return {
			restrict: 'E',
			scope: {
				oembed: '='

			},
			compile: function compile(scope, elem) {
				console.log('[rpMediaDefaultEmbed] compile function, scope.oembed: ' + scope.oembed);
				console.log('[rpMediaDefaultEmbed] compile function, scope.post.data.media.oembed.html: ' + scope.post.data.media.oembed.html);

				// var el = angular.element(scope.html);
				// var compiled = $compile(el);
				// elem.append(el);
				// compiled(scope);
			},
			link: function link(scope) {
				console.log('[rpMediaDefaultEmbed] link, scope.oembed: ' + scope.oembed);
			}
		};
	}
})();