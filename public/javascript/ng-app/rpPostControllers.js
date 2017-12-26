'use strict';

var rpPostControllers = angular.module('rpPostControllers', []);

rpPostControllers.controller('rpPostsCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$window',
    '$filter',
    '$timeout',
    '$q',
    '$location',
    'rpPostsUtilService',
    'rpTitleChangeUtilService',
    'rpSettingsUtilService',
    'rpSubredditsUtilService',
    'rpLocationUtilService',
    'rpAuthUtilService',
    'rpIdentityUtilService',

    function(
        $scope,
        $rootScope,
        $routeParams,
        $window,
        $filter,
        $timeout,
        $q,
        $location,
        rpPostsUtilService,
        rpTitleChangeUtilService,
        rpSettingsUtilService,
        rpSubredditsUtilService,
        rpLocationUtilService,
        rpAuthUtilService,
        rpIdentityUtilService

    ) {

        console.log('[rpPostsCtrl]');



        $rootScope.$emit('rp_hide_all_buttons');
        $rootScope.$emit('rp_button_visibility', 'showPostSort', true);
        $rootScope.$emit('rp_button_visibility', 'showLayout', true);
        $rootScope.$emit('rp_button_visibility', 'showSlideshow', true);


        $scope.subreddit = $routeParams.sub;
        console.log('[rpPostsCtrl] $scope.subreddit: ' + $scope.subreddit);



        // console.log('[rpPostsCtrl] $routeParams: ' + JSON.stringify($routeParams));
        // console.log('[rpPostsCtrl] $location.path(): ' + $location.path());

        // var sortRe = /^\/(new|hot)$/;

        // var groups = sortRe.exec($location.path());

        // console.log('[rpPostsCtrl] sortRe, groups: ' + groups);
        // // console.log('[rpPostsCtrl] sortRe, groups[1]: ' + groups[1]);
        // // console.log('[rpPostsCtrl] sortRe.exec($location.path())[1]: ' + sortRe.exec($location.path())[1]);

        // // if (angular.isDefined(groups)) {
        // if (groups !== null) {
        //     $scope.sort = groups[1];

        // } else {
        //     $scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';

        // }

        $scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';
        console.log('[rpPostsCtrl] $scope.sort: ' + $scope.sort);

        //Check if sort is valid,
        // var sorts = ['hot', 'new', 'controversial', 'rising', 'top', 'gilded'];

        // console.log('[rpPostsCtrl] scope.sort in sorts: ' + $scope.sort in sorts);

        // if (!$scope.sort in sorts) {
        //     $location.path('/error/404');
        // } else {

        // }



        // $scope.layout = rpSettingsUtilService.settings.layout;
        // console.log('[rpPostControllers] $scope.layout: ' + $scope.layout);

        var t = $routeParams.t ? $routeParams.t : 'week';
        var loadingMore = false;
        $scope.showSub = true;

        // var loadLimit = 12;
        // var loadLimit = 24;
        var loadLimit = 48;
        var moreLimit = 24;
        var adFrequency = 15;
        var adCount = 0;

        if ($scope.sort === 'top' || $scope.sort === 'controversial') {
            $rootScope.$emit('rp_button_visibility', 'showPostTime', true);
        }

        if (angular.isUndefined($scope.subreddit)) {
            rpTitleChangeUtilService('frontpage', true, true);

        } else if ($scope.subreddit === 'all') {
            rpTitleChangeUtilService('r/all', true, true);

        }

        if (angular.isUndefined($scope.subreddit) || $scope.subreddit === 'all') {
            $rootScope.$emit('rp_button_visibility', 'showSubscribe', false);
            $scope.showSub = true;
            $rootScope.$emit('rp_button_visibility', 'showRules', false);
        }

        if (!angular.isUndefined($scope.subreddit) && $scope.subreddit !== 'all') {
            $scope.showSub = false;
            rpTitleChangeUtilService('r/' + $scope.subreddit, true, true);
            rpSubredditsUtilService.setSubreddit($scope.subreddit);
            $rootScope.$emit('rp_button_visibility', 'showSubscribe', true);
            $rootScope.$emit('rp_button_visibility', 'showRules', true);

        }

        console.log('[rpPostsCtrl] rpSubredditsUtilService.currentSub: ' + rpSubredditsUtilService.currentSub);

        if (rpAuthUtilService.isAuthenticated) {
            rpIdentityUtilService.getIdentity(function(identity) {
                $scope.identity = identity;
            });
        }

        //used to only add posts for the current load opertaion.
        //needs to be set before loadPosts is called.
        var currentLoad = 0;

        $scope.singleColumnLayout = rpSettingsUtilService.settings.singleColumnLayout;
        $scope.listView = rpSettingsUtilService.settings.listView;
        loadPosts();
        /**
         * EVENT HANDLERS
         */

        var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function() {

            if (rpSettingsUtilService.settings.listView) {

                if ($scope.listView !== rpSettingsUtilService.settings.listView) {
                    $scope.listView = rpSettingsUtilService.settings.listView;
                    loadPosts();
                }
            } else {
                if ($scope.singleColumnLayout !== rpSettingsUtilService.settings.singleColumnLayout) {
                    $scope.singleColumnLayout = rpSettingsUtilService.settings.singleColumnLayout;
                    loadPosts();
                }

            }

            console.log('[rpPostsCtrl] rp_settings_changed, $scope.singleColumnLayout: ' + $scope.singleColumnLayout);
            console.log('[rpPostsCtrl] rp_settings_changed, $scope.listView: ' + $scope.listView);
        });

        var deregisterPostTimeClick = $rootScope.$on('rp_post_time_click', function(e, time) {
            t = time;

            if ($scope.subreddit) {
                rpLocationUtilService(null, '/r/' + $scope.subreddit + '/' + $scope.sort, 't=' + t, false, false);

            } else {
                rpLocationUtilService(null, $scope.sort, 't=' + t, false, false);
            }

            loadPosts();

        });

        /**
         * CONTROLLER API
         * */

        $scope.thisController = this;

        this.completeDeleting = function(id) {
            console.log('[rpPostCtrl] this.completeDeleting()');

            $scope.posts.forEach(function(postIterator, i) {
                if (postIterator.data.name === id) {
                    $scope.posts.splice(i, 1);
                }

            });

        };

        var deregisterHidePost = $scope.$on('rp_hide_post', function(e, id) {
            console.log('[rpPostCtrl] onHidePost(), id: ' + id);

            $scope.posts.forEach(function(postIterator, i) {
                if (postIterator.data.name === id) {
                    $scope.posts.splice(i, 1);
                    $timeout(angular.noop, 0);
                }

            });

        });

        var deregisterPostSortClick = $rootScope.$on('rp_post_sort_click', function(e, sort) {
            console.log('[rpPostsCtrl] onTabClick(), tab: ' + sort);

            $scope.posts = {};
            $scope.noMorePosts = false;
            $scope.sort = sort;

            if ($scope.subreddit) {
                rpLocationUtilService(null, '/r/' + $scope.subreddit + '/' + $scope.sort, '', false, false);
            } else {
                rpLocationUtilService(null, $scope.sort, '', false, false);
            }

            if (sort === 'top' || sort === 'controversial') {
                $rootScope.$emit('rp_button_visibility', 'showPostTime', true);
            } else {
                $rootScope.$emit('rp_button_visibility', 'showPostTime', false);
            }

            loadPosts();

        });

        var deregisterRefresh = $rootScope.$on('rp_refresh', function() {
            console.log('[rpPostsCtrl] rp_refresh');
            $rootScope.$emit('rp_refresh_button_spin', true);
            loadPosts();
        });

        /**
         * SCOPE FUNCTIONS
         * */

        /*
            Load more posts using the 'after' parameter.
         */

        $scope.cardClick = function() {
            console.log('[rpPostsCtrl] cardClick()');
        };

        $scope.showContext = function(e, post) {
            console.log('[rpPostsCtrl] showContext()');

            rpLocationUtilService(e, '/r/' + post.data.subreddit +
                '/comments/' +
                $filter('rp_name_to_id36')(post.data.link_id) +
                '/' + post.data.id + '/', 'context=8', true, false);
        };

        var afterPost = 1;

        $scope.morePosts = function(after) {
            console.log('[rpPostsCtrl] morePosts(), loadingMore: ' + loadingMore);

            if ($scope.posts && $scope.posts.length > 0) {

                // calculating the last post to use as after in posts request

                //use if there are ads in the page
                var lastPost;

                for (var i = $scope.posts.length - 1; i > 0; i--) {
                    if (!$scope.posts[i].isAd) {
                        lastPost = $scope.posts[i];
                        break;
                    }
                }

                var lastPostName = lastPost.data.name;

                //use if there are no ads
                // var lastPostName = $scope.posts[$scope.posts.length - afterPost].data.name;

                console.log('[rpPostsCtrl] morePosts(), 1, lastPostName: ' + lastPostName + ', loadingMore: ' + loadingMore);
                if (lastPostName && !loadingMore) {
                    console.log('[rpPostsCtrl] morePosts(), 2');
                    loadingMore = true;
                    $rootScope.$emit('rp_progress_start');
                    // $rootScope.$emit('rp_suspendable_suspend');

                    var thisLoad = ++currentLoad;

                    rpPostsUtilService($scope.subreddit, $scope.sort, lastPostName, t, moreLimit, function(err, data) {

                        console.log('[rpPostsCtrl] load-tracking morePosts(), thisLoad: ' + thisLoad + ', currentLoad: ' + currentLoad);

                        if (thisLoad === currentLoad) {
                            console.log('[rpPostsCtrl] morePosts(), 3');

                            $rootScope.$emit('rp_progress_stop');

                            if (err) {
                                console.log('[rpPostsCtrl] err');
                            } else {
                                console.log('[rpPostsCtrl] morePosts(), data.length: ' + data.get.data.children.length);

                                if (data.get.data.children.length < moreLimit) {
                                    $scope.noMorePosts = true;
                                } else {
                                    $scope.noMorePosts = false;
                                }

                                if (data.get.data.children.length > 0) {

                                    // // insert ads
                                    // for (var i = 1; i < data.get.data.children.length; i++) {
                                    //     if (i % adFrequency === 0) {
                                    //         data.get.data.children.splice(i, 0, {
                                    //             isAd: true
                                    //         });
                                    //     } else {
                                    //         data.get.data.children[i].isAd = false;
                                    //     }
                                    // }

                                    afterPost = 1;
                                    addPosts(data.get.data.children, true);
                                } else {
                                    console.log('[rpPostsCtrl] morePosts(), no more posts error, data: ' + JSON.stringify(data));
                                    loadingMore = false;
                                    afterPost++;
                                    $scope.morePosts();
                                }

                                // Array.prototype.push.apply($scope.posts, data.get.data.children);
                                // addPostsInBatches(data.get.data.children, 6);

                                // $rootScope.$emit('rp_suspendable_resume');

                            }

                        }

                        loadingMore = false;

                    });

                } else if (loadingMore === true) {
                    $rootScope.$emit('rp_progress_start');
                }
            }
        };


        /*
            Load Posts
         */


        function loadPosts() {

            var thisLoad = ++currentLoad;

            $scope.posts = [];
            $scope.havePosts = false;
            $scope.noMorePosts = false;
            $rootScope.$emit('rp_progress_start');

            rpPostsUtilService($scope.subreddit, $scope.sort, '', t, loadLimit, function(err, data) {

                console.log('[rpPostsCtrl] load-tracking loadPosts(), currentLoad: ' + currentLoad + ', thisLoad: ' + thisLoad);

                if (thisLoad === currentLoad) {
                    $rootScope.$emit('rp_progress_stop');

                    if (err) {
                        console.log('[rpPostsCtrl] err.status: ' + JSON.stringify(err.status));

                    } else {

                        $scope.havePosts = true;
                        $rootScope.$emit('rp_button_visibility', 'showRefresh', true);
                        $rootScope.$emit('rp_refresh_button_spin', false);


                        // console.log('[rpPostsCtrl] data.get.data.children[0]: ' + JSON.stringify(data.get.data.children[0]));
                        console.log('[rpPostsCtrl] data.length: ' + data.get.data.children.length);
                        /*
                        detect end of subreddit.
                        */
                        if (data.get.data.children.length < loadLimit) {
                            $scope.noMorePosts = true;
                        }

                        if (data.get.data.children.length > 0) {

                            if ($scope.subreddit === 'random') {
                                console.log('[rpPostCtrl] loadPosts() random, subreddit: ' + $scope.subreddit);
                                $scope.subreddit = data.get.data.children[0].data.subreddit;
                                console.log('[rpPostCtrl] loadPosts() random, subreddit: ' + $scope.subreddit);
                                rpTitleChangeUtilService('r/' + $scope.subreddit, true, true);
                                rpLocationUtilService(null, '/r/' + $scope.subreddit, '', false, true);
                            }

                            // insert an ads.
                            // for (var i = 1; i < data.get.data.children.length; i++) {
                            //     if (i % adFrequency === 0) {
                            //         data.get.data.children.splice(i, 0, {
                            //             isAd: true
                            //         });
                            //     } else {
                            //         data.get.data.children[i].isAd = false;
                            //     }
                            // }

                            // add posts using addPosts()
                            addPosts(data.get.data.children, false);

                            // data.get.data.children[0].isAd = true;
                            // data.get.data.children[1].isAd = true;
                            // data.get.data.children[2].isAd = true;

                            // add posts directly
                            // console.log('[rpPostsCtrl] add posts directly');
                            // $scope.posts = data.get.data.children;
                            // Array.prototype.push.apply($scope.posts, data.get.data.children);

                            $timeout(function() {
                                $window.prerenderReady = true;

                            }, 10000);

                        }

                        // for (var i = 0; i < data.get.data.children.length; i++) {
                        //
                        //
                        //
                        // 	var shortestColumn = getShortestColumn();
                        // 	console.log('[rpPostsCtrl] adding post ' + i + ' to column ' + shortestColumn);
                        // 	data.get.data.children[i].column = getShortestColumn();
                        // 	// Array.prototype.push.apply($scope.posts, data.get.data.children[i]);
                        // 	// $scope.posts.push(data.get.data.children[i]);
                        //
                        // 	$timeout(addPost(data.get.data.children[i]));
                        //
                        // 	// $scope.$digest();
                        //
                        //
                        //
                        // }




                        // Array.prototype.push.apply($scope.posts, data.get.data.children);
                        // $scope.posts = data.get.data.children;
                        // addPostsInBatches(data.get.data.children, 1);
                    }

                }

            });

        }

        //Adds a single post to scope,
        //calls itself to add next.
        function addPosts(posts, putInShortest) {

            console.log('[rpPostsCtrl] addPosts, posts.length: ' + posts.length);

            // if ($scope.posts.length !== 0 && adCount < 3 && $scope.posts.length % adFrequency === 0) {
            //     console.log('[rpPostsCtrl] addPosts(), insert ad');
            //
            //     $scope.posts.push({
            //         isAd: true,
            //         column: getColumn(putInShortest)
            //     });
            //
            //     adCount++;
            //
            // }

            var duplicate = false;

            if (!posts[0].data.hidden) {

                for (var i = 0; i < $scope.posts.length; i++) {
                    if ($scope.posts[i].data.id === posts[0].data.id) {

                        if ($scope.posts[i].data.id === posts[0].data.id) {
                            console.log('[rpPostsCtrl] addPosts, duplicate post detected, $scope.posts[i].data.id: ' + $scope.posts[i].data.id);
                            duplicate = true;
                            break;
                        }
                    }
                }


                var post = posts.shift();

                if (duplicate === false) {
                    post.column = getColumn(putInShortest);
                    $scope.posts.push(post);

                }

            }
            // addPosts(posts, putInShortest);

            $timeout(function() {
                if (posts.length > 0) {
                    addPosts(posts, putInShortest);
                }

            }, 50);

        }

        function getColumn(putInShortest) {

            // console.time('getShortestColumn');

            // var columns = angular.element('.rp-posts-col');
            var columns = angular.element('.rp-col-wrapper');

            var shortestColumn;
            var shortestHeight;

            if (putInShortest) {
                columns.each(function(i) {
                    var thisHeight = jQuery(this).height();
                    if (angular.isUndefined(shortestColumn) || thisHeight < shortestHeight) {
                        shortestHeight = thisHeight;
                        shortestColumn = i;
                    }
                });

                return shortestColumn;

            } else {
                return $scope.posts.length % columns.length;
            }

            // console.log('[rpPostsCtrl] getShortestColumn(), shortestColumn: ' + shortestColumn + ', shortestHeight: ' + shortestHeight);

            // console.timeEnd('getShortestColumn');

        }

        var deregisterWindowResize = $rootScope.$on('rp_window_resize', function(e, to) {

            if (!angular.isUndefined($scope.posts)) {
                for (var i = 0; i < $scope.posts.length; i++) {
                    $scope.posts[i].column = i % to;
                }

            }


            // var posts = $scope.posts;
            // $scope.posts = [];
            // addPosts(posts);

        });


        function addBatch(first, last, posts) {
            console.log('[rpPostCtrl] addBatch(), first: ' + first + ', last: ' + last + ', $scope.posts.length: ' + $scope.posts.length);

            if ($scope.posts.length > 0) {
                $scope.posts = Array.prototype.concat.apply($scope.posts, posts.slice(first, last));
            } else {
                $scope.posts = posts.slice(first, last);
            }

            return $timeout(angular.noop, 0);
        }

        function addPostsInBatches(posts, batchSize) {
            console.log('[rpPostCtrl] addPostsInBatches(), posts.length: ' + posts.length + ', batchSize: ' + batchSize);
            var addNextBatch;
            var addPostsAndRender = $q.when();

            for (var i = 0; i < posts.length; i += batchSize) {
                addNextBatch = angular.bind(null, addBatch, i, Math.min(i + batchSize, posts.length), posts);
                addPostsAndRender = addPostsAndRender.then(addNextBatch);

            }

            return addPostsAndRender;
        }

        var deregisterSlideshowGetPost = $rootScope.$on('rp_slideshow_get_post', function(e, i, callback) {
            if (i >= $scope.posts.length / 2) {
                $scope.morePosts();
            }
            callback($scope.posts[i]);
        });

        var deregisterSlideshowGetShowSub = $rootScope.$on('rp_slideshow_get_show_sub', function(e, callback) {
            callback($scope.showSub);
        });

        $scope.$on('$destroy', function() {
            console.log('[rpPostsCtrl] $destroy, $scope.subreddit: ' + $scope.subreddit);
            deregisterSlideshowGetPost();
            deregisterSlideshowGetShowSub();
            deregisterSettingsChanged();
            deregisterPostTimeClick();
            deregisterPostSortClick();
            deregisterWindowResize();
            deregisterRefresh();
            deregisterHidePost();
        });

    }
]);

