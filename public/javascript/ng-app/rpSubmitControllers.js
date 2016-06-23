'use strict';

var rpSubmitControllers = angular.module('rpSubmitControllers', []);

rpSubmitControllers.controller('rpSubmitDialogCtrl', ['$scope', '$location', '$mdDialog', 'subreddit',
    function($scope, $location, $mdDialog, subreddit) {

        $scope.isDialog = true;

        if (!subreddit || subreddit !== 'all') {
            $scope.subreddit = subreddit;
        }

        //Close the dialog if user navigates to a new page.
        var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
            $mdDialog.hide();
        });

        $scope.$on('$destroy', function() {
            deregisterLocationChangeSuccess();
        });

    }
]);

rpSubmitControllers.controller('rpSubmitFormCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$mdDialog',
    'rpSubmitUtilService', 'rpSubredditsUtilService', 'rpSidebarButtonUtilService', 'rpLocationUtilService',
    function($scope, $rootScope, $interval, $timeout, $mdDialog, rpSubmitUtilService, rpSubredditsUtilService,
        rpSidebarButtonUtilService, rpLocationUtilService) {

        if (!$scope.subreddit) {
            $scope.subreddit = rpSubredditsUtilService.currentSub;
        }

        if (!$scope.isDialog && $scope.subreddit) {
            rpSidebarButtonUtilService.show();
        }

        // console.log('[rpSubmitFormCtrl] $scope.subreddit: ' + $scope.subreddit);
        var resetSudreddit = false;

        if (!$scope.subreddit) {
            resetSudreddit = true;
        }

        clearForm();
        var searchText;
        var countdown;

        $scope.subs = rpSubredditsUtilService.subs;

        $scope.subSearch = function(subSearchText) {
            searchText = subSearchText;
            var results = subSearchText ? $scope.subs.filter(createFilterFor(subSearchText)) : [];
            return results;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(sub) {
                return (sub.data.display_name.indexOf(lowercaseQuery) === 0);
            };
        }

        function clearForm() {
            $scope.title = "";
            $scope.url = "";
            $scope.text = "";
            $scope.sendreplies = true;
            $scope.iden = "";
            $scope.cpatcha = "";

            if (resetSudreddit) {
                $scope.subreddit = "";
            }

            $scope.showSubmit = true;
            $scope.showRatelimit = false;
            $scope.showAnother = false;
            $scope.showRepost = false;

            $scope.showMessage = false;
            $scope.showButtons = true;


            if ($scope.rpSubmitNewLinkForm)
                $scope.rpSubmitNewLinkForm.$setUntouched();
        }

        $scope.resetForm = function() {
            clearForm();
            $rootScope.$emit('reset_captcha');
        };

        $scope.submitLink = function(e) {
            $scope.showProgress = true;
            $scope.showButtons = false;
            $scope.showFeedback = false;


            var kind = $scope.url ? 'link' : 'self';

            /*
            	blur input fields.
             */

            console.log('[rpSubmitFormCtrl] e.target.elements: ' + e.target.elements);

            // for (var i = 0; i < e.target.element.length; i++) {
            // }

            e.target.elements.submitTitleInput.blur();

            if (e.target.elements.submitSubredditInput)
                e.target.elements.submitSubredditInput.blur();

            if (e.target.elements.submitUrlInput)
                e.target.elements.submitUrlInput.blur();

            if (e.target.elements.submitTextInput)
                e.target.elements.submitTextInput.blur();
            if (e.target.elements.captchaInput)
                e.target.elements.captchaInput.blur();




            // console.log('[rpSubmitFormCtrl] submitLink(), $scope.subreddit: ' + $scope.subreddit);
            // console.log('[rpSubmitFormCtrl] submitLink(), searchText: ' + searchText);

            if (!$scope.subreddit) {
                $scope.subreddit = $scope.mdSelectedItem ? $scope.mdSelectedItem.data.display_name : searchText;
            }

            rpSubmitUtilService(kind, $scope.resubmit, $scope.sendreplies, $scope.subreddit,
                $scope.text, $scope.title, $scope.url, $scope.iden, $scope.captcha,
                function(err, data) {

                    $scope.showProgress = false;
                    //$timeout(angular.noop, 0);


                    if (err) {

                        var responseErrorBody = JSON.parse(err.body);

                        console.log('[rpSubmitFormCtrl] err');

                        if (responseErrorBody.json.errors.length > 0) {

                            //ratelimit error. (Still untested)
                            if (responseErrorBody.json.errors[0][0] === 'RATELIMIT') {

                                $scope.showSubmit = false;
                                $scope.showRatelimit = true;

                                var duration = responseErrorBody.json.ratelimit;

                                countdown = $interval(function() {

                                    console.log('[rpSubmitFormCtrl] submit rampup interval');

                                    var minutes = parseInt(duration / 60, 10);
                                    var seconds = parseInt(duration % 60, 10);

                                    minutes = minutes < 10 ? "0" + minutes : minutes;
                                    seconds = seconds < 10 ? "0" + seconds : seconds;

                                    $scope.rateLimitTimer = minutes + ":" + seconds;

                                    if (--duration < 0) {

                                        $rootScope.$emit('reset_captcha');

                                        $scope.showRatelimit = false;
                                        $scope.showFeedbackAlert = false;
                                        $scope.feedbackMessage = "alright, you should be able to post now, give it another go.";
                                        $scope.showSubmit = true;
                                        $interval.cancel(countdown);
                                    }


                                }, 1000);

                                $scope.feedbackMessage = responseErrorBody.json.errors[0][1];

                                $scope.showFeedbackAlert = true;
                                $scope.showFeedbackLink = false;
                                $scope.showFeedback = true;


                                $scope.showButtons = true;
                            } else if (responseErrorBody.json.errors[0][0] === 'QUOTA_FILLED') {
                                // console.log('[rpSubmitFormCtrl] QUOTA_FILLED ERROR');

                                $scope.feedbackMessage = responseErrorBody.json.errors[0][1];

                                $scope.showFeedbackAlert = true;
                                $scope.showFeedbackLink = false;
                                $scope.showFeedback = true;
                                $scope.showSubmit = false;
                                $scope.showButtons = true;
                            } else if (responseErrorBody.json.errors[0][0] === 'BAD_CAPTCHA') {
                                // console.log('[rpSubmitFormCtrl] bad captcha error.');
                                $rootScope.$emit('reset_captcha');

                                $scope.feedbackMessage = "you entered the CAPTCHA incorrectly. Please try again.";

                                $scope.showFeedbackAlert = true;
                                $scope.showFeedbackLink = false;
                                $scope.showFeedback = true;

                                $scope.showButtons = true;
                            }

                            //repost error ----not sure of this error name----
                            else if (responseErrorBody.json.errors[0][0] === 'ALREADY_SUB') {
                                // console.log('[rpSubmitFormCtrl] repost error: ' + JSON.stringify(data));
                                $rootScope.$emit('reset_captcha');

                                // $scope.feedbackLink = data;
                                // $scope.feedbackLinkName = "The link";
                                // $scope.feedbackMessage = "you tried to submit has been submitted to this subreddit before";

                                $scope.resubmit = true;

                                $scope.feedbackMessage = responseErrorBody.json.errors[0][1];
                                $scope.showFeedbackAlert = true;
                                $scope.showFeedbackLink = false;
                                $scope.showFeedback = true;

                                $scope.showSubmit = false;
                                $scope.showRepost = true;

                                $scope.showButtons = true;

                            }

                            /*
                            	Catches unspecififed errors or ones that do not require special handling.
                            	Catches, SUBREDDIT_ERROR.
                             */
                            else {
                                console.log('[rpSubmitFormCtrl] error catchall: ' + JSON.stringify(responseErrorBody));
                                $rootScope.$emit('reset_captcha');

                                $scope.feedbackMessage = responseErrorBody.json.errors[0][1];

                                $scope.showFeedbackAlert = true;
                                $scope.showFeedbackLink = false;
                                $scope.showFeedback = true;

                                $scope.showSubmit = true;
                                $scope.showButtons = true;

                                //$timeout(angular.noop, 0);
                            }


                        } else if (!responseErrorBody.json.data.url) {
                            // console.log('[rpSubmitFormCtrl] garbage url error occurred.');

                            $rootScope.$emit('reset_captcha');

                            $scope.feedbackMessage = 'something went wrong trying to post your link.\n check the url, wait a few minutes and try again.';
                            $scope.showFeedbackLink = false;
                            $scope.showFeedbackAlert = true;
                            $scope.showFeedback = true;

                            $scope.showButtons = true;

                        }

                    } else { //Successful Post :)
                        console.log('[rpSubmitFormCtrl] successful submission, data: ' + JSON.stringify(data));

                        var feedbackLinkRe = /^https?:\/\/www\.reddit\.com\/r\/([\w]+)\/comments\/([\w]+)\/(?:[\w]+)\//i;
                        var groups = feedbackLinkRe.exec(data.json.data.url);

                        if (groups) {
                            $scope.feedbackLink = '/r/' + groups[1] + '/comments/' + groups[2];
                        }

                        $scope.feedbackLinkName = "Your post";
                        $scope.feedbackMessage = "was submitted successfully.";

                        $scope.showFeedbackAlert = false;
                        $scope.showFeedbackLink = true;
                        $scope.showFeedback = true;

                        $scope.showRepost = false;
                        $scope.showSubmit = false;
                        $scope.showAnother = true;
                        $scope.showButtons = true;

                    }

                });

            $scope.$on('$destroy', function() {
                $interval.cancel(countdown);

            });

        };

        $scope.closeDialog = function() {
            console.log('[rpSubmitFormCtrl] closeDialog(), $scope.isDialog: ' + $scope.isDialog);

            if ($scope.isDialog) {
                $mdDialog.hide();

            } else {
                console.log('[rpSubmitFormCtrl] closeDialog in page');
                if (rpSubredditsUtilService.currentSub) {
                    rpLocationUtilService(null, '/r/' + rpSubredditsUtilService.currentSub, '', true, false);

                } else {
                    rpLocationUtilService(null, '/', '', true, false);

                }
            }
        };

        function startRateLimitTimer(duration) {

            $scope.rateLimitSubmitDisabled = true;
            console.log('[rpSubmitFormCtrl] duration: ' + duration);

        }


    }

]);
