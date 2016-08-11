var rpDirectives = angular.module('rpDirectives', []);

rpDirectives.directive('rpCoinbaseButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpCoinbaseButton'
    };
});

rpDirectives.directive('rpPaypalButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpPaypalButton'
    };
});

rpDirectives.directive('rpSocialButtons', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpSocialButtons'
    };
});

rpDirectives.directive('rpSpeedDial', function() {
    return {
        restirct: 'E',
        templateUrl: 'partials/rpSpeedDial',
        controller: 'rpSpeedDialCtrl'
    };
});

rpDirectives.directive('rpLinkResponsiveAd', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpLinkResponsiveAd'
    };
});

rpDirectives.directive('rpSidenavContent', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/rpSidenavContent'
    };
});

// rpDirectives.directive('rpSidebar', function() {
// 	return {
// 		restrict: 'E',
// 		replace: true,
// 		templateUrl: 'partials/rpSidebar',
// 		controller: 'rpSidebarCtrl'
// 	};
// });

rpDirectives.directive('rpToolbar', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpToolbar',
        controller: 'rpToolbarCtrl'

    };
});

rpDirectives.directive('rpSearchForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpSearchForm',
        replace: true
    };
});

rpDirectives.directive('rpSearchSidenavForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpSearchSidenavForm',
        replace: true

    };
});

rpDirectives.directive('rpGilded', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpGilded',
        // controller: 'rpGildedCtrl',
        scope: {
            parentCtrl: '=',
            author: '=',
            gilded: '='
        }
    };
});

rpDirectives.directive('rpArticleContextButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpArticleContextButton',
        controller: 'rpArticleButtonCtrl',
        scope: {
            parentCtrl: '=',
            post: '=',
            isComment: '=',
            message: '=',
        }
    };
});

rpDirectives.directive('rpArticleButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpArticleButton',
        controller: 'rpArticleButtonCtrl',
        scope: {
            parentCtrl: '=',
            post: '=',
            isComment: '=',
            message: '=',
        }
    };
});

rpDirectives.directive('rpTabs', [function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpTabs',
        controller: 'rpTabsCtrl',
        replace: true
    };
}]);

rpDirectives.directive('rpArticleTabs', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpArticleTabs',
        controller: 'rpArticleTabsCtrl',
        replace: true,
        scope: {
            parentCtrl: '=',
            tabs: '=',
            selectedIndex: '='
        }
    };
});

rpDirectives.directive('rpShareButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpShareButton',
        controller: 'rpShareButtonCtrl',
        scope: {
            post: '='
        }
    };
});

rpDirectives.directive('rpGildButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpGildButton',
        controller: 'rpGildButtonCtrl',
        scope: {
            redditId: '=',
            gilded: '='
        }
    };
});

rpDirectives.directive('rpSaveButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpSaveButton',
        controller: 'rpSaveButtonCtrl',
        scope: {
            redditId: '=',
            saved: '='
        }
    };
});

rpDirectives.directive('rpReplyButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpReplyButton',
        controller: 'rpReplyButtonCtrl',
        scope: {
            parentCtrl: '='
        }
    };
});

rpDirectives.directive('rpEditButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpEditButton',
        controller: 'rpEditButtonCtrl',
        scope: {
            parentCtrl: '='

        }

    };
});

rpDirectives.directive('rpDeleteButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpDeleteButton',
        controller: 'rpDeleteButtonCtrl',
        scope: {
            parentCtrl: '='

        }

    };
});

rpDirectives.directive('rpEditForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpEditForm',
        controller: 'rpEditFormCtrl',
        scope: {
            redditId: '=',
            parentCtrl: '=',
            editText: '='

        }
    };
});

rpDirectives.directive('rpDeleteForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpDeleteForm',
        controller: 'rpDeleteFormCtrl',
        scope: {
            redditId: '=',
            parentCtrl: '=',
            type: '='
        }
    };
});

rpDirectives.directive('rpReplyForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpReplyForm',
        controller: 'rpReplyFormCtrl',
        scope: {
            redditId: '=',
            parentCtrl: '=',
            post: '='


        }
    };
});

rpDirectives.directive('rpScore', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpScore',
        controller: 'rpScoreCtrl',
        scope: {
            score: '=',
            redditId: '=',
            likes: '='
        }

    };
});

rpDirectives.directive('rpLink', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpLink',
        controller: 'rpLinkCtrl',
        scope: {
            post: '=',
            parentCtrl: '=',
            identity: '=',
            showSub: '=',

        }
    };
});

rpDirectives.directive('rpSearchPost', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpSearchPost'
    };
});

