var rpDirectives = angular.module('rpDirectives', []);

rpDirectives.directive('rpResizeDrag', [
    '$rootScope',
    'mediaCheck',
    function(
        $rootScope,
        mediaCheck
    ) {
        return {
            restrict: 'C',
            link: function(scope, elem, attr) {
                console.log('[rpResizeDrag]');

                mediaCheck.init({
                    scope: scope,
                    media: [{
                        mq: '(max-width: 600px)',
                        enter: function(mq) {
                            elem.removeClass('resize-drag');
                        }

                    }, {
                        mq: '(min-width: 601px)',
                        enter: function(mq) {
                            elem.addClass('resize-drag');

                        }
                    }]
                });

                // var deregisterResizeDrag = $rootScope.$on('rp_resize_drag', function (e, resizeDrag) {
                // 	console.log('[rpResizeDrag] rp_resize_drag, resizeDrag: ' + resizeDrag);

                // 	if (resizeDrag) {
                // 	} else {
                // 	}

                // });

                // scope.$on('$destroy', function () {
                // 	deregisterResizeDrag();
                // });
            }
        };

    }
]);

rpDirectives.directive('rpOverflowMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpOverflowMenu.html'

    };
}]);

rpDirectives.directive('rpToolbarSelect', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpToolbarSelect.html',
        controller: 'rpToolbarSelectCtrl',
        scope: {
            type: "="
        }
    };
}]);

rpDirectives.directive('rpSubreddits', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSubreddits.html',
        controller: 'rpSubredditsSidenavCtrl'
    };
}]);

rpDirectives.directive('rpBackButton', [function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            elem.bind('click', function() {
                console.log('[rpBackButton] click()');
                $window.history.back();
            });
        }
    };
}]);

rpDirectives.directive('rpSubmitRules', [function() {
    return {
        restirct: 'E',
        templateUrl: 'rpSubmitRules.html',
        controller: 'rpSubmitRulesCtrl',

    };
}]);

rpDirectives.directive('rpDialogCloseButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpDialogCloseButton.html',
        controller: 'rpDialogCloseButtonCtrl'
    };
}]);

rpDirectives.directive('rpCoinbaseButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpCoinbaseButton.html'
    };
}]);

rpDirectives.directive('rpPaypalButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpPaypalButton.html'
    };
}]);

rpDirectives.directive('rpSocialButtons', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSocialButtons.html'
    };
}]);

rpDirectives.directive('rpSpeedDial', [function() {
    return {
        restirct: 'E',
        templateUrl: 'rpSpeedDial.html',
        controller: 'rpSpeedDialCtrl'
    };
}]);

rpDirectives.directive('rpLinkResponsiveAd', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'rpLinkResponsiveAd.html',
            link: function(scope, elem, attrs) {
                console.log('[rpChitikaAd]');
                if (window.CHITIKA === undefined) {
                    window.CHITIKA = {
                        'units': []
                    };
                }
                var unit = {
                    "calltype": "async[2]",
                    "publisher": "jalalalbasri",
                    "width": 500,
                    "height": 300,
                    "sid": "Chitika Default"
                };
                var placement_id = window.CHITIKA.units.length;
                window.CHITIKA.units.push(unit);
                console.log('[rpChitikaAd] placement_id: ' + placement_id);
                scope.placement_id = placement_id;
                // window.document.write('<div id="chitikaAdBlock-' + placement_id + '"></div>');

                // load getAds script again..
                var element = document.createElement("script");
                element.src = "/javascript/dist/chitika-getAds.js";
                document.body.appendChild(element);

                //set style
                $timeout(function() {
                    jQuery('.chitikaAdBlock').append($("<style type='text/css'>  height: 100% !important; width: 100% !important;  "));

                    jQuery('.chitikaAdBlock').contents().find("html")
                        .append($("<style type='text/css'>  html {margin: 0 !important; width: 100% !important; }  </style>"));

                    jQuery('.chitikaAdBlock').contents().find("head")
                        .append($("<style type='text/css'>  img{width: 100% !important; height: 100% !important; }  </style>"));

                }, 3000);

                //not working
                // jQuery('#chitikaAdBlock-0').on('load', '.chitikaAdBlock', function() {
                //     console.log('[rpChitikaAd] iframe loaded');
                // });

                // test jQuery
                console.log('[rpChitikaAd] jQuery' + jQuery);
                console.log('[rpChitikaAd] jQuery num rp-links: ' + jQuery('rp-link').length);

            }
        };
    }
]);

