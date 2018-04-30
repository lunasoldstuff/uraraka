(function () {
  'use strict';

  function rpAppHijackRedditLinkFilter() {
    return function (_url) {
      // Fix links for reddituploads
      var redditUploadRe = /^https?:\/\/(?:i\.){1}(?:redditmedia|reddituploads){1}(?:.com){1}/i;
      var redditRe = /^(?:https?:\/\/)?(?:www\.)?(?:np\.)?(?:(?:reddit\.com)|(\/?r\/)|(\/?u\/)){1,2}([\S]+)?$/i;
      var ampRe = /amp;/g;
      var i;
      let url = _url;

      if (redditUploadRe.test(url)) {
        url = url.replace(ampRe, '');
      }

      if (redditRe.test(url)) {
        let groups = redditRe.exec(url);
        let newUrl = '';

        for (i = 1; i < groups.length; i++) {
          if (groups[i] !== undefined) {
            newUrl += groups[i];
          }
        }

        return newUrl;
      }
      return url;
    };
  }

  angular.module('rpApp')
    .filter('rpAppHijackRedditLinkFilter', [rpAppHijackRedditLinkFilter]);
}());