rpDirectives.directive('rpSearchLink', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpSearchLink'
    };
});

rpDirectives.directive('rpSearchSub', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpSearchSub'
    };
});

rpDirectives.directive('rpArticle', function() {
    return {
        restrict: 'C',
        templateUrl: 'partials/rpArticle',
        controller: 'rpArticleCtrl',
        // replace: true,
        scope: {
            dialog: '=',
            post: '=',
            article: '=',
            subreddit: '=',
            comment: '='

        }
    };
});

rpDirectives.directive('rpSettings', function() {
    return {
        restrict: 'C',
        templateUrl: 'partials/rpSettings',
        controller: 'rpSettingsCtrl'
    };
});

rpDirectives.directive('rpSubmitText', function() {
    return {
        restrict: 'C',
        templateUrl: 'partials/rpSubmitText',
        controller: 'rpSubmitCtrl'
    };
});

rpDirectives.directive('rpSubmitLink', function() {
    return {
        restrict: 'C',
        templateUrl: 'partials/rpSubmitLink',
        controller: 'rpSubmitCtrl'
    };
});

rpDirectives.directive('rpMessageCompose', function() {

    return {
        restrict: 'C',
        templateUrl: 'partials/rpMessageCompose',
        controller: 'rpMessageComposeCtrl'
    };

});

rpDirectives.directive('rpShareEmail', function() {
    return {
        restrict: 'C',
        templateUrl: 'partials/rpShareEmail',
        controller: 'rpShareEmailCtrl'
    };
});

rpDirectives.directive('rpCaptcha', function() {

    return {
        restrict: 'E',
        templateUrl: 'partials/rpCaptcha',
        controller: 'rpCaptchaCtrl'
    };

});

rpDirectives.directive('rpFormatting', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/rpFormatting',
        controller: 'rpFormattingCtrl'
    };

});

// rpComment Directive for use with rpCommentCtrl
rpDirectives.directive('rpComment', ['$compile', '$rootScope', 'RecursionHelper', function($compile, $rootScope, RecursionHelper) {
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
        templateUrl: 'partials/rpComment',
        controller: 'rpCommentCtrl',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {

            });
        }
    };
}]);

rpDirectives.directive('rpMessageComment', ['$compile', '$rootScope', 'RecursionHelper', function($compile, $rootScope, RecursionHelper) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            parentCtrl: '=',
            message: '=',
            depth: '=',
            identity: '=',
        },
        templateUrl: 'partials/rpMessageComment',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {

            });
        },
        controller: 'rpMessageCommentCtrl'
    };
}]);

/*
	Display links and media in comments.
 */
rpDirectives.directive('rpCommentMedia', function() {
    return {
        restrict: 'C',
        scope: {
            href: "@"
        },
        transclude: true,
        replace: true,
        templateUrl: 'partials/rpCommentMedia'

    };
});

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



            var scrollDiv = attrs.rpInfiniteScrollDiv;
            var scrollDistance = attrs.rpInfiniteScrollDistance;


            var deregisterLoadMoreClick = $rootScope.$on('rp_load_more', function() {
                loadMore();
            });

            function loadMore() {
                if (scope.noMorePosts === undefined || scope.noMorePosts === false) {

                    if (angular.element(scrollDiv).outerHeight() - element.scrollTop() <= element.outerHeight() * scrollDistance) {
                        console.log('[rpInfiniteScroll] call loadMorePosts');
                        scope.morePosts();
                    }
                }
            }

            element.on('scroll', function() {
                // requestAnimationFrame(debounce(loadMore(), 3000));
                // debounce(requestAnimationFrame(loadMore), 3000);
                debounce(loadMore(), 1000);
            });


        }
    };

}]);

