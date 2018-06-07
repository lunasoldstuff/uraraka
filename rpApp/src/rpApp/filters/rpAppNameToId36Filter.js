(function () {
  'use strict';

  function rpAppNameToId36Filter() {
    return function (name) {
      return name.substr(3);
    };
  }

  angular.module('rpApp')
    .filter('rpAppNameToId36Filter', [rpAppNameToId36Filter]);
}());
