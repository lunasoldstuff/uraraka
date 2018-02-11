angular.module('rpApp').factory('rpSettingsUtilService', rpSettingsUtilService);

function rpSettingsUtilService($rootScope, rpSettingsResourceService, rpToastUtilService) {
	console.log('[rpSettingsUtilService]');

	var rpSettingsUtilService = {};

	/** @type {Object} default settings */
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

	/**
	 * returns settings object
	 * @return {[type]} settings object
	 */
	rpSettingsUtilService.getSettings = function() {
		console.log('[rpSettingsUtilService] getSettings, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
		return rpSettingsUtilService.settings;
	};

	/**
	 * sets settings and saves to server
	 * @param  {object} settings settingsDialog
	 */
	rpSettingsUtilService.setSettings = function(settings) {
		console.log('[rpSettingsUtilService] setSettings, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
		rpSettingsUtilService.settings = settings;
		saveSettings();
	};

	/**
	 * sets a single settings and saves changes to server
	 * @param  {[type]} setting setting key
	 * @param  {[type]} value   setting value
	 */
	rpSettingsUtilService.setSetting = function(setting, value) {
		console.log('[rpSettingsUtilService] setSetting, setting: ' + setting + ', value: ' + value);
		rpSettingsUtilService.settings[setting] = value;
		console.log('[rpSettingsUtilService] setSetting, settings: ' + JSON.stringify(rpSettingsUtilService.settings));
		saveSettings();
	};


	/**
	 * retrieves settings from the server
	 */
	function retrieveSettings() {
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

	/**
	 * saves settings to the server
	 */
	function saveSettings() {
		// console.log('[rpSettingsUtilService] saveSettings, attempting to save settings...');
		rpSettingsResourceService.save(rpSettingsUtilService.settings, function(data) {
			console.log('[rpSettingsUtilService] saveSettings, data: ' + JSON.stringify(data));
			rpToastUtilService('settings saved', 'sentiment_satisfied');
			$rootScope.$emit('rp_settings_changed');
		});
	};

	/**
	 * disable premium features if the subscription status changes
	 */
	$rootScope.$on('rp_plus_subscription_update', function(e, isSubscribed) {
		if (!isSubscribed) {
			rpSettingsUtilService.settings.listView = false;
			rpSettingsUtilService.settings.darkTheme = false;
			rpSettingsUtilService.saveSettings();
		}
	});

	//retieve user settings once authenticated. Otherwise defaults will be used.
	$rootScope.$on('authenticated', function() {
		retrieveSettings();
	});

	return rpSettingsUtilService;

}