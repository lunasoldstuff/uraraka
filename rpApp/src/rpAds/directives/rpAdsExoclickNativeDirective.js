(function () {
  'use strict';

  function rpAdsExoclickNative() {
    return {
      restrict: 'E',
      templateUrl: 'rpAds/views/rpAdsExoclickNative.html',
      link: function (scope, element, attrs) {
        let scriptElem = angular.element(document.createElement('script'));
        scriptElem.attr('src', 'https://ads.exdynsrv.com/nativeads.js');
        scriptElem.attr('data-idzone', '3055336');
        scriptElem.attr('type', 'text/javascript');
        element.append(scriptElem);
      }
    };
  }

  angular.module('rpAds').directive('rpAdsExoclickNative', rpAdsExoclickNative);
}());
