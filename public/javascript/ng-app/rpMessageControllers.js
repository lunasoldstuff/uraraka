'use strict';

var rpMessageControllers = angular.module('rpMessageControllers', []);

rpMessageControllers.controller('rpMessageCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$timeout',
    'rpMessageUtilService',
    'rpIdentityUtilService',
    'rpTitleChangeService',
    'rpPostFilterButtonUtilService',
    'rpUserFilterButtonUtilService',
    'rpUserSortButtonUtilService',
    'rpSubscribeButtonUtilService',
    'rpSearchFormUtilService',
    'rpSearchFilterButtonUtilService',
    'rpToolbarShadowUtilService',
    'rpReadAllMessagesUtilService',
    'rpLocationUtilService',
    'rpSidebarButtonUtilService',
    'rpSettingsUtilService',
    'rpReadMessageUtilService',

    function(
        $scope,
        $rootScope,
        $routeParams,
        $timeout,
        rpMessageUtilService,
        rpIdentityUtilService,
        rpTitleChangeService,
        rpPostFilterButtonUtilService,
        rpUserFilterButtonUtilService,
        rpUserSortButtonUtilService,
        rpSubscribeButtonUtilService,
        rpSearchFormUtilService,
        rpSearchFilterButtonUtilService,
        rpToolbarShadowUtilService,
        rpReadAllMessagesUtilService,
        rpLocationUtilService,
        rpSidebarButtonUtilService,
        rpSettingsUtilService,
        rpReadMessageUtilService

    ) {

        /*
        	UI Stuff
         */
        rpPostFilterButtonUtilService.hide();
        rpSubscribeButtonUtilService.hide();
        rpUserFilterButtonUtilService.hide();
        rpUserSortButtonUtilService.hide();
        rpSearchFormUtilService.hide();
        rpSearchFilterButtonUtilService.hide();
        rpToolbarShadowUtilService.hide();
        rpSidebarButtonUtilService.hide();

        var loadingMore = false;

        $scope.noMorePosts = false;
        var limit = 25;

        /*
        	Changing the tab delayed until we have checked identity
        	for new messages.
        	Set to some arbitrary value 'nothing' to stop it showing the
        	tab that we were previously on before navigating away from messages.
         */

        rpTitleChangeService.prepTitleChange('Messages');

        var where = $routeParams.where || 'inbox';

        var tabs = [{
                label: 'all',
                value: 'inbox'
            }, {
                label: 'unread',
                value: 'unread'
            }, {
                label: 'messages',
                value: 'messages'
            }, {
                label: 'comment replies',
                value: 'comments'
            }, {
                label: 'post replies',
                value: 'selfreply'
            }, {
                label: 'username mentions',
                value: 'mentions'
            }

        ];

        $rootScope.$emit('rp_tabs_changed', tabs);
        $rootScope.$emit('rp_tabs_show');

        console.log('[rpMessageCtrl] where: ' + where);

        $rootScope.$emit('progressLoading');

        rpIdentityUtilService.reloadIdentity(function(data) {
            $scope.identity = data;
            $scope.hasMail = $scope.identity.has_mail;

            console.log('[rpMessageCtrl] $scope.identity: ' + JSON.stringify($scope.identity));
            console.log('[rpMessageCtrl] $scope.hasMail: ' + $scope.hasMail);

            if ($scope.hasMail && where !== 'unread') {
                where = 'unread';
                rpLocationUtilService(null, '/message/' + where, '', false, true);
            }

            console.log('[rpMessageCtrl] where: ' + where);

            for (var i = 0; i < tabs.length; i++) {
                if (where === tabs[i].value) {
                    $rootScope.$emit('rp_tabs_selected_index_changed', i);
                    break;
                }
            }

            loadPosts();

        });


        /**
         * EVENT HANDLERS
         */
        var deregisterTabClick = $rootScope.$on('rp_tab_click', function(e, tab) {
            console.log('[rpMessageCtrl] on rp_tab_click, tab: ' + tab);

            where = tab;
            rpLocationUtilService(null, '/message/' + where, '', false, false);
            loadPosts();
            console.log('[rpMessageCtrl] this.tabClick, ignored first tab click...');


        });

        /**
         * CONTROLLER API
         */

        $scope.thisController = this;

        /**
         * SCOPE FUNCTIONS
         * */

        $scope.morePosts = function() {

            console.log('[rpMessageCtrl] morePosts()');

            if ($scope.messages && $scope.messages.length > 0) {

                var lastMessageName = $scope.messages[$scope.messages.length - 1].data.name;

                if (lastMessageName && !loadingMore) {
                    loadingMore = true;
                    $rootScope.$emit('progressLoading');

                    rpMessageUtilService(where, lastMessageName, limit, function(err, data) {
                        $rootScope.$emit('progressComplete');

                        if (err) {
                            console.log('[rpMessageUtilService] err');
                        } else {
                            // console.log('[rpMessageCtrl] data: ' + JSON.stringify(data));
                            $scope.noMorePosts = data.get.data.children.length < 25;

                            Array.prototype.push.apply($scope.messages, data.get.data.children);
                            loadingMore = false;

                        }

                    });
                }
            }
        };

        function loadPosts() {
            $scope.messages = {};
            $scope.havePosts = false;
            $scope.hasMail = false;
            $scope.noMorePosts = false;

            $rootScope.$emit('progressLoading');

            rpMessageUtilService(where, '', limit, function(err, data) {
                $rootScope.$emit('progressComplete');
                console.log('[rpMessageCtrl] received message data, data.get.data.children.length: ' + data.get.data.children.length);

                if (err) {
                    console.log('[rpMessageUtilService] err');
                } else {
                    $scope.noMorePosts = data.get.data.children.length < limit;
                    $scope.messages = data.get.data.children;
                    $timeout(angular.noop, 0);

                    $scope.havePosts = true;

                    // if viewing unread messages set them to read.
                    if (where === "unread") {

                        console.log('[rpMessageControllers] unread messages, set to read');

                        var messageIdArray = [];

                        for (var i = 0; i < $scope.messages.length; i++) {
                            console.log('[rpMessageCtrl] read_message, $scope.messages[i].data.name: ' + $scope.messages[i].data.name);
                            messageIdArray.push($scope.messages[i].data.name);
                        }

                        var message = messageIdArray.join(', ');

                        console.log('[rpMessageCtrl] message: ' + message);

                        rpReadMessageUtilService(message, function(data) {
                            if (err) {
                                console.log('[rpMessageCtrl] err');
                            } else {
                                console.log('[rpMessageCtrl] all messages read.');
                                $scope.hasMail = false;
                                $rootScope.$emit('rp_messages_read');
                            }
                        });

                        // rpReadAllMessagesUtilService(function(err, data) {
                        //
                        // 	if (err) {
                        // 		console.log('[rpMessageCtrl] err');
                        // 	} else {
                        // 		console.log('[rpMessageCtrl] all messages read.');
                        // 		$scope.hasMail = false;
                        // 		$rootScope.$emit('rp_messages_read');
                        // 	}
                        // });
                    }

                }


            });
        }

        $scope.$on('$destroy', function() {
            console.log('[rpMessageCtrl] $destroy()');
            deregisterTabClick();
            $rootScope.$emit('rp_tabs_hide');

        });

    }
]);

