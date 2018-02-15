(function() {
	'use strict';

	angular.module('rpApp').factory('rpAppSettingsService', [
		'$rootScope',
		'rpSettingsResourceService',
		'rpToastService',
		rpAppSettingsService
	]);

	function rpAppSettingsService($rootScope, rpSettingsResourceService, rpToastService) {
		console.log('[rpAppSettingsService]');

		var rpAppSettingsService = {};

		/** @type {Object} default settings */
		rpAppSettingsService.settings = {
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
			listView: false
		};

		/**
		 * returns settings object
		 * @return {[type]} settings object
		 */
		rpAppSettingsService.getSettings = function() {
			console.log('[rpAppSettingsService] getSettings, settings: ' + JSON.stringify(rpAppSettingsService.settings));
			return rpAppSettingsService.settings;
		};

		/**
		 * sets settings and saves to server
		 * @param  {object} settings settingsDialog
		 */
		rpAppSettingsService.setSettings = function(settings) {
			console.log('[rpAppSettingsService] setSettings, settings: ' + JSON.stringify(rpAppSettingsService.settings));
			rpAppSettingsService.settings = settings;
			saveSettings();
		};

		/**
		 * sets a single settings and saves changes to server
		 * @param  {[type]} setting setting key
		 * @param  {[type]} value   setting value
		 */
		rpAppSettingsService.setSetting = function(setting, value) {
			console.log('[rpAppSettingsService] setSetting, setting: ' + setting + ', value: ' + value);
			rpAppSettingsService.settings[setting] = value;
			console.log('[rpAppSettingsService] setSetting, settings: ' + JSON.stringify(rpAppSettingsService.settings));
			saveSettings();
		};


		/**
		 * retrieves settings from the server
		 */
		function retrieveSettings() {
			rpSettingsResourceService.get(function(data) {
				console.log('[rpAppSettingsService] retrieveSettings, data: ' + JSON.stringify(data));
				if (data.loadDefaults !== true) {
					console.log('[rpAppSettingsService] retrieveSettings, using server settings');
					for (var setting in data) {
						rpAppSettingsService.settings[setting] = data[setting];
					}
				}

				console.log('[rpAppSettingsService] emit rp_settings_changed');
				$rootScope.$emit('rp_settings_changed');
			});
		};

		/**
		 * saves settings to the server
		 */
		function saveSettings() {
			// console.log('[rpAppSettingsService] saveSettings, attempting to save settings...');
			rpSettingsResourceService.save(rpAppSettingsService.settings, function(data) {
				console.log('[rpAppSettingsService] saveSettings, data: ' + JSON.stringify(data));
				rpToastService('settings saved', 'sentiment_satisfied');
				$rootScope.$emit('rp_settings_changed');
			});
		};

		/**
		 * disable premium features if the subscription status changes
		 */
		$rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
			if (!isSubscribed) {
				rpAppSettingsService.settings.listView = false;
				rpAppSettingsService.settings.darkTheme = false;
				saveSettings();
			}
		});

		//retieve user settings once authenticated. Otherwise defaults will be used.
		$rootScope.$on('authenticated', function() {
			retrieveSettings();
		});

		return rpAppSettingsService;
	}

})();