rpPostControllers.controller('rpPostsTimeFilterCtrl', ['$scope', '$rootScope', '$routeParams',
    function($scope, $rootScope, $routeParams) {

        $scope.times = [{
                label: 'this hour',
                value: 'hour'
            }, {
                label: 'today',
                value: 'day'
            }, {
                label: 'this week',
                value: 'week'
            }, {
                label: 'this month',
                value: 'month'
            }, {
                label: 'this year',
                value: 'year'
            }, {
                label: 'all time',
                value: 'all'
            }

        ];

        if (angular.isDefined($routeParams.t)) {
            for (var i = 0; i < $scope.times.length; i++) {
                if ($scope.sorts[i].value === $routeParams.t) {
                    $scope.postTime = $scope.times[i];
                    break;
                }
            }
        }

        if (angular.isUndefined($scope.postTime)) {
            $scope.postTime = {
                label: 'today',
                value: 'day'
            };
        }

        $scope.selectTime = function() {
            $rootScope.$emit('rp_post_time_click', $scope.postTime.value);
        };

    }
]);

rpPostControllers.controller('rpPostSortCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    function(
        $scope,
        $rootScope,
        $routeParams
    ) {

        $scope.sorts = [{
            label: 'hot',
            value: 'hot'
        }, {
            label: 'new',
            value: 'new'
        }, {
            label: 'rising',
            value: 'rising'
        }, {
            label: 'controversial',
            value: 'controversial'
        }, {
            label: 'top',
            value: 'top'
        }, {
            label: 'gilded',
            value: 'gilded'
        }];

        initValue();

        $scope.selectSort = function() {
            $rootScope.$emit('rp_post_sort_click', $scope.postSort.value);
        };

        var deregisterRouteChangeSuccess = $rootScope.$on('$routeChangeSuccess', function() {
            console.log('[rpPostSortCtrl] onRouteChange');
            initValue();
        });


        function initValue() {
            console.log('[rpPostSortCtrl] initValue(), $routeParams.sort: ' + $routeParams.sort);

            var sort;

            if (angular.isDefined($routeParams.sort)) {
                for (var i = 0; i < $scope.sorts.length; i++) {
                    if ($scope.sorts[i].value === $routeParams.sort) {
                        sort = $scope.sorts[i];
                        break;
                    }
                }
            }

            if (angular.isUndefined(sort)) {
                sort = {
                    label: 'hot',
                    value: 'hot'
                };
            }

            $scope.postSort = sort;

        }

        $scope.$on('$destroy', function() {
            deregisterRouteChangeSuccess();
        });

    }
]);