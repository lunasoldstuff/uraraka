'use strict';

/* Controllers */

var rpControllers = angular.module('rpControllers', []);

/*
	Top level controller.
	controls sidenav toggling. (This might be better suited for the sidenav controller no?)
 */
rpControllers.controller('rpAppCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$mdSidenav',
    '$mdMedia',
    'rpAuthUtilService',
    'rpSettingsUtilService',

    function($scope, $rootScope, $timeout, $mdSidenav, $mdMedia, rpAuthUtilService, rpSettingsUtilService) {
        console.log('[rpAppCtrl] $scope.authenticated: ' + $scope.authenticated);

        $scope.isDocked = true;
        $scope.animations = rpSettingsUtilService.settings.animations;
        $scope.theme = rpSettingsUtilService.settings.theme;

        $rootScope.$on('rp_settings_changed', function() {
            $scope.theme = rpSettingsUtilService.settings.theme;
            $scope.animations = rpSettingsUtilService.settings.animations;

        });

        $scope.dynamicTheme = 'redTheme';

        var deregisterHandleTitleChange = $scope.$on('rp_title_change_page', function(e, title) {
            $scope.appTitle = 'reddup: ' + title;
        });

        $scope.setAuthentication = function(authenticated) {
            console.log('[rpAppCtrl] setAuthentication(), $scope.authenticated: ' + authenticated);

            $scope.authenticated = authenticated;
            rpAuthUtilService.setAuthenticated(authenticated);

        };

        $scope.sidenavIsOpen = function() {
            return $mdSidenav('left').isOpen();
        };

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        // $scope.toggleDocked = function() {
        // 	$scope.isDocked = !$scope.isDocked;
        // };

        $scope.close = function() {
            $mdSidenav('left').close();
        };

        $scope.isOpenRules = function() {
            return $mdSidenav('right').isOpen();
        };

        $scope.toggleRules = function() {
            $mdSidenav('right').toggle();
        };

        $scope.loadMoreClick = function() {
            $rootScope.$emit('rp_load_more');
        };

        $scope.suspendWatchers = function() {
            $rootScope.$emit('rp_suspendable_suspend');
        };

        $scope.restoreWatchers = function() {
            $rootScope.$emit('rp_suspendable_resume');
        };

        $scope.simpleSuspendWatchers = function() {
            $rootScope.$emit('rp_simple_suspendable_suspend');
        };

        $scope.simpleRestoreWatchers = function() {
            $rootScope.$emit('rp_simple_suspendable_restore');
        };

        // $scope.loadMoreComments = function() {
        // 	$rootScope.$emit('rp_load_more_comments');
        // };

        var deregisterRouteChangeSuccess = $scope.$on('$routeChangeSuccess', function() {
            console.log('[rpAppCtrl] $routeChangeSuccess');
            closeSidenavs();
        });


        // var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
        // 	closeSidenavs();
        // });

        function closeSidenavs() {
            if ($mdSidenav('left').isOpen()) {
                $mdSidenav('left').toggle();
            }

            if ($mdSidenav('right').isOpen()) {
                $mdSidenav('right').toggle();
            }
        }


        $scope.$on('$destroy', function() {
            deregisterHandleTitleChange();
            // deregisterLocationChangeSuccess();
            deregisterRouteChangeSuccess();
        });

    }
]);


rpControllers.controller('rpIdentitySidenavCtrl', ['$scope', '$timeout', 'rpIdentityUtilService', 'rpAuthUtilService',
    function($scope, $timeout, rpIdentityUtilService, rpAuthUtilService) {

        $scope.loading = true;

        rpIdentityUtilService.getIdentity(function(identity) {
            console.log('[rpIdentityCtrl] identity: ' + JSON.stringify(identity));
            $scope.identity = identity;
            $scope.loading = false;
            $timeout(angular.noop, 0);

        });

    }
]);

