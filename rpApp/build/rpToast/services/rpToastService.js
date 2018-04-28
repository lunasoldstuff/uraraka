'use strict';

(function () {
  'use strict';

  function rpToastService($mdToast) {
    return function (message, icon) {
      $mdToast.show({
        locals: {
          toastMessage: message,
          toastIcon: icon
        },
        controller: 'rpToastCtrl',
        templateUrl: 'rpToast/views/rpToast.html',
        hideDelay: 2500,
        position: 'bottom left'
      });
    };
  }
  angular.module('rpToast').factory('rpToastService', ['$mdToast', rpToastService]);
})();