rpDirectives.directive('rpSidenavContent', [
    '$templateCache',
    '$timeout',
    '$mdMedia',
    function(
        $templateCache,
        $timeout,
        $mdMedia
    ) {
        return {
            restrict: 'E',
            replace: true,
            template: $templateCache.get('rpSidenavContent.html'),
            link: function(scope, elem, attrs) {
                $timeout(function() {
                    scope.showSidenav = $mdMedia('gt-md');

                }, 0);
                scope.$watch(function() {
                    return $mdMedia('gt-md');
                }, function(showSidenav) {
                    $timeout(function() {
                        scope.showSidenav = showSidenav;

                    }, 0);
                });

            }
        };
    }
]);

// rpDirectives.directive('rpSidebar', function() {
// 	return {
// 		restrict: 'E',
// 		replace: true,
// 		templateUrl: 'rpSidebar.html',
// 		controller: 'rpSidebarCtrl'
// 	};
// });

rpDirectives.directive('rpToolbar', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpToolbar.html',
        controller: 'rpToolbarCtrl'

    };
}]);

rpDirectives.directive('rpSearchForm', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSearchForm.html',
        replace: true
    };
}]);

rpDirectives.directive('rpSearchSidenavForm', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSearchSidenavForm.html',
        replace: true

    };
}]);

rpDirectives.directive('rpGilded', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpGilded.html',
        // controller: 'rpGildedCtrl',
        scope: {
            parentCtrl: '=',
            author: '=',
            gilded: '='
        }
    };
}]);

rpDirectives.directive('rpArticleContextButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpArticleContextButton.html',
        controller: 'rpArticleButtonCtrl',
        scope: {
            parentCtrl: '=',
            post: '=',
            isComment: '=',
            message: '=',
        }
    };
}]);

rpDirectives.directive('rpArticleContextButtonMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpArticleContextButtonMenu.html',
        controller: 'rpArticleButtonCtrl',
        scope: {
            parentCtrl: '=',
            post: '=',
            isComment: '=',
            message: '=',
        }
    };
}]);

rpDirectives.directive('rpArticleButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpArticleButton.html',
        controller: 'rpArticleButtonCtrl',
        scope: {
            parentCtrl: '=',
            post: '=',
            isComment: '=',
            message: '=',
        }
    };
}]);

rpDirectives.directive('rpTabs', ['$templateCache', function($templateCache) {
    return {
        restrict: 'E',
        template: $templateCache.get('rpTabs.html'),
        controller: 'rpTabsCtrl',
        replace: true
    };
}]);

rpDirectives.directive('rpArticleTabs', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpArticleTabs.html',
        controller: 'rpArticleTabsCtrl',
        replace: true,
        scope: {
            parentCtrl: '=',
            tabs: '=',
            selectedIndex: '=',
            animations: '='
        }
    };
}]);

rpDirectives.directive('rpShareButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpShareButton.html',
        controller: 'rpShareButtonCtrl',
        scope: {
            post: '='
        }
    };
}]);

rpDirectives.directive('rpShareButtonMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpShareButtonMenu.html',
        controller: 'rpShareButtonCtrl',
        scope: {
            post: '='
        }
    };
}]);

rpDirectives.directive('rpGildButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpGildButton.html',
        controller: 'rpGildButtonCtrl',
        scope: {
            redditId: '=',
            gilded: '='
        }
    };
}]);

rpDirectives.directive('rpSaveButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSaveButton.html',
        controller: 'rpSaveButtonCtrl',
        scope: {
            redditId: '=',
            saved: '='
        }
    };
}]);

