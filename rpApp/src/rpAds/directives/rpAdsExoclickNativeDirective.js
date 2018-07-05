(function () {
  'use strict';

  function rpAdsExoclickNative() {
    return {
      restrict: 'E',
      templateUrl: 'rpAds/views/rpAdsExoclickNative.html',
      link: function (scope, element, attrs) {
        let scriptElem = angular.element(document.createElement('script'));
        scriptElem.attr('src', 'https://ads.exdynsrv.com/nativeads.js');
        scriptElem.attr('type', 'text/javascript');

        let position = attrs.position;
        if (position === 'right') {
          scriptElem.attr('data-idzone', '3055710');
        } else {
          scriptElem.attr('data-idzone', '3055336');
        }

        element.append(scriptElem);
      }
    };
  }

  angular.module('rpAds').directive('rpAdsExoclickNative', rpAdsExoclickNative);
}());