// rpDirectives.directive('rpCommentsScroll', [
//     '$rootScope',
//     '$timeout',
//     'debounce',
//     function(
//         $rootScope,
//         $timeout,
//         debounce
//     ) {
//         return {
//             restrict: 'A',
//
//             link: function(scope, element, attrs) {
//                 console.log('[rpCommentsScroll] link()');
//
//                 var scrollDiv = attrs.rpCommentsScrollDiv;
//                 var scrollDistance = attrs.rpCommentsScrollDistance;
//                 var addingComments = false;
//                 // var commentsScroll = true;
//
//
//                 var deregisterLoadMoreClick = $rootScope.$on('rp_load_more', function() {
//                     loadMore();
//                 });
//
//
//                 element.on('scroll', function() {
//                     // requestAnimationFrame(debounce(loadMore(), 3000));
//                     // debounce(requestAnimationFrame(loadMore), 3000);
//                     // console.log('[rpCommentsScroll] onScroll, !addingComments: ' + !addingComments);
//                     // console.log('[rpCommentsScroll] onScroll, scope.commentsScroll: ' + scope.commentsScroll);
//                     // console.log('[rpCommentsScroll] onScroll, !scope.noMoreComments: ' + !scope.noMoreComments);
//                     console.log('[rpCommentsScroll] onScroll, ' + !addingComments + ', ' + scope.commentsScroll + ', ' + !scope.noMoreComments);
//
//                     if (scope.commentsScroll && !addingComments && !scope.noMoreComments) {
//
//                         debounce(loadMore(1), 1000);
//                     }
//                 });
//
//                 function loadMore(numComments) {
//                     // console.log('[rpCommentsScroll] loadMore(), !scope.noMoreComments: ' + !scope.noMoreComments);
//
//                     //do not trigger if we have all the comments
//                     if (scope.noMoreComments === false) {
//
//                         // console.log('[rpCommentsScroll] loadMore(), height measurement: ' + (angular.element(scrollDiv).outerHeight() - element.scrollTop() <= element.outerHeight() * scrollDistance));
//                         //trigger conditions
//                         if (angular.element(scrollDiv).outerHeight() - element.scrollTop() <=
//                             element.outerHeight() * scrollDistance) {
//
//                             addingComments = true;
//                             scope.showCommentsLoading();
//                             scope.moreComments(numComments);
//                         }
//                     }
//                 }
//
//                 //watch the height of the element.
//                 //if the height changes set scope.addingComments has completed.
//
//                 var addingCommentsTimeout;
//                 var stopWatchingHeight;
//                 var blockFirst = true;
//
//                 function startWatcinghHeight() {
//                     stopWatchingHeight = scope.$watch(
//
//                         function() {
//                             return angular.element(scrollDiv).height();
//
//                         },
//                         function(newHeight, oldHeight) {
//                             console.log('[rpCommentsScroll] height listener');
//
//                             //don't do anything if old or new hieght is 0....
//
//                             console.log('[rpCommentsScroll] height change, newHeight: ' + newHeight);
//                             console.log('[rpCommentsScroll] height change, oldHeight: ' + oldHeight);
//
//                             if (blockFirst) { //block the first time this listener fires
//                                 console.log('[rpCommentsScroll] height listener, block first');
//                                 blockFirst = false;
//
//                             } else { //otherwise do stuff
//
//                                 console.log('[rpCommentsScroll] height listener, do stuff');
//
//                                 //Works,
//                                 //enable to load more comments if the last load was < 500 px
//                                 //disabled so that more comments don't get loaded unnecessarily at the start
//                                 // if (newHeight - oldHeight < 500) {
//                                 //     console.log('[rpCommentsScroll] call loadMore() ' + scope.commentsScroll + ', ' + !scope.noMoreComments);
//                                 //
//                                 //     if (scope.commentsScroll && !scope.noMoreComments) {
//                                 //         loadMore(3);
//                                 //     }
//                                 //
//                                 // }
//
//
//                                 stopWatchingHeight();
//
//                                 console.log('[rpCommentsScroll] height changed');
//
//                                 if (angular.isDefined(addingCommentsTimeout)) {
//                                     console.log('[rpCommentsScroll] cancel addingCommentsTimeout');
//                                     // scope.cancelAddingCommentsTimeout();
//                                     $timeout.cancel(addingCommentsTimeout);
//
//                                 }
//
//                                 addingCommentsTimeout = $timeout(function() {
//                                     console.log('[rpCommentsScroll] addingCommentsTimeout');
//                                     addingComments = false;
//                                     blockFirst = true;
//                                     scope.enableCommentsScroll();
//                                     scope.hideCommentsLoading();
//                                     startWatcinghHeight();
//
//                                 }, 1000);
//
//                             }
//
//
//                         }
//                     );
//                 }
//
//                 startWatcinghHeight();
//
//                 // scope.cancelAddingCommentsTimeout = function() {
//                 //     console.log('[rpCommentsScroll] cancelAddingCommentsTimeout()');
//                 //     $timeout.cancel(addingCommentsTimeout);
//                 //
//                 // };
//
//             }
//         };
//
//     }
// ]);

