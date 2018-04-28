'use strict';

(function () {
				'use strict';

				angular.module('rpApp').filter('rpAppHijackRedditLinkFilter', [rpAppHijackRedditLinkFilter]);

				function rpAppHijackRedditLinkFilter() {
								return function (url) {
												//Fix links for reddituploads

												var redditUploadRe = /^https?:\/\/(?:i\.){1}(?:redditmedia|reddituploads){1}(?:.com){1}/i;
												var ampRe = /amp;/g;

												if (redditUploadRe.test(url)) {
																url = url.replace(ampRe, '');
												}

												var redditRe = /^(?:https?:\/\/)?(?:www\.)?(?:np\.)?(?:(?:reddit\.com)|(\/?r\/)|(\/?u\/)){1,2}([\S]+)?$/i;

												var isRedditLink = redditRe.test(url);

												if (isRedditLink) {

																// console.log('[rpFilters rpAppHijackRedditLinkFilter] url: ' + url);

																var groups = redditRe.exec(url);

																// console.log('[rpFilters rpAppHijackRedditLinkFilter] groups: ' + groups.length + ' [' + groups.toString() + ']');

																var newUrl = "";

																for (var i = 1; i < groups.length; i++) {
																				if (groups[i] !== undefined) newUrl += groups[i];
																}

																// console.log('[rpFilters rpAppHijackRedditLinkFilter] newUrl: ' + newUrl);

																return newUrl;
												} else {
																return url;
												}
								};
				}
})();