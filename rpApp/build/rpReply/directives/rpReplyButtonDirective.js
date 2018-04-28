'use strict';

(function () {
	'use strict';

	angular.module('rpReply').directive('rpReplyButton', [rpReplyButton]);

	function rpReplyButton() {
		return {
			restrict: 'E',
			templateUrl: 'rpReply/views/rpReplyButton.html',
			controller: 'rpReplyButtonCtrl',
			scope: {
				parentCtrl: '='
			}
		};
	}
})();