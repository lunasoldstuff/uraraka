(function () {
  'use strict';

  function rpAppDescriptionService(
    $rootScope,
    $filter
  ) {
    let descriptionChangeService = {
      description: 'A new and exciting reddit web app. The most beautiful and advanced way to browse reddit online.',
      getDescription() {
        return descriptionChangeService.description;
      },
      changeDescription(newDescription) {
        if (newDescription === 'default') {
          descriptionChangeService.description =
            'A new and exciting reddit web app. The most beautiful and advanced way to browse reddit online.';
        } else {
          descriptionChangeService.description = $filter('limitTo')(newDescription, 200);
        }
      }
    };

    return descriptionChangeService;
  }

  angular.module('rpApp')
    .factory('rpAppDescriptionService', [
      '$rootScope',
      '$filter',
      rpAppDescriptionService
    ]);
}());