rpMessageControllers.controller('rpMessageCommentCtrl', ['$scope', '$filter', '$mdDialog', 'rpIdentityUtilService',
    'rpLocationUtilService',
    function($scope, $filter, $mdDialog, rpIdentityUtilService, rpLocationUtilService) {

        if ($scope.identity) {
            console.log('[rpMessageCommentCtrl] $scope.identity.name: ' + $scope.identity.name);

        }


        // rpIdentityUtilService.getIdentity(function(data) {
        // 	$scope.identity = data;
        // });

        $scope.childDepth = $scope.depth + 1;

        $scope.isReplying = false;

        /**
         * CONTROLLER API
         * */

        $scope.thisController = this;

        this.completeReplying = function(data, post) {
            console.log('[rpMessageCommentCtrl] this.completeReplying(), $scope.message.kind: ' + $scope.message.kind);

            this.isReplying = false;

            if ($scope.message.kind === 't1') {
                $scope.comments = data.json.data.things;

            } else if ($scope.message.kind === 't4') {

                if (!$scope.message.data.replies) {

                    $scope.message.data.replies = {
                        data: {
                            children: data.json.data.things
                        }
                    };

                } else {
                    $scope.message.data.replies.data.children.push(data.json.data.things[0]);
                }

            }

        };

    }
]);

rpMessageControllers.controller('rpMessageSidenavCtrl', ['$scope', '$rootScope', '$mdDialog', 'rpSettingsUtilService', 'rpLocationUtilService', 'rpIdentityUtilService',
    function($scope, $rootScope, $mdDialog, rpSettingsUtilService, rpLocationUtilService, rpIdentityUtilService) {

        $scope.isOpen = false;

        $scope.toggleOpen = function() {
            $scope.isOpen = !$scope.isOpen;
        };

        $scope.hasMail = false;

        rpIdentityUtilService.getIdentity(function(data) {
            $scope.hasMail = data.has_mail;

        });

        $scope.showCompose = function(e) {

            if (rpSettingsUtilService.settings.composeDialog) {

                $mdDialog.show({
                    controller: 'rpMessageComposeDialogCtrl',
                    templateUrl: 'partials/rpMessageComposeDialog',
                    targetEvent: e,
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    locals: {
                        shareLink: null,
                        shareTitle: null
                    }

                });

            } else {
                rpLocationUtilService(e, '/message/compose', '', true, false);
            }

        };

        $scope.showInbox = function(e) {
            rpLocationUtilService(e, '/message/inbox', '', true, false);
        };

        $scope.showSent = function(e) {
            rpLocationUtilService(e, '/message/sent', '', true, false);
        };

        var deregisterMessagesRead = $rootScope.$on('rp_messages_read', function() {
            $scope.hasMail = false;
        });

        $scope.$on('$destroy', function() {
            deregisterMessagesRead();
        });

    }
]);