rpDirectives.directive('rpSaveButtonMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSaveButtonMenu.html',
        controller: 'rpSaveButtonCtrl',
        scope: {
            redditId: '=',
            saved: '='
        }
    };
}]);

rpDirectives.directive('rpReplyButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpReplyButton.html',
        controller: 'rpReplyButtonCtrl',
        scope: {
            parentCtrl: '='
        }
    };
}]);

rpDirectives.directive('rpEditButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpEditButton.html',
        controller: 'rpEditButtonCtrl',
        scope: {
            parentCtrl: '='

        }

    };
}]);

rpDirectives.directive('rpDeleteButton', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpDeleteButton.html',
        controller: 'rpDeleteButtonCtrl',
        scope: {
            parentCtrl: '='

        }

    };
}]);

rpDirectives.directive('rpDeleteButtonMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpDeleteButtonMenu.html',
        controller: 'rpDeleteButtonCtrl',
        scope: {
            parentCtrl: '='

        }

    };
}]);

rpDirectives.directive('rpHideButtonMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpHideButtonMenu.html',
        controller: 'rpHideButtonCtrl',
        scope: {
            parentCtrl: '=',
            isHidden: '=',
            redditId: "="

        }

    };
}]);

rpDirectives.directive('rpOpenNewButtonMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpOpenNewButtonMenu.html',
        controller: 'rpOpenNewButtonCtrl',
        scope: {
            post: '=',
            isComment: '='

        }

    };
}]);

rpDirectives.directive('rpEditForm', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpEditForm.html',
        controller: 'rpEditFormCtrl',
        scope: {
            redditId: '=',
            parentCtrl: '=',
            editText: '='

        }
    };
}]);

rpDirectives.directive('rpDeleteForm', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpDeleteForm.html',
        controller: 'rpDeleteFormCtrl',
        scope: {
            redditId: '=',
            parentCtrl: '=',
            isComment: '='
        }
    };
}]);

rpDirectives.directive('rpReplyForm', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpReplyForm.html',
        controller: 'rpReplyFormCtrl',
        scope: {
            redditId: '=',
            parentCtrl: '=',
            post: '='


        }
    };
}]);

rpDirectives.directive('rpScore', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpScore.html',
        controller: 'rpScoreCtrl',
        scope: {
            score: '=',
            redditId: '=',
            likes: '='
        }

    };
}]);

rpDirectives.directive('rpLink', ['$templateCache', function($templateCache) {
    return {
        restrict: 'E',
        template: $templateCache.get('rpLink.html'),
        controller: 'rpLinkCtrl',
        scope: {
            post: '=',
            parentCtrl: '=',
            identity: '=',
            showSub: '=',

        }
    };
}]);

rpDirectives.directive('rpSearchPost', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSearchPost.html'
    };
}]);

rpDirectives.directive('rpSearchLink', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSearchLink.html'
    };
}]);

rpDirectives.directive('rpSearchSub', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpSearchSub.html'
    };
}]);

rpDirectives.directive('rpArticle', [function() {
    return {
        restrict: 'C',
        templateUrl: 'rpArticle.html',
        controller: 'rpArticleCtrl',
        // replace: true,
        scope: {
            dialog: '=',
            post: '=',
            article: '=',
            subreddit: '=',
            comment: '=',
            animations: '='

        }
    };
}]);

rpDirectives.directive('rpSettings', [function() {
    return {
        restrict: 'C',
        templateUrl: 'rpSettings.html',
        controller: 'rpSettingsCtrl',
    };
}]);

rpDirectives.directive('rpSubmitText', [function() {
    return {
        restrict: 'C',
        templateUrl: 'rpSubmitText.html',
        controller: 'rpSubmitCtrl'
    };
}]);

rpDirectives.directive('rpSubmitLink', [function() {
    return {
        restrict: 'C',
        templateUrl: 'rpSubmitLink.html',
        controller: 'rpSubmitCtrl'
    };
}]);

rpDirectives.directive('rpMessageCompose', [function() {

    return {
        restrict: 'C',
        templateUrl: 'rpMessageCompose.html',
        controller: 'rpMessageComposeCtrl'
    };

}]);

