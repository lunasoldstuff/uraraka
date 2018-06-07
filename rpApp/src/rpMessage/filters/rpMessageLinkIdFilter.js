(function () {
  'use strict';

  function rpMessageLinkIdFilter() {
    return function (link) {
      if (link) {
        const LINK_ID_RE = /^\/r\/(?:[\w]+)\/comments\/([\w]+)/i;
        let groups = LINK_ID_RE.exec(link);

        return groups[1];
      }
      return 0;
    };
  }

  angular.module('rpMessage')
    .filter('rpMessageLinkIdFilter', [rpMessageLinkIdFilter]);
}());
