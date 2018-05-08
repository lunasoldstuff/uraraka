(function () {
  'use strict';

  function rpSettingsService($rootScope, rpSettingsResourceService, rpToastService) {
    var deregisterOnAuthenticated;
    var settingsService;

    function saveSettings() {
      rpSettingsResourceService.save({
        settings: settingsService.settings
      }, (data) => {
        rpToastService('settings saved', 'sentiment_satisfied');
      });
    }

    function retrieveSettings() {
      rpSettingsResourceService.get((data) => {
        if (data.settings.loadDefaults !== true) {
          console.log('[rpSettingsService] retrieveSettings, using server settings');
          // TODO: use spread operator, or setSettings() and use spread operator in setSettings.
          Object.keys(data.settings)
            .forEach(setting => {
              settingsService.settings[setting] = data.settings[setting];
            });
        }
      });
    }

    settingsService = {
      settings: {
        over18: true,
        composeDialog: true,
        commentsDialog: true,
        submitDialog: true,
        settingsDialog: true,
        theme: 'default',
        animations: true,
        singleColumnLayout: true,
        fontSize: 'regular',
        slideshowTime: 5000,
        slideshowHeader: true,
        slideshowHeaderFixed: false,
        slideshowAutoplay: true,
        listView: false,
        nightTheme: false,
        layout: 'singleColumnLayout'
      },

      getSettings() {
        return this.settings;
      },

      setSettings(settings) {
        this.settings = settings;
        saveSettings();
      },

      setSetting(setting, value) {
        this.settings[setting] = value;
        saveSettings();
      }

    };

    deregisterOnAuthenticated = $rootScope.$on('authenticated', function () {
      retrieveSettings();
    });

    return settingsService;
  }

  angular
    .module('rpApp')
    .factory('rpSettingsService', [
      '$rootScope',
      'rpSettingsResourceService',
      'rpToastService',
      rpSettingsService
    ]);
}());