rpDirectives.directive('rpFeedback', [function() {

    return {
        restrict: 'C',
        templateUrl: 'rpFeedback.html',
        controller: 'rpFeedbackCtrl'
    };

}]);

rpDirectives.directive('rpShareEmail', [function() {
    return {
        restrict: 'C',
        templateUrl: 'rpShareEmail.html',
        controller: 'rpShareEmailCtrl'
    };
}]);

rpDirectives.directive('rpCaptcha', [function() {

    return {
        restrict: 'E',
        templateUrl: 'rpCaptcha.html',
        controller: 'rpCaptchaCtrl'
    };

}]);

rpDirectives.directive('rpFormatting', [function() {
    return {
        restrict: 'E',
        templateUrl: 'rpFormatting.html',
    };

}]);

// rpComment Directive for use with rpCommentCtrl
rpDirectives.directive('rpComment', [
    '$compile',
    '$rootScope',
    'RecursionHelper',
    function(
        $compile,
        $rootScope,
        RecursionHelper
    ) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                comment: '=',
                cid: '=',
                depth: '=',
                post: '=',
                sort: '=',
                parent: '=',
                identity: '='
            },
            templateUrl: 'rpComment.html',
            controller: 'rpCommentCtrl',
            compile: function(element) {
                return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {

                });
            }
        };
    }
]);

rpDirectives.directive('rpMessageComment', [
    '$compile',
    '$rootScope',
    '$templateCache',
    'RecursionHelper',
    function(
        $compile,
        $rootScope,
        $templateCache,
        RecursionHelper
    ) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                parentCtrl: '=',
                message: '=',
                depth: '=',
                identity: '=',
            },
            template: $templateCache.get('rpMessageComment.html'),
            compile: function(element) {
                return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {

                });
            },
            controller: 'rpMessageCommentCtrl'
        };
    }
]);

/*
	Display links and media in comments.
 */
rpDirectives.directive('rpCommentMedia', [function() {
    return {
        restrict: 'C',
        scope: {
            href: "@"
        },
        transclude: true,
        replace: true,
        templateUrl: 'rpCommentMedia.html'

    };
}]);

/*
	use this comile directive instead of ng-bind-html in comment template becase we add our rpCommentMedia
	directive and unless the html is compiled again angular won't pick up on it.
	SO Question:
	http://stackoverflow.com/questions/17417607/angular-ng-bind-html-unsafe-and-directive-within-it
 */

rpDirectives.directive('compile', ['$compile', '$sce',
    function($compile, $sce) {
        return {
            link: function(scope, element, attrs) {
                var ensureCompileRunsOnce = scope.$watch(function(scope) {
                        return $sce.parseAsHtml(attrs.compile)(scope);
                    },
                    function(value) {
                        // when the parsed expression changes assign it into the current DOM
                        element.html(value);

                        // compile the new DOM and link it to the current scope.
                        $compile(element.contents())(scope);

                        // Use un-watch feature to ensure compilation happens only once.
                        ensureCompileRunsOnce();
                    });
            }
        };
    }
]);

rpDirectives.directive('rpFab', ['$rootScope', function($rootScope) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {

            var deregisterScrollUp = $rootScope.$on('scroll_down', function() {
                if (parseInt(element.children('ul').css('bottom')) > -100)
                    element.children('ul').css('bottom', '-=25');
                else
                    element.children('ul').css('bottom', '-100px');
            });

            var deregisterScrollDown = $rootScope.$on('scroll_up', function() {
                if (parseInt(element.children('ul').css('bottom')) < 0)
                    element.children('ul').css('bottom', '+=25');
                else
                    element.children('ul').css('bottom', '0px');
            });

            scope.$on('$destroy', function() {
                deregisterScrollUp();
                deregisterScrollDown();
            });

        }
    };
}]);

rpDirectives.directive('rpFocusMe', ['$timeout', '$parse', function($timeout, $parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.rpFocusMe);
            console.log('[rpFocusMe] link function load, model: ' + model);

            scope.$watch(model, function(value) {
                console.log('[rpFocusMe] $watch, value: ' + value);

                if (value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }

            });

            element.bind('blur', function() {
                console.log('[rpFocusMe] blur');
                scope.$apply(model.assign(scope, false));

            });

        }
    };
}]);

