angular.module('rpApp').factory('rpSettingsUtilService', rpSettingsUtilService);

function rpSettingsUtilService($rootScope, rpSettingsResourceService, rpToastUtilService) {
	console.log('[rpSettingsUtilService]');

	var rpSettingsUtilService = {};

	/*
		Initial Settings, define the default settings.
	 */
	rpSettingsUtilService.settings = {
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

	/*
		Public Methods for App.
	 */
	rpSettingsUtilService.getSettings = function() {
		console.log('[rpSettingsUtilService] getSettings, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
		return rpSettingsUtilService.settings;
	};

	rpSettingsUtilService.setSettings = function(settings) {
		console.log('[rpSettingsUtilService] setSettings, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
		rpSettingsUtilService.settings = settings;
		rpSettingsUtilService.saveSettings();
	};

	rpSettingsUtilService.setSetting = function(setting, value) {
		console.log('[rpSettingsUtilService] setSetting, setting: ' + setting + ', value: ' + value);
		rpSettingsUtilService.settings[setting] = value;
		console.log('[rpSettingsUtilService] setSetting, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
		rpSettingsUtilService.saveSettings();
	};

	/*
		Server Communication.
	 */
	rpSettingsUtilService.retrieveSettings = function() {
		rpSettingsResourceService.get(function(data) {
			console.log('[rpSettingsUtilService] retrieveSettings, data: ' + JSON.stringify(data));

			if (data.loadDefaults !== true) {
				console.log('[rpSettingsUtilService] retrieveSettings, using server settings');

				for (var setting in data) {
					rpSettingsUtilService.settings[setting] = data[setting];
				}
			}

			console.log('[rpSettingsUtilService] emit rp_settings_changed');

			$rootScope.$emit('rp_settings_changed');
		});
	};

	rpSettingsUtilService.saveSettings = function() {
		// console.log('[rpSettingsUtilService] saveSettings, attempting to save settings...');
		rpSettingsResourceService.save(rpSettingsUtilService.settings, function(data) {
			console.log('[rpSettingsUtilService] saveSettings, data: ' + JSON.stringify(data));
			// rpToastUtilService('settings saved', 'sentiment_satisfied');
		});
		$rootScope.$emit('rp_settings_changed');
	};

	$rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
		if (!isSubscribed) {
			resetPlusSettings();
		}
	});

	function resetPlusSettings() {
		rpSettingsUtilService.settings.listView = false;
		rpSettingsUtilService.settings.darkTheme = false;
		rpSettingsUtilService.saveSettings();
	}

	$rootScope.$on('authenticated', function() {
		rpSettingsUtilService.retrieveSettings();
	});

	return rpSettingsUtilService;

}