(function () {
  'use strict';

  function rpSettingsService(
    $rootScope,
    rpSettingsResourceService,
    rpToastService
  ) {
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
          Object.keys(data.settings)
            .forEach(setting => {
              settingsService.settings[setting] = data.settings[setting];
            });
        }
      });
    }

    settingsService = {
      settings: {
        over18: false,
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
        return settingsService.settings;
      },

      getSetting(setting) {
        return settingsService.settings[setting];
      },

      setSettings(settings) {
        Object.keys(settings)
          .forEach((key) => {
            settingsService[key] = settings[key];
          });
        saveSettings();
      },

      setSetting(setting, value) {
        settingsService.settings[setting] = value;
        saveSettings();
      }

    };

    retrieveSettings();

    return settingsService;
  }

  angular
    .module('rpSettings')
    .factory('rpSettingsService', [
      '$rootScope',
      'rpSettingsResourceService',
      'rpToastService',
      rpSettingsService
    ]);
}());