rpControllers.controller('rpLoginSidenavCtrl', ['$scope', '$location',
    function($scope, $location) {

        $scope.safePath = encodeURIComponent($location.path());
        console.log('[rpLoginCtrl] $scope.safePath: ' + $scope.safePath);

        var deregisterRouteUpdate = $scope.$on('$locationChangeSuccess', function() {
            $scope.safePath = encodeURIComponent($location.path());
            console.log('[rpLoginCtrl] onLocationChangeSuccess, $scope.safePath: ' + $scope.safePath);
        });

        $scope.$on('$destroy', function() {
            deregisterRouteUpdate();
        });

    }
]);

/*
	Sidenav Subreddits Controller
	Gets popular subreddits.
 */
rpControllers.controller('rpSubredditsSidenavCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    '$q',
    '$mdSidenav',
    'rpSubredditsUtilService',
    'rpLocationUtilService',
    '$compile',
    function(
        $scope,
        $rootScope,
        $timeout,
        $q,
        $mdSidenav,
        rpSubredditsUtilService,
        rpLocationUtilService,
        $compile
    ) {

        $scope.subs = [];
        $scope.isOpen = false;

        $scope.toggleOpen = function() {
            // $timeout(function() {
            //     $scope.isOpen = !$scope.isOpen;
            //
            // }, 150);
            $scope.isOpen = !$scope.isOpen;

        };

        $scope.pinnedSubs = [{
            name: 'frontpage',
            url: '/'
        }, {
            name: 'all',
            url: '/r/all/'
        }, {
            name: 'random',
            url: '/r/random/'
        }, {
            name: 'reddupco',
            url: '/r/reddupco'
        }];

        // rpSubredditsUtilService.updateSubreddits(function(err, data) {
        // 	if (err) {
        // 		console.log('[rpSubredditsCtrl] err');
        // 	} else {
        //
        // 	}
        // });

        var deregisterSubredditsUpdated = $rootScope.$on('subreddits_updated', function() {
            $scope.subs = rpSubredditsUtilService.subs;
            // $scope.subs = {};
            // addSubsInBatches(rpSubredditsUtilService.subs, 10);
        });

        function addBatch(first, last, subs) {
            console.log('[rpSubredditsCtrl] addBatch(), first: ' + first + ', last: ' + last + ', $scope.subs.length: ' + $scope.subs.length);

            if ($scope.subs.length > 0) {
                $scope.subs = Array.prototype.concat.apply($scope.subs, subs.slice(first, last));
            } else {
                $scope.subs = subs.slice(first, last);
            }

            return; //$timeout(angular.noop, 0);
        }

        function addSubsInBatches(subs, batchSize) {
            console.log('[rpSubredditsCtrl] addSubsInBatches(), subs.length: ' + subs.length + ', batchSize: ' + batchSize);
            var addNextBatch;
            var addSubsAndRender = $q.when();

            for (var i = 0; i < subs.length; i += batchSize) {
                addNextBatch = angular.bind(null, addBatch, i, Math.min(i + batchSize, subs.length), subs);
                addSubsAndRender = addSubsAndRender.then(addNextBatch);

            }

            return addSubsAndRender;
        }

        $scope.openSubreddit = function(e, url) {
            console.log('[rpSubredditsCtrl] openSubreddit, url: ' + url);
            $timeout(function() {
                rpLocationUtilService(e, url, '', true, false);

            }, 350);
        };

        $scope.$on('$destroy', function() {
            deregisterSubredditsUpdated();
        });
    }
]);

rpControllers.controller('rpToastCtrl', ['$scope', '$rootScope', '$mdToast', 'toastMessage', 'toastIcon',
    function($scope, $rootScope, $mdToast, toastMessage, toastIcon) {
        $scope.toastMessage = toastMessage;
        $scope.toastIcon = toastIcon;

        $scope.closeToast = function() {
            $mdToast.close();
        };

    }
]);

// rpControllers.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
//   $scope.close = function() {
// 	$mdSidenav('left').close();
//   };
// });

/*
	Toolbar controller handles title change through titleService.
 */
