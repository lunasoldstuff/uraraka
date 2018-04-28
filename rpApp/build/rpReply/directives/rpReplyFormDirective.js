'use strict';

(function () {
	'use strict';

	angular.module('rpReply').directive('rpReplyForm', [rpReplyForm]);

	function rpReplyForm() {
		return {
			restrict: 'E',
			templateUrl: 'rpReply/views/rpReplyForm.html',
			controller: 'rpReplyFormCtrl',
			scope: {
				redditId: '=',
				parentCtrl: '=',
				post: '='

			}
		};
	}
})();