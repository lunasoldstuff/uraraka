(function () {
  'use strict';

  function rpSettingsService($rootScope, rpSettingsResourceService, rpToastService) {
    console.log('[rpSettingsService]');

    return {
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
        this.saveSettings();
      },

      setSetting(setting, value) {
        this.settings[setting] = value;
        this.saveSettings();
      },

      saveSettings() {
        // console.log('[rpSettingsService] saveSettings, attempting to save settings...');
        rpSettingsResourceService.save(this.settings, function (data) {
          console.log('[rpSettingsService] saveSettings, data: ' + JSON.stringify(data));
          rpToastService('settings saved', 'sentiment_satisfied');
          $rootScope.$emit('rp_settings_changed');
        });
      },

      retrieveSettings() {
        rpSettingsResourceService.get(function (data) {
          console.log('[rpSettingsService] retrieveSettings, data: ' + JSON.stringify(data));
          if (data.loadDefaults !== true) {
            console.log('[rpSettingsService] retrieveSettings, using server settings');
            Object.keys(data)
              .forEach(setting => {
                this.settings[setting] = data[setting];
              });
          }
          console.log('[rpSettingsService] emit rp_settings_changed');
          $rootScope.$emit('rp_settings_changed');
        });
      }

    };
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