rpControllers.controller('rpToolbarCtrl', [
    '$scope',
    '$rootScope',
    '$log',
    '$element',
    '$timeout',
    'rpPostFilterButtonUtilService',
    'rpUserFilterButtonUtilService',
    'rpUserSortButtonUtilService',
    'rpSearchFormUtilService',
    'rpSearchFilterButtonUtilService',
    'rpSidebarButtonUtilService',
    'rpToolbarShadowUtilService',
    'rpLocationUtilService',
    'rpRefreshButtonUtilService',

    function(
        $scope,
        $rootScope,
        $log,
        $element,
        $timeout,
        rpPostFilterButtonUtilService,
        rpUserFilterButtonUtilService,
        rpUserSortButtonUtilService,
        rpSearchFormUtilService,
        rpSearchFilterButtonUtilService,
        rpSidebarButtonUtilService,
        rpToolbarShadowUtilService,
        rpLocationUtilService,
        rpRefreshButtonUtilService

    ) {

        /*
        	SEARCH TOOLBAR
         */

        $scope.linkTitle = false;
        $scope.showToolbar = false;
        $scope.colorLoaded = false;
        $scope.count = 0;
        $scope.showToolbarShadow = rpToolbarShadowUtilService.showToolbarShadow;

        var subredditRe = /r\/[\w]+/;
        var userRe = /u\/[\w]+/;

        $timeout(function() {
            $scope.showToolbar = true;
        }, 0);

        var deregisterShowToolbarShadowChange = $scope.$on('show_toolbar_shadow_change', function() {
            $scope.showToolbarShadow = rpToolbarShadowUtilService.showToolbarShadow;
        });

        var deregisterHandleTitleChange = $scope.$on('rp_title_change_toolbar', function(e, title) {
            console.log('[rpToolbarCtrl] handleTitleChange(), title: ' + title);

            $scope.toolbarTitle = title;
            $scope.linkTitle = subredditRe.test(title) || userRe.test(title);

            console.log('[rpToolbarCtrl] handleTitleChange(), $scope.linkTitle: ' + $scope.linkTitle);

        });

        $scope.brandLink = function(e) {
            // console.log('[rpToolbarCtrl] brandLink(), e.data("events"): ' + e.data("events"));
            rpLocationUtilService(e, '/', '', true, true);
        };

        /*
        	Show the filter button.
         */
        $scope.showPostFilter = rpPostFilterButtonUtilService.isVisible;

        var deregisterPostFilterButtonVisibility = $rootScope.$on('post_filter_button_visibility', function() {
            $scope.showPostFilter = rpPostFilterButtonUtilService.isVisible;
        });

        $scope.showUserFilter = rpUserFilterButtonUtilService.isVisible;

        var deregisterUserFilterButtonVisibility = $rootScope.$on('user_filter_button_visibility', function() {
            $scope.showUserFilter = rpUserFilterButtonUtilService.isVisible;
        });

        $scope.showUserSort = rpUserSortButtonUtilService.isVisible;

        var deregisterUserSortButtonVisibility = $rootScope.$on('user_sort_button_visibility', function() {
            $scope.showUserSort = rpUserSortButtonUtilService.isVisible;
        });

        $scope.showSearchFilter = rpSearchFilterButtonUtilService.isVisible;

        var deregisterSearchFilterButtonVisibility = $rootScope.$on('search_filter_button_visibility', function() {
            $scope.showSearchFilter = rpSearchFilterButtonUtilService.isVisible;
        });

        $scope.showRules = rpSidebarButtonUtilService.isVisible;

        var deregisterRulesButtonVisibility = $rootScope.$on('rules_button_visibility', function() {
            $scope.showRules = rpSidebarButtonUtilService.isVisible;
        });

        $scope.showRefresh = rpRefreshButtonUtilService.isVisible;

        var deregisterRefreshButtonVisibility = $rootScope.$on('refresh_button_visibility', function() {
            $scope.showRefresh = rpRefreshButtonUtilService.isVisible;
        });

        $scope.spinRefresh = rpRefreshButtonUtilService.spin;

        var deregisterRefreshButtonSpin = $rootScope.$on('refresh_button_spin', function() {
            $scope.spinRefresh = rpRefreshButtonUtilService.spin;
        });

        /*
        	SEARCH
         */

        $scope.toggleSearchForm = function() {
            $scope.showSearchForm = !$scope.showSearchForm;

        };

        $scope.showSearchForm = rpSearchFormUtilService.isVisible;

        var deregisterSearchFormUtilService = $rootScope.$on('search_form_visibility', function() {
            // $scope.showSearchForm = rpSearchFormUtilService.isVisible;
        });

        var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {
            $scope.colorLoaded = true;
            deregisterSettingsChanged();
        });

        $scope.$on('$destroy', function() {
            deregisterShowToolbarShadowChange();
            deregisterSearchFormUtilService();
            deregisterPostFilterButtonVisibility();
            deregisterUserFilterButtonVisibility();
            deregisterUserSortButtonVisibility();
            deregisterSearchFilterButtonVisibility();
            deregisterRulesButtonVisibility();
            deregisterHandleTitleChange();
            deregisterSettingsChanged();
            deregisterRefreshButtonVisibility();
            deregisterRefreshButtonSpin();
        });

    }
]);