rpDirectives.directive('rpColumnResize', ['$rootScope', '$window', 'debounce', 'mediaCheck', function($rootScope, $window, debounce, mediaCheck) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var emitWindowResize = function(cols) {
                $rootScope.$emit('rp_window_resize', cols);

            };

            mediaCheck.init({
                scope: scope,
                media: [{
                    mq: '(max-width: 760px)',
                    enter: function(mq) {
                        if (!isFullscreen()) {
                            scope.columns = [1];
                            emitWindowResize(1);
                        }
                    }
                }, {
                    mq: '(min-width: 760px) and (max-width: 1280px)',
                    enter: function(mq) {
                        if (!isFullscreen()) {
                            scope.columns = [1, 2];
                            emitWindowResize(2);
                        }
                    }
                }, {
                    mq: '(min-width: 1280px) and (max-width: 1660px)',
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
                console.log('[rpColumnResize] isFullscreen(): ' + window.innerWidth === screen.width && window.innerHeight === screen.height);
                return window.innerWidth === screen.width && window.innerHeight === screen.height;
            }
        }
    };
}]);

//
// rpDirectives.directive('rpFastScroll', ['$rootScope', function($rootScope) {
// 	return {
// 		link: function(scope, element, attrs) {
// 			element.on('scroll', function() {
// 				console.log('[rpFastScroll] onScroll()');
// 				// $rootScope.$emit('rp_suspendable_suspend');
// 			});
// 		}
// 	};
// }]);

rpDirectives.directive('rpSuspendable', ['$rootScope', function($rootScope) {
    return {
        link: function(scope) {
            // console.log('[rpSuspendable] scope.$id: ' + scope.$id);
            var watchers = {};

            function removeWatchers(scope, depth) {
                console.log('[rpSuspendable] removeWatchers scope.$id: ' + scope.$id + ', depth: ' + depth);
                watchers[scope.$id] = scope.$$watchers;
                scope.$$watchers = [];

                if (scope.$$childHead !== undefined && scope.$$childHead !== null) {
                    console.log('[rpSuspendable] recurse children');
                    removeWatchers(scope.$$childHead, ++depth);

                }

                if (scope.$$nextSibling !== undefined && scope.$$nextSibling !== null) {
                    console.log('[rpSuspendable] recurse siblings');
                    removeWatchers(scope.$$nextSibling, ++depth);
                }
            }

            function restoreWatchers(scope, depth) {
                console.log('[rpSuspendable] restoreWatchers scope.$id: ' + scope.$id + ', depth: ' + depth);

                if (!scope.$$watchers || scope.$$watchers.length === 0) {
                    scope.$$watchers = watchers[scope.$id];
                } else {
                    scope.$$wactchers = scope.$$watchers.concat(watchers[scope.$id]);
                }
                watchers[scope.id] = void 0;

                if (scope.$$childHead !== undefined && scope.$$childHead !== null) {
                    console.log('[rpSuspendable] restoreWatchers() recurse children');
                    restoreWatchers(scope.$$childHead, ++depth);

                }

                if (scope.$$nextSibling !== undefined && scope.$$nextSibling !== null) {
                    console.log('[rpSuspendable] restoreWatchers() recurse siblings');
                    restoreWatchers(scope.$$nextSibling, ++depth);
                }

            }

            var deregisterSuspend = $rootScope.$on('rp_suspendable_suspend', function() {
                console.log('[rpSuspendable] rp_suspendable_suspend');
                watchers = {};
                removeWatchers(scope, 0);
            });

            var degeregisterRestore = $rootScope.$on('rp_suspendable_resume', function() {
                console.log('[rpSuspendable] rp_suspendable_resume');
                restoreWatchers(scope, 0);
                watchers = void 0;
            });

            scope.$on('$destroy', function() {
                deregisterSuspend();
                degeregisterRestore();
            });
        }
    };
}]);

// rpDirectives.directive('rpSimpleSuspendable', ['$rootScope',
// 	function($rootScope) {
//
// 		return {
// 			restrict: 'A',
// 			link: function(scope) {
// 				console.log('[rpSimpleSuspendable] loaded.');
// 				var watchers;
//
// 				var deregisterSuspend = $rootScope.$on('rp_simple_suspendable_suspend', function() {
// 					console.log('[rpSimpleSudpendable] rp_simple_suspendable_suspend');
// 					watchers = scope.$$watchers;
// 					scope.$$watchers = [];
// 				});
//
// 				var deregisterRestore = $rootScope.$on('rp_simple_suspendable_restore', function() {
// 					console.log('[rpSimpleSudpendable] rp_simple_suspendable_restore');
// 					if (!scope.$$watchers || scope.$$watchers.length === 0) {
// 						scope.$$watchers = watchers;
// 					} else {
// 						scope.$$watchers = scope.$$watchers.concat(watchers);
// 						watchers = void 0;
// 					}
// 				});
//
// 				scope.$on('$destroy', function() {
// 					deregisterSuspend();
// 					deregisterRestore();
// 				});
//
// 			}
// 		};
//
//
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