rpDirectives.directive('rpMain', ['$animate', function($animate) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            $animate.on('enter', element[0], function callback(element, phase) {
                if (element.hasClass('rp-main')) {
                    console.log('[rpMain] .rp-main animation');
                    console.log('[rpMain] animate enter listener, phase: ' + phase);
                    if (phase === 'close') {
                        console.log('[rpMain] broadcast md-resize-textarea...');
                        scope.$broadcast('md-resize-textarea');

                    }

                }
            });

        }
    };
}]);

rpDirectives.directive('rpToolbarSelectButton', [function() {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            var select = attrs.rpToolbarSelectButton;
            console.log('[rpToolbarSelectButton] select: ' + select);

            element.click(function() {
                console.log('[rpToolbarSelectButton] click()');
                console.log('[rpToolbarSelectButton] click(), select: ' + select);
                angular.element(select).trigger('click');

            });

        }
    };
}]);

rpDirectives.directive('rpInfiniteScroll', ['$rootScope', 'debounce', function($rootScope, debounce) {
    return {
        restrict: 'A',

        link: function(scope, element, attrs) {
            console.log('[rpInfiniteScroll] link()');

            var scrollDiv = attrs.rpInfiniteScrollDiv; //div to inf scroll on
            var scrollDistance = attrs.rpInfiniteScrollDistance; //multiple of div length to trigger inf scroll


            var deregisterLoadMoreClick = $rootScope.$on('rp_load_more', function() {
                loadMore();
            });

            var debouncedLoadMore = debounce(300, function() {
                if (scope.noMorePosts === undefined || scope.noMorePosts === false) {

                    if (angular.element(scrollDiv).outerHeight() - element.scrollTop() <=
                        element.outerHeight() * scrollDistance) {
                        console.log('[rpInfiniteScroll] call loadMorePosts');
                        scope.morePosts();
                    }
                }
            }, true);

            element.on('scroll', function() {
                // requestAnimationFrame(debounce(loadMore(), 3000));
                // debounce(requestAnimationFrame(loadMore), 3000);
                debouncedLoadMore();
            });
        }
    };
}]);

rpDirectives.directive('rpCommentsScroll', [
    '$rootScope',
    '$timeout',
    'debounce',
    function(
        $rootScope,
        $timeout,
        debounce
    ) {
        return {
            restrict: 'A',

            link: function(scope, element, attrs) {
                console.log('[rpCommentsScroll] link()');

                var scrollDiv = attrs.rpCommentsScrollDiv;
                var scrollDistance = attrs.rpCommentsScrollDistance;
                var addingComments = false;

                element.on('scroll', function() {
                    console.log('[rpCommentsScroll] onScroll, ' + !addingComments + ', ' + scope.commentsScroll + ', ' + !scope.noMoreComments);

                    if (scope.commentsScroll && !addingComments && !scope.noMoreComments) {
                        debouncedLoadMore();
                    }
                });

                var debouncedLoadMore = debounce(500, function() {
                    // console.log('[rpCommentsScroll] loadMore(), !scope.noMoreComments: ' + !scope.noMoreComments);

                    //do not trigger if we have all the comments
                    if (scope.noMoreComments === false) {

                        //trigger conditions
                        if (angular.element(scrollDiv).outerHeight() - element.scrollTop() <=
                            element.outerHeight() * scrollDistance) {

                            addingComments = true;
                            scope.moreComments();
                        }
                    }
                }, true);

                //watch the height of the element.
                //if the height changes set scope.addingComments has completed.

                var addingCommentsTimeout;
                var stopWatchingHeight;
                var blockFirst = true;

                function startWatcinghHeight() {
                    stopWatchingHeight = scope.$watch(

                        function() {
                            return angular.element(scrollDiv).height();

                        },
                        function(newHeight, oldHeight) {
                            console.log('[rpCommentsScroll] height listener');

                            //don't do anything if old or new hieght is 0....

                            console.log('[rpCommentsScroll] height change, newHeight: ' + newHeight + ', oldHeight: ' + oldHeight);

                            if (blockFirst) { //block the first time this listener fires
                                console.log('[rpCommentsScroll] height listener, block first');
                                blockFirst = false;

                            } else { //otherwise do stuff
                                console.log('[rpCommentsScroll] height listener, stop watching height...');
                                console.timeEnd('[rpArticleCtrl addComments]');

                                stopWatchingHeight();


                                if (angular.isDefined(addingCommentsTimeout)) {
                                    console.log('[rpCommentsScroll] cancel addingCommentsTimeout');
                                    $timeout.cancel(addingCommentsTimeout);

                                }

                                addingCommentsTimeout = $timeout(function() {
                                    console.log('[rpCommentsScroll] addingCommentsTimeout');
                                    addingComments = false;
                                    blockFirst = true;
                                    scope.enableCommentsScroll();
                                    scope.hideProgress();
                                    startWatcinghHeight();

                                }, 500);

                            }


                        }
                    );
                }

                var deregisterStartWatchingHeight = $rootScope.$on('rp_start_watching_height', function() {
                    startWatcinghHeight();

                });

                scope.$on('$destroy', function() {
                    if (angular.isDefined(addingCommentsTimeout)) {
                        $timeout.cancel(addingCommentsTimeout);

                    }

                    deregisterStartWatchingHeight();

                });

            }
        };

    }
]);

