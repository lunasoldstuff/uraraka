(function () {
  'use strict';

  function rpSettingsService($rootScope, rpSettingsResourceService, rpToastService) {
    var deregisterOnAuthenticated;
    var settingsService;

    function saveSettings() {
      rpSettingsResourceService.save({
        settings: settingsService.getSettings()
      }, (data) => {
        console.log('[rpSettingsService] saveSettings, data: ' + JSON.stringify(data));
        rpToastService('settings saved', 'sentiment_satisfied');
        $rootScope.$emit('rp_settings_changed');
      });
    }

    function retrieveSettings() {
      rpSettingsResourceService.get((data) => {
        console.log('[rpSettingsService] retrieveSettings, data: ' + JSON.stringify(data));
        if (data.loadDefaults !== true) {
          console.log('[rpSettingsService] retrieveSettings, using server settings');
          // TODO: use spread operator, or setSettings() and use spread operator in setSettings.
          Object.keys(data)
            .forEach(setting => {
              settingsService.settings[setting] = data[setting];
            });
        }
        console.log('[rpSettingsService] emit rp_settings_changed');
        $rootScope.$emit('rp_settings_changed');
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
