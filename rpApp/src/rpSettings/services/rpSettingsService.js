(function () {
  'use strict';

  angular
    .module('rpApp')
    .factory('rpSettingsService', [
      '$rootScope',
      'rpSettingsResourceService',
      'rpToastService',
      rpSettingsService
    ]);

  function rpSettingsService($rootScope, rpSettingsResourceService, rpToastService) {
    var rpSettingsService = {};
    console.log('[rpSettingsService]');

    /** @type {Object} default settings */
    rpSettingsService.settings = {
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
    };

    /**
     * returns settings object
     * @return {[type]} settings object
     */
    rpSettingsService.getSettings = function () {
      console.log('[rpSettingsService] getSettings, settings: ' + JSON.stringify(rpSettingsService.settings));
      return rpSettingsService.settings;
    };

    /**
     * sets settings and saves to server
     * @param  {object} settings settingsDialog
     */
    rpSettingsService.setSettings = function (settings) {
      console.log('[rpSettingsService] setSettings, settings: ' + JSON.stringify(rpSettingsService.settings));
      rpSettingsService.settings = settings;
      saveSettings();
    };

    /**
     * sets a single settings and saves changes to server
     * @param  {[type]} setting setting key
     * @param  {[type]} value   setting value
     */
    rpSettingsService.setSetting = function (setting, value) {
      console.log('[rpSettingsService] setSetting, setting: ' + setting + ', value: ' + value);
      rpSettingsService.settings[setting] = value;
      console.log('[rpSettingsService] setSetting, settings: ' + JSON.stringify(rpSettingsService.settings));
      saveSettings();
    };

    /**
     * retrieves settings from the server
     */
    function retrieveSettings() {
      rpSettingsResourceService.get(function (data) {
        console.log('[rpSettingsService] retrieveSettings, data: ' + JSON.stringify(data));
        if (data.loadDefaults !== true) {
          console.log('[rpSettingsService] retrieveSettings, using server settings');
          for (var setting in data) {
            rpSettingsService.settings[setting] = data[setting];
          }
        }

        console.log('[rpSettingsService] emit rp_settings_changed');
        $rootScope.$emit('rp_settings_changed');
      });
    }

    /**
     * saves settings to the server
     */
    function saveSettings() {
      // console.log('[rpSettingsService] saveSettings, attempting to save settings...');
      rpSettingsResourceService.save(rpSettingsService.settings, function (data) {
        console.log('[rpSettingsService] saveSettings, data: ' + JSON.stringify(data));
        rpToastService('settings saved', 'sentiment_satisfied');
        $rootScope.$emit('rp_settings_changed');
      });
    }

    /**
     * disable premium features if the subscription status changes
     */
    $rootScope.$on('rp_plus_subscription_update', function (e, isSubscribed) {
      if (!isSubscribed) {
        rpSettingsService.settings.listView = false;
        rpSettingsService.settings.nightTheme = false;
        saveSettings();
      }
    });

    // retieve user settings once authenticated. Otherwise defaults will be used.
    $rootScope.$on('authenticated', function () {
      retrieveSettings();
    });

    return rpSettingsService;
  }
}());