rpDirectives.directive('rpColumnResize', [
    '$rootScope',
    '$window',
    'debounce',
    'mediaCheck',
    function(
        $rootScope,
        $window,
        debounce,
        mediaCheck
    ) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var emitResizeDrag = function(resizeDrag) {
                    console.log('[rpColumnResize] emit resize drag: ' + resizeDrag);
                    $rootScope.$emit('rp_resize_drag', resizeDrag);
                };

                var emitWindowResize = function(cols) {
                    $rootScope.$emit('rp_window_resize', cols);

                };

                mediaCheck.init({
                    scope: scope,
                    media: [{
                        mq: '(max-width: 759px)',
                        enter: function(mq) {
                            if (!isFullscreen()) {
                                scope.columns = [1];
                                emitWindowResize(1);
                            }
                            emitResizeDrag(false);
                        }

                    }, {
                        mq: '(min-width: 760px) and (max-width: 1279px)',
                        enter: function(mq) {

                            if (!isFullscreen()) {
                                scope.columns = [1, 2];
                                emitWindowResize(2);
                            }
                            emitResizeDrag(true);
                        }
                    }, {
                        mq: '(min-width: 1280px) and (max-width: 1659px)',
                        enter: function(mq) {
                            if (!isFullscreen()) {
                                scope.columns = [1, 2, 3];
                                emitWindowResize(3);
                            }
                        }
                    }, {
                        mq: '(min-width: 1660px)',
                        enter: function(mq) {
                            if (!isFullscreen()) {
                                scope.columns = [1, 2, 3, 4];
                                emitWindowResize(4);
                            }
                        }
                    }]
                });

                function isFullscreen() {
                    console.log('[rpColumnResize] isFullscreen(): ' + (window.innerWidth === screen.width && window.innerHeight === screen.height));
                    return window.innerWidth === screen.width && window.innerHeight === screen.height;
                }
            }
        };
    }
]);

rpDirectives.directive('rpFastScroll', [
    '$rootScope',
    '$timeout',
    'debounce',
    function(
        $rootScope,
        $timeout,
        debounce
    ) {
        return {
            link: function(scope, element, attrs) {


            }
        };
    }
]);

