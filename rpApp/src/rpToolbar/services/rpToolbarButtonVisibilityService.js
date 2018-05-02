(function () {
  'use strict';

  function rpToolbarButtonVisibilityService($rootScope) {
    var toolbarButtonVisibilityService = {
      visibilitySettings: {
        showPostTime: false,
        showPostSort: false,
        showUserWhere: false,
        showUserTime: false,
        showUserSort: false,
        showSearchTime: false,
        showRules: false,
        showRefresh: false,
        showSearchSort: false,
        showArticleSort: false,
        showMessageWhere: false,
        showLayout: false,
        showSlideshow: false
      },

      hideAll() {
        Object.keys(this.visibilitySettings)
          .forEach(key => {
            this.visibilitySettings[key] = false;
          });
      },

      showButton(button) {
        this.visibilitySettings[button] = true;
      },

      hideButton(button) {
        this.visibilitySettings[button] = false;
      }
    };

    return toolbarButtonVisibilityService;
  }

  angular
    .module('rpToolbar')
    .factory('rpToolbarButtonVisibilityService', ['$rootScope', rpToolbarButtonVisibilityService]);
}());