rpMessageControllers.controller('rpMessageComposeCtrl', ['$scope', '$mdDialog', 'rpLocationUtilService', 'rpSubredditsUtilService',
    function($scope, $mdDialog, rpLocationUtilService, rpSubredditsUtilService) {

        if ($scope.shareLink !== null && $scope.shareLink !== undefined) {
            $scope.title = "Share a link with a reddit user";
        } else {
            $scope.title = "Send a message";
        }

    }
]);

rpMessageControllers.controller('rpMessageComposeDialogCtrl', ['$scope', '$location', '$mdDialog', 'shareLink', 'shareTitle',
    function($scope, $location, $mdDialog, shareLink, shareTitle) {

        console.log('[rpMessageComposeDialogCtrl] shareLink: ' + shareLink);
        $scope.shareLink = shareLink || null;
        $scope.shareTitle = shareTitle || null;

        $scope.dialog = true;

        //Close the dialog if user navigates to a new page.
        var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
            $mdDialog.hide();
        });

        $scope.$on('$destroy', function() {
            deregisterLocationChangeSuccess();
        });

    }
]);

rpMessageControllers.controller('rpMessageComposeFormCtrl', ['$scope', '$rootScope', '$mdDialog', 'rpMessageComposeUtilService', 'rpLocationUtilService',
    function($scope, $rootScope, $mdDialog, rpMessageComposeUtilService, rpLocationUtilService) {

        $scope.messageSending = false;
        $scope.showSend = true;
        // $scope.iden = "";
        //
        console.log('[rpMessageComposeFormCtrl] $scope.shareLink: ' + $scope.shareLink);

        if ($scope.shareLink !== null && $scope.shareLink !== undefined) {
            $scope.text = 'Check this out, [' + $scope.shareTitle + '](' + $scope.shareLink + ')';

        }

        $scope.closeDialog = function(e) {

            console.log('[rpMessageComposeFormCtrl] closeDialog(), $scope.dialog: ' + $scope.dialog);

            if ($scope.dialog) {
                console.log('[rpMessageComposeFormCtrl] closeDialog: Dialog.');
                clearForm();
                $mdDialog.hide();
            } else {
                console.log('[rpMessageComposeFormCtrl] closeDialog: Window.');
                rpLocationUtilService(e, '/', '', true, false);
            }

        };

        $scope.sendMessage = function() {

            console.log('[rpMessageComposeFormCtrl] sendMessage(), $scope.iden: ' + $scope.iden);
            console.log('[rpMessageComposeFormCtrl] sendMessage(), $scope.captcha: ' + $scope.captcha);

            $scope.messageSending = true;

            rpMessageComposeUtilService($scope.subject, $scope.text, $scope.to, $scope.iden, $scope.captcha, function(err, data) {
                $scope.messageSending = false;

                if (err) {
                    console.log('[rpMessageComposeFormCtrl] err');

                    if (err.json.errors[0][0] === 'BAD_CAPTCHA') {
                        $rootScope.$emit('reset_captcha');

                        $scope.feedbackMessage = "You entered the CAPTCHA incorrectly. Please try again.";

                        $scope.showFeedbackAlert = true;
                        $scope.showFeedback = true;

                        $scope.showButtons = true;
                    } else {
                        $rootScope.$emit('reset_captcha');
                        $scope.feedbackMessage = err.json.errors[0][1];
                        $scope.showFeedbackAlert = true;
                        $scope.showFeedback = true;
                    }

                } else {

                    $scope.feedbackMessage = "Your message was sent successfully :)";
                    $scope.showFeedbackAlert = false;
                    $scope.showFeedback = true;
                    $scope.showSendAnother = true;
                    $scope.showSend = false;

                }


            });

        };

        $scope.sendAnother = function() {
            clearForm();
            $rootScope.$emit('reset_captcha');
            $scope.showFeedback = false;
            $scope.showSendAnother = false;
            $scope.showSend = true;
        };

        function clearForm() {
            $scope.subject = "";
            $scope.text = "";
            $scope.to = "";

            $scope.rpMessageComposeForm.$setUntouched();
        }

    }
]);