rpDirectives.directive('rpSuspendable', [
    '$rootScope',
    '$timeout',

    function(
        $rootScope,
        $timeout

    ) {
        return {
            link: function(scope, element) {
                // console.log('[rpSuspendable] scope.$id: ' + scope.$id);
                var watchers = [];
                var inview;
                var resumeTimeout;
                var suspendTimeout;

                scope.inView = function($index, $inview) {
                    // console.log('[rpSuspendable] inView(), $inview: ' + $inview);
                    inView = $inview;
                    if ($inview) {
                        resumeWatchers();
                    } else {
                        suspendWatchers();
                    }
                };


                function suspendWatchers() {

                    if (suspendTimeout || resumeTimeout) {

                    } else {
                        if (scope.$$watchers !== 0) {
                            iterateSiblings(scope, suspendScopeWatchers);
                            iterateChildren(scope, suspendScopeWatchers);

                        }

                        suspendTimeout = $timeout(function() {
                            suspendTimeout = null;
                        }, 300);
                    }

                }

                function resumeWatchers() {

                    if (resumeTimeout) {
                        $timeout.cancel(resumeTimeout);
                    }

                    resumeTimeout = $timeout(function() {
                        iterateSiblings(scope, resumeScopeWatchers);
                        iterateChildren(scope, resumeScopeWatchers);
                        resumeTimeout = null;
                    }, 100);

                }

                function suspendScopeWatchers(scope) {
                    if (!watchers[scope.$id]) {
                        watchers[scope.$id] = scope.$$watchers || [];
                        scope.$$watchers = [];
                    }
                }

                function resumeScopeWatchers(scope) {
                    if (watchers[scope.$id]) {
                        scope.$$watchers = watchers[scope.$id];
                        if (scope.hasOwnProperty('$watch')) delete scope.$watch;
                        watchers[scope.$id] = false;
                    }
                }

                function iterateSiblings(scope, operationOnScope) {
                    while (!!(scope = scope.$$nextSibling)) {
                        operationOnScope(scope);
                        iterateChildren(scope, operationOnScope);
                    }
                }

                function iterateChildren(scope, operationOnScope) {
                    while (!!(scope = scope.$$childHead)) {
                        operationOnScope(scope);
                        iterateSiblings(scope, operationOnScope);
                    }
                }

                var deregisterSuspend = $rootScope.$on('rp_suspendable_suspend', function() {
                    console.log('[rpSuspendable] rp_suspendable_suspend');
                    suspendWatchers();
                });

                var deregisterResume = $rootScope.$on('rp_suspendable_resume', function() {
                    console.log('[rpSuspendable] rp_suspendable_resume');
                    resumeWatchers();
                });

                var deregisterSuspendResume = $rootScope.$on('rp_suspendable_suspend_resume', function() {
                    if (inView) {
                        resumeWatchers();
                    } else {
                        suspendWatchers();
                    }
                });

                scope.$on('$destroy', function() {
                    deregisterSuspend();
                    deregisterResume();
                    deregisterSuspendResume();
                });
            }
        };
    }
]);

// rpDirectives.directive('rpSimpleSuspendable', ['$rootScope',
// 	function($rootScope) {

// 		return {
// 			restrict: 'A',
// 			link: function(scope) {
// 				console.log('[rpSimpleSuspendable] loaded.');
// 				var watchers;

// 				var removeWatchers = function() {
// 					console.log('[rpSimpleSudpendable] rp_simple_suspendable_suspend');
// 					watchers = scope.$$watchers;
// 					scope.$$watchers = [];
// 				};

// 				var restoreWatchers = function() {
// 					console.log('[rpSimpleSudpendable] rp_simple_suspendable_restore');
// 					if (!scope.$$watchers || scope.$$watchers.length === 0) {
// 						scope.$$watchers = watchers;
// 					} else {
// 						scope.$$watchers = scope.$$watchers.concat(watchers);
// 						watchers = void 0;
// 					}
// 				};

// 				scope.inView = function($index, $inview) {
// 					console.log('[rpSimpleSuspendable] inView(), $inview: ' + $inview);
// 					if ($inview) {
// 						restoreWatchers(scope, 0);
// 					} else {
// 						removeWatchers(scope, 0);
// 					}
// 				};

// 				scope.$on('$destroy', function() {
// 					deregisterSuspend();
// 					deregisterRestore();
// 				});

// 			}
// 		};


// 	}
// ]);