rpControllers.controller('rpSubscribeCtrl', ['$scope', '$rootScope', '$timeout', 'rpSubredditsUtilService', 'rpSubscribeButtonUtilService',
    function($scope, $rootScope, $timeout, rpSubredditsUtilService, rpSubscribeButtonUtilService) {
        console.log('[rpSubscribeCtrl] loaded');

        $scope.subscribed = rpSubredditsUtilService.subscribed;
        $scope.loadingSubscription = false;

        $scope.toggleSubscription = function() {
            console.log('[rpSubscribeCtrl] toggleSubscription');
            $scope.loadingSubscription = true;
            $timeout(angular.noop, 0);

            rpSubredditsUtilService.subscribeCurrent(function(err, data) {
                if (err) {
                    console.log('[rpSubscribeCtrl] err');
                } else {

                }
            });

        };

        $scope.showSubscribe = rpSubscribeButtonUtilService.isVisible;

        var deregisterSubscribeVisibility = $rootScope.$on('subscribe_visibility', function() {
            $scope.showSubscribe = rpSubscribeButtonUtilService.isVisible;
        });

        var deregisterSubscriptionStatusChanged = $rootScope.$on('subscription_status_changed', function(e, subscribed) {
            console.log('[rpSubscribeCtrl] on subscription_status_changed, subscribed: ' + subscribed);

            if ($scope.loadingSubscription) {
                $scope.loadingSubscription = false;
                $timeout(angular.noop, 0);

            }

            $scope.subscribed = subscribed;

        });

        $scope.$on('$destroy', function() {
            deregisterSubscriptionStatusChanged();
            deregisterSubscribeVisibility();
        });

    }
]);

rpControllers.controller('rpErrorCtrl', ['$scope', '$rootScope', '$routeParams', 'rpSubscribeButtonUtilService',
    'rpTitleChangeUtilService',
    function($scope, $rootScope, $routeParams, rpSubscribeButtonUtilService, rpTitleChangeUtilService) {

        $rootScope.$emit('rp_progress_stop');
        rpSubscribeButtonUtilService.hide();
        rpTitleChangeUtilService('oops', true, true);

        $scope.errorCode = parseInt($routeParams.errorcode) || 404;

        console.log('[rpErrorCtrl] $scope.errorCode: ' + $scope.errorCode);

        if ($scope.errorCode === 404) {
            $scope.message = "Did not find the page you're looking four-oh-four.";
        } else if ($scope.errorCode === 403) {
            $scope.message = "Page is forbidden :/ Maybe you have to message the mods for permission.";
        } else {
            $scope.message = "Oops an error occurred.";
        }

    }
]);

rpControllers.controller('rpSidebarCtrl', ['$scope', '$rootScope', 'rpSubredditsUtilService',
    function($scope, $rootScope, rpSubredditsUtilService) {

        $scope.about = rpSubredditsUtilService.about.data;

        var deregisterSubredditsAboutUpdated = $rootScope.$on('subreddits_about_updated', function() {
            console.log('[rpSidebarCtrl] subreddits_about_updated');
            $scope.about = rpSubredditsUtilService.about.data;

        });

        $scope.$on('$destroy', function() {
            deregisterSubredditsAboutUpdated();
        });

    }
]);

rpControllers.controller('rpFormattingCtrl', ['$scope',
    function($scope) {

        $scope.formattingIsOpen = false;

        $scope.toggleFormatting = function(e) {
            console.log('[rpFormattingCtrl] toggleFormatting()');
            $scope.formattingIsOpen = !$scope.formattingIsOpen;

        };

    }
]);

rpControllers.controller('rpSpeedDialCtrl', [
    '$scope',
    '$rootScope',
    '$mdDialog',
    'rpAuthUtilService',
    'rpToastUtilService',
    'rpSettingsUtilService',
    'rpLocationUtilService',

    function(
        $scope,
        $rootScope,
        $mdDialog,
        rpAuthUtilService,
        rpToastUtilService,
        rpSettingsUtilService,
        rpLocationUtilService
    ) {

        console.log('[rpSpeedDialCtrl] load.');

        $scope.isOpen = false;
        $scope.direction = "up";

        $scope.open = function() {
            if ($scope.isOpen === false) {
                $scope.isOpen = true;
            }
        };

        $scope.collapse = function() {
            if ($scope.isOpen === true) {
                $scope.isOpen = false;
            }
        };

        var search = "";

        $scope.newLink = function(e) {
            if (rpAuthUtilService.isAuthenticated) {

                if (rpSettingsUtilService.settings.submitDialog) {
                    $mdDialog.show({
                        controller: 'rpSubmitDialogCtrl',
                        templateUrl: 'rpSubmitLinkDialog.html',
                        targetEvent: e,
                        locals: {
                            subreddit: $scope.subreddit
                        },
                        clickOutsideToClose: true,
                        escapeToClose: false

                    });

                } else {
                    if ($scope.subreddit) {
                        search = 'sub=' + $scope.subreddit;
                    }
                    console.log('[rpPostFabCtrl] submit link page, search: ' + search);
                    rpLocationUtilService(null, '/submitLink', search, true, false);
                }


                $scope.fabState = 'closed';

            } else {
                $scope.fabState = 'closed';
                rpToastUtilService("you must log in to submit a link", "sentiment_neutral");
            }
        };

        $scope.newText = function(e) {

            if (rpAuthUtilService.isAuthenticated) {

                if (rpSettingsUtilService.settings.submitDialog) {
                    $mdDialog.show({
                        controller: 'rpSubmitDialogCtrl',
                        templateUrl: 'rpSubmitTextDialog.html',
                        targetEvent: e,
                        locals: {
                            subreddit: $scope.subreddit
                        },
                        clickOutsideToClose: true,
                        escapeToClose: false

                    });

                } else {
                    if ($scope.subreddit) {
                        search = 'sub=' + $scope.subreddit;
                    }
                    console.log('[rpPostFabCtrl] submit text page, search: ' + search);
                    rpLocationUtilService(null, '/submitText', search, true, false);

                }

                $scope.fabState = 'closed';

            } else {
                $scope.fabState = 'closed';
                rpToastUtilService("you must log in to submit a self post", "sentiment_neutral");
            }
        };

        $scope.$on('$destroy', function() {});


    }
]);


rpControllers.controller('rpRefreshButtonCtrl', ['$scope', '$rootScope',
    function($scope, $rootScope) {
        console.log('[rpRefreshButtonCtrl] load');
        $scope.refresh = function() {
            console.log('[rpRefreshButtonCtrl] refresh()');
            $rootScope.$emit('rp_refresh');
        };
    }
]);

rpControllers.controller('rpDialogCloseButtonCtrl', ['$scope', '$mdDialog', '$mdBottomSheet',
    function($scope, $mdDialog, $mdBottomSheet) {
        console.log('[rpDialogCloseButtonCtrl] load');
        $scope.closeDialog = function(e) {
            $mdDialog.hide();
            $mdBottomSheet.hide();
        };
    }
]);
