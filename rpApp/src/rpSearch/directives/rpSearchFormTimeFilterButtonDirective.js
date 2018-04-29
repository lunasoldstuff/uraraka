(function () {
  'use strict';

  function rpSearchFormTimeFilterButton() {
    return {
      restrict: 'A',

      link: function (scope, element, attrs) {
        var select = attrs.rpSearchFormTimeFilterButton;
        console.log('[rpSearchFormTimeFilterButton] select: ' + select);

        element.click(function () {
          console.log('[rpSearchFormTimeFilterButton] click()');
          console.log('[rpSearchFormTimeFilterButton] click(), select: ' + select);
          angular.element(select).trigger('click');
        });
      }
    };
  }
  angular
    .module('rpSearch')
    .directive('rpSearchFormTimeFilterButton', [rpSearchFormTimeFilterButton]);
}());