// rpDirectives.directive('rpTabToolbar', ['$rootScope', function($rootScope) {
// 	return {
// 		restrict: 'C',
// 		link: function(scope, element, attrs) {
//
// 			var step = 16;
//
// 			var deregisterScrollUp = $rootScope.$on('scroll_down', function() {
// 				stepUp();
// 			});
//
// 			var deregisterScrollDown = $rootScope.$on('scroll_up', function() {
// 				stepDown();
// 			});
//
// 			var deregisterTabsShow = $rootScope.$on('rp_tabs_show', function() {
// 				moveDown();
// 			});
//
// 			var deregisterTabsHide = $rootScope.$on('rp_tabs_hide', function() {
// 				moveUp();
// 			});
//
// 			function stepDown() {
// 				if (parseInt(element.css('top')) < 0) {
// 					element.css('top', '+=' + step);
// 				}
// 			}
//
// 			function stepUp() {
// 				if (parseInt(element.css('top')) > -48) {
// 					element.css('top', '-=' + step);
// 				}
// 			}
//
// 			function moveDown() {
// 				if (parseInt(element.css('top')) < 0) {
// 					element.css('top', 0);
// 				}
// 			}
//
// 			function moveUp() {
// 				if (parseInt(element.css('top')) > -48) {
// 					element.css('top', -48);
// 				}
// 			}
//
// 			scope.$on('$destroy', function() {
// 				deregisterScrollUp();
// 				deregisterScrollDown();
// 				deregisterTabsHide();
// 				deregisterTabsShow();
// 			});
//
// 		}
// 	};
// }]);

rpDirectives.directive('rpPageContent', ['$rootScope', function($rootScope) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {

            var step = 16;

            var deregisterScrollUp = $rootScope.$on('scroll_down', function() {
                stepDown();
            });

            var deregisterScrollDown = $rootScope.$on('scroll_up', function() {
                stepUp();
            });

            // var deregisterTabsShow = $rootScope.$on('rp_tabs_show', function() {
            // 	moveUp();
            // });
            //
            // var deregisterTabsHide = $rootScope.$on('rp_tabs_hide', function() {
            // 	moveDown();
            // });

            function stepUp() {
                if (parseInt(element.css('top')) < 0) {
                    element.css('top', '+=' + step);
                }
            }

            function stepDown() {
                if (parseInt(element.css('top')) > -48) {
                    element.css('top', '-=' + step);
                }
            }

            function moveUp() {
                if (parseInt(element.css('top')) < 0) {
                    element.css('top', 0);
                }
            }

            function moveDown() {
                if (parseInt(element.css('top')) > -48) {
                    element.css('top', -48);
                }
            }


            scope.$on('$destroy', function() {
                deregisterScrollUp();
                deregisterScrollDown();
                deregisterTabsShow();
                deregisterTabsHide();
            });

        }
    };
}]);

rpDirectives.directive('rpSidenavFooter', ['$rootScope', function($rootScope) {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {

            var step = 16;

            var deregisterScrollUp = $rootScope.$on('scroll_up', function() {
                console.log('[rpSidenavFooter] onScrollUp()');
                stepDown();
            });

            var deregisterScrollDown = $rootScope.$on('scroll_down', function() {
                stepUp();
            });

            var deregisterTabsShow = $rootScope.$on('rp_tabs_show', function() {
                moveDown();
            });

            var deregisterTabsHide = $rootScope.$on('rp_tabs_hide', function() {
                moveUp();
            });

            function stepDown() {
                if (parseInt(element.css('margin-bottom')) < 48) {
                    element.css('margin-bottom', '+=' + step);
                }

            }

            function stepUp() {
                if (parseInt(element.css('margin-bottom')) !== 0) {
                    element.css('margin-bottom', '-=' + step);
                }

            }

            function moveDown() {
                if (parseInt(element.css('margin-bottom')) < 48) {
                    element.css('margin-bottom', 48);
                }

            }

            function moveUp() {
                if (parseInt(element.css('margin-bottom')) !== 0) {
                    element.css('margin-bottom', 0);
                }

            }

            scope.$on('$destroy', function() {
                deregisterScrollUp();
                deregisterScrollDown();
                deregisterTabsHide();
                deregisterTabsShow();
            });

        }
    };
}]);
