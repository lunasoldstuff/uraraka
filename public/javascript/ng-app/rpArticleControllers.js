'use strict';

var rpArticleControllers = angular.module('rpArticleControllers', []);

rpArticleControllers.controller('rpArticleTabsCtrl', ['$scope', '$timeout',
    function($scope, $timeout) {
        console.log('[rpArticleTabsCtrl]');

        $scope.tabClick = function(tab) {
            console.log('[rpArticleTabsCtrl] tabClick(), tab: ' + tab);
            $timeout(function() {
                console.log('[rpArticleTabsCtrl] tabClick timeout');
                $scope.parentCtrl.tabClick(tab);

            }, 350);
        };

    }
]);

rpArticleControllers.controller('rpArticleButtonCtrl', [
    '$scope',
    '$rootScope',
    '$filter',
    '$mdDialog',
    '$mdBottomSheet',
    'rpSettingsUtilService',
    'rpLocationUtilService',
    function(
        $scope,
        $rootScope,
        $filter,
        $mdDialog,
        $mdBottomSheet,
        rpSettingsUtilService,
        rpLocationUtilService
    ) {

        $scope.showArticle = function(e, context) {
            console.log('[rpArticleButtonCtrl] $scope.showArticle(), comment: ' + comment);

            // $rootScope.$emit('rp_suspendable_suspend');

            var article;
            var subreddit;
            var comment;
            var anchor;

            if ($scope.post) { //rpLink passing in a post, easy.
                console.log('[rpArticleButtonCtrl] $scope.showArticle() post, isComment: ' + $scope.isComment);

                article = $scope.isComment ? $filter('rp_name_to_id36')($scope.post.data.link_id) : $scope.post.data.id;
                console.log('[rpArticleButtonCtrl] $scope.showArticle() article: ' + article);

                subreddit = $scope.post.data.subreddit;
                console.log('[rpArticleButtonCtrl] $scope.showArticle() subreddit: ' + subreddit);

                comment = $scope.isComment ? $scope.post.data.id : "";

                anchor = '#' + $scope.post.data.name;

            } else if ($scope.message) { //rpMessageComment...
                console.log('[rpArticleButtonCtrl] $scope.showArticle() message.');

                var messageContextRe = /^\/r\/([\w]+)\/comments\/([\w]+)\/(?:[\w]+)\/([\w]+)/;
                var groups = messageContextRe.exec($scope.message.data.context);

                if (groups) {
                    subreddit = groups[1];
                    article = groups[2];
                    comment = groups[3]; //only if we are showing context
                }

                anchor = '#' + $scope.message.data.name;

            }

            console.log('[rpArticleButtonCtrl] $scope.showArticle(), comment: ' + comment);

            var hideBottomSheet = function() {
                console.log('[rpArticleButtonCtrl] hideBottomSheet()');
                $mdBottomSheet.hide();
            };

            if (rpSettingsUtilService.settings.commentsDialog && !e.ctrlKey) {

                console.log('[rpArticleButtonCtrl] anchor: ' + anchor);
                $mdDialog.show({
                    controller: 'rpArticleDialogCtrl',
                    templateUrl: 'rpArticleDialog.html',
                    targetEvent: e,
                    locals: {
                        post: $scope.isComment ? undefined : $scope.post,
                        article: article,
                        comment: context ? comment : '',
                        subreddit: subreddit
                    },
                    clickOutsideToClose: true,
                    escapeToClose: false,
                    onRemoving: hideBottomSheet,

                });


            } else {
                console.log('[rpArticleButtonCtrl] $scope.showArticle() dont open in dialog.');

                var search = '';
                var url = '/r/' + subreddit + '/comments/' + article;

                if (context) {
                    url += '/' + comment + '/';
                    search = 'context=8';
                }

                rpLocationUtilService(e, url, search, true, false);
            }


        };

    }

]);

rpArticleControllers.controller('rpArticleDialogCtrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$filter',
    '$mdDialog',
    '$mdBottomSheet',
    'rpSettingsUtilService',
    'post',
    'article',
    'comment',
    'subreddit',
    function(
        $scope,
        $rootScope,
        $location,
        $filter,
        $mdDialog,
        $mdBottomSheet,
        rpSettingsUtilService,
        post,
        article,
        comment,
        subreddit
    ) {
        console.log('[rpArticleDialogCtrl]');
        $scope.animations = rpSettingsUtilService.settings.animations;
        $scope.dialog = true;

        $scope.post = post;
        $scope.article = article;
        $scope.comment = comment;
        $scope.subreddit = subreddit;

        console.log('[rpArticleDialogCtrl] $scope.article: ' + $scope.article);
        console.log('[rpArticleDialogCtrl] $scope.subreddit: ' + $scope.subreddit);
        console.log('[rpArticleDialogCtrl] $scope.comment: ' + $scope.comment);

        if (!angular.isUndefined($scope.post)) {
            console.log('[rpArticleDialogCtrl] $scope.post.data.title: ' + $scope.post.data.title);
        }

        //Close the dialog if user navigates to a new page.
        var deregisterLocationChangeSuccess = $scope.$on('$locationChangeSuccess', function() {
            $mdDialog.hide();
            $mdBottomSheet.hide();
        });

        $scope.$on('destroy', function() {
            // $rootScope.$emit('rp_suspendable_resume');
            deregisterLocationChangeSuccess();
        });

    }
]);

rpArticleControllers.controller('rpArticleCtrl', [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'debounce',
    'rpCommentsUtilService',
    'rpTitleChangeUtilService',
    'rpPostFilterButtonUtilService',
    'rpUserFilterButtonUtilService',
    'rpUserSortButtonUtilService',
    'rpSubscribeButtonUtilService',
    'rpSubredditsUtilService',
    'rpLocationUtilService',
    'rpSearchFormUtilService',
    'rpSearchFilterButtonUtilService',
    'rpToolbarShadowUtilService',
    'rpIdentityUtilService',
    'rpAuthUtilService',
    'rpSidebarButtonUtilService',
    'rpRefreshButtonUtilService',

    function(
        $scope,
        $rootScope,
        $routeParams,
        $timeout,
        $filter,
        $q,
        $http,
        debounce,
        rpCommentsUtilService,
        rpTitleChangeUtilService,
        rpPostFilterButtonUtilService,
        rpUserFilterButtonUtilService,
        rpUserSortButtonUtilService,
        rpSubscribeButtonUtilService,
        rpSubredditsUtilService,
        rpLocationUtilService,
        rpSearchFormUtilService,
        rpSearchFilterButtonUtilService,
        rpToolbarShadowUtilService,
        rpIdentityUtilService,
        rpAuthUtilService,
        rpSidebarButtonUtilService,
        rpRefreshButtonUtilService

    ) {

        console.log('[rpArticleCtrl] loaded.');

        console.log('[rpArticleCtrl] load, $scope.article: ' + $scope.article);
        console.log('[rpArticleCtrl] load, $scope.subreddit: ' + $scope.subreddit);
        console.log('[rpArticleCtrl] load, $scope.comment: ' + $scope.comment);

        if (angular.isDefined($scope.post)) {
            console.log('[rpArticleCtrl] load, $scope.post.data.title: ' + $scope.post.data.title);

        }

        /*
        	only set them from the routeParams if there aren't set by the button already...
         */

        if (angular.isUndefined($scope.article)) {
            $scope.article = $routeParams.article;
        }

        if (angular.isUndefined($scope.subreddit)) {
            $scope.subreddit = $routeParams.subreddit;
        }

        var commentRe = /^\w{7}$/;

        if (angular.isUndefined($scope.comment)) {
            if ($routeParams.comment && commentRe.test($routeParams.comment)) {
                $scope.cid = $routeParams.comment;

            } else {
                $scope.cid = "";
            }
        } else {
            $scope.cid = $scope.comment;
        }

        if ($routeParams.context) {
            $scope.context = $routeParams.context;
        } else if (!angular.isUndefined($scope.cid)) {
            $scope.context = 4;
        } else {
            $scope.context = 0;
        }

        $scope.sort = $routeParams.sort || 'confidence';

        console.log('[rpArticleCtrl] $scope.article: ' + $scope.article);
        console.log('[rpArticleCtrl] $scope.subreddit: ' + $scope.subreddit);
        console.log('[rpArticleCtrl] $scope.cid: ' + $scope.cid);
        console.log('[rpArticleCtrl] $scope.context: ' + $scope.context);
        console.log('[rpArticleCtrl] $scope.sort: ' + $scope.sort);

        $scope.isMine = null;

        /*
        	Toolbar stuff if we are not in a dialog.
         */

        if (!$scope.dialog) {
            rpPostFilterButtonUtilService.hide();
            rpUserFilterButtonUtilService.hide();
            rpUserSortButtonUtilService.hide();
            rpSearchFormUtilService.hide();
            rpSearchFilterButtonUtilService.hide();
            rpSubscribeButtonUtilService.show();
            rpToolbarShadowUtilService.hide();
            rpSidebarButtonUtilService.show();
            rpRefreshButtonUtilService.hide();

            rpTitleChangeUtilService('r/' + $scope.subreddit, true, true);

            rpSubredditsUtilService.setSubreddit($scope.subreddit);
        }

        var tabs = $scope.tabs = [{
            label: 'best',
            value: 'confidence'
        }, {
            label: 'top',
            value: 'top'
        }, {
            label: 'new',
            value: 'new'
        }, {
            label: 'hot',
            value: 'hot'
        }, {
            label: 'controvesial',
            value: 'controversial'
        }, {
            label: 'old',
            value: 'old'
        }, {
            label: 'q&a',
            value: 'qa'
        }, ];



        if (!$scope.dialog) {
            $rootScope.$emit('rp_tabs_changed', tabs);

        }

        for (var i = 0; i < tabs.length; i++) {
            if ($scope.sort === tabs[i].value) {
                if (!$scope.dialog) {
                    $rootScope.$emit('rp_tabs_selected_index_changed', i);

                } else {
                    $scope.selectedTab = i;

                }
                break;
            }
        }

        // var context = $routeParams.context || 0;

        $scope.threadLoading = true;
        $scope.postLoading = true;
        $scope.commentsLoading = false;
        //$timeout(angular.noop, 0);


        if (!$scope.post) {
            $rootScope.$emit('rp_progress_start');
        }

        /**
         * Scope Functions
         */
        $scope.disableCommentsScroll = function() {
            console.log('[rpArticleCtrl] disableCommentsScroll(), $scope.commentsScroll: ' + $scope.commentsScroll);
            if ($scope.commentsScroll) {
                $scope.commentsScroll = false;

            }
        };

        $scope.enableCommentsScroll = function() {
            console.log('[rpArticleCtrl] enableCommentsScroll(), $scope.commentsScroll: ' + $scope.commentsScroll);
            if (!$scope.commentsScroll) {
                $scope.commentsScroll = true;

            }
        };

        $scope.showCommentsLoading = function() {
            $scope.commentsLoading = true;
            $rootScope.$emit('rp_progress_start');
            $timeout(angular.noop, 0);
        };

        $scope.hideCommentsLoading = function() {
            $scope.commentsLoading = false;
            $rootScope.$emit('rp_progress_stop');
            $timeout(angular.noop, 0);
        };

        /**
         * CONTRPLLER API
         * */

        $scope.thisController = this;

        this.completeReplying = function(data, post) {
            this.isReplying = false;
            //$timeout(angular.noop, 0);
            console.log('[rpArticleCtrl] this.completeReplying(), $scope.comments: ' + $scope.comments);
            $scope.comments.unshift(data.json.data.things[0]);

            if ($scope.haveComments === false) {
                $scope.haveComments = true;

            }

        };

        this.completeDeleting = function(id) {
            console.log('[rpArticleCtrl] this.completeDelete()');
            this.isDeleting = false;
            $scope.deleted = true;
            //$timeout(angular.noop, 0);
        };

        this.completeEditing = function() {
            console.log('[rpArticleCtrl] this.completeEdit()');

            var thisController = this;

            reloadPost(function() {
                thisController.isEditing = false;
            });
        };

        var ignoredFirstTabClick = false;

        this.tabClick = function(tab) {
            console.log('[rpArticleCtrl] this.tabClick()');

            if (ignoredFirstTabClick) {
                $scope.sort = tab;

                // $scope.threadLoading = true;
                $scope.commentsLoading = true;
                $timeout(angular.noop, 0);

                loadPosts();
            } else {
                console.log('[rpArticleCtrl] this.tabClick(), tabClick() ignored');
                ignoredFirstTabClick = true;
            }
        };

        /**
         * EVENT HANDLERS
         */
        var deregisterTabClick = $rootScope.$on('rp_tab_click', function(e, tab) {
            console.log('[rpArticleCtrl] onTabClick()');

            $scope.sort = tab;

            if (!$scope.dialog) {
                rpLocationUtilService(null, '/r/' + $scope.subreddit + '/comments/' + $scope.article,
                    'sort=' + $scope.sort, false, false);
            }

            loadPosts();

        });

        var deregisterRefresh = $rootScope.$on('rp_refresh', function() {
            console.log('[rpArticleCtrl] rp_refresh');
            rpRefreshButtonUtilService.startSpinning();
            loadPosts();
        });


        /*
            relaod Post
         */

        function reloadPost(callback) {
            $scope.postLoading = true;

            rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.cid, $scope.context, function(err, data) {
                if (err) {
                    console.log('[rpArticleCtrl] err');
                } else {
                    console.log('[rpArticleCtrl] realodPost(), data: ' + JSON.stringify(data));

                    $scope.post = data[0].data.children[0];
                    $scope.postLoading = false;
                    $scope.editing = false;

                    if (callback) {
                        callback();

                    }

                }

            });

        }

        /**
         * Load the Post and Comments.
         */
        function loadPosts() {

            console.log('[rpArticleCtrl] loadPosts()');

            if (!$scope.dialog && angular.isUndefined($scope.post)) {
                $scope.post = null;
            }



            $scope.comments = [];
            // $scope.threadLoading = true;
            $scope.commentsLoading = true;
            $scope.noMoreComments = false; //$timeout(angular.noop, 0);
            $scope.disableCommentsScroll();

            rpCommentsUtilService($scope.subreddit, $scope.article, $scope.sort, $scope.cid, $scope.context, function(err, data) {
                $rootScope.$emit('rp_progress_stop');
                //$timeout(angular.noop, 0);

                if (err) {
                    console.log('[rpArticleCtrl] err');

                } else {
                    console.log('[rpArticleCtrl] loadPosts(), angular.isUndefined($scope.post): ' + angular.isUndefined($scope.post));

                    if (angular.isUndefined($scope.post) || $scope.post === null) {
                        $scope.post = data[0].data.children[0];
                    }

                    if ($scope.post.data.author.toLowerCase() === '[deleted]') {
                        $scope.deleted = true;
                    }

                    console.log('[rpArticleCtrl] $scope.post.data.name: ' + $scope.post.data.name);

                    $scope.threadLoading = false;
                    $scope.postLoading = false;
                    $scope.showCommentsLoading();
                    $timeout(angular.noop, 0);

                    if (!$scope.dialog) {
                        rpRefreshButtonUtilService.show();
                        rpRefreshButtonUtilService.stopSpinning();
                        //Put the title of the post in the page title.
                        rpTitleChangeUtilService($scope.post.data.title, true, false);
                    }

                    if (data[1].data.children.length > 0) {
                        $scope.haveComments = true;
                    } else {
                        $scope.haveComments = false;
                        $scope.noMoreComments = true;
                        $scope.hideCommentsLoading();
                    }

                    //Must wait to load the CommentCtrl until after the identity is gotten
                    //otherwise it might try to check identity.name before we have identity.
                    if (rpAuthUtilService.isAuthenticated) {
                        rpIdentityUtilService.getIdentity(function(identity) {
                            $scope.identity = identity;
                            $scope.isMine = ($scope.post.data.author === $scope.identity.name);
                            console.log('[rpArticleCtrl] $scope.isMine: ' + $scope.isMine);
                        });
                    }


                    if ($scope.haveComments) {
                        // $scope.comments.push(data[1].data.children);
                        console.log('[rpArticleCtrl] data[1].data.children.length: ' + data[1].data.children.length);

                        $timeout(function() {
                            // addNextComment();
                            addComments(data[1].data.children);
                        }, 2500);
                    }
                }
            });
        }

        $scope.moreComments = function() {
            console.log('[rpArticleCtrl] moreComments()');
            addSubtreeBatchToComments();
        };

        //subtree size
        var subtreeSize;
        var subtreeBatchSize;
        //subtree counters/management
        var subtrees;
        var subtreesCreated;
        var subtreesAttached;
        //subtree queue
        var attachSubtree;
        var subtreeQueue;

        function addComments(comments) {
            $scope.comments = [];
            //subtree size
            subtreeSize = 3;
            subtreeBatchSize = 12;
            //subtree counters/management
            subtrees = [];
            subtreesCreated = 0;
            subtreesAttached = 0;
            //subtree queue
            attachSubtree = null;
            subtreeQueue = $q.when();

            $rootScope.$emit('rp_start_watching_height');



            buildSubtrees(comments, 0);
            // $timeout(function() {
            //     addSubtreeBatchToComments();
            // }, 10000);
        }

        function buildSubtrees(comments, depth) {
            for (var i = 0; i < comments.length; i++) {

                var comment = comments[i];
                comment.depth = depth;
                var leaf = JSON.parse(JSON.stringify(comment));
                leaf.data.replies = "";
                leaf.depth = depth;

                if (!subtrees[subtreesCreated]) {

                    subtrees[subtreesCreated] = {
                        rootComment: leaf,
                        subtreeSize: 0,
                    };

                } else {
                    //use existing subtree
                    var branch = subtrees[subtreesCreated].rootComment;
                    var branchDepth = 0;
                    var insertionDepth = subtrees[subtreesCreated].subtreeSize;

                    while (
                        branch.data.replies && branch.data.replies !== '' &&
                        branch.data.replies.data.children.length > 0 &&
                        branchDepth < insertionDepth
                    ) {
                        branch = branch.data.replies.data.children[0];
                        branchDepth++;
                    }

                    if (
                        branch.data.replies === undefined ||
                        branch.data.replies === '' ||
                        branch.data.replies.data.children.length === 0
                    ) {

                        branch.data.replies = {
                            data: {
                                children: []
                            }
                        };

                    }

                    branch.data.replies.data.children.push(leaf);
                    subtrees[subtreesCreated].subtreeSize++;

                }

                //check if subtree is complete
                if (subtrees[subtreesCreated].subtreeSize === subtreeSize) {
                    subtreesCreated++;
                }

                //recurse children
                if (comment.data.replies && comment.data.replies !== '' && comment.data.replies.data.children.length > 0) {
                    buildSubtrees(comment.data.replies.data.children, depth + 1);
                }

                if (subtrees[subtreesCreated]) {
                    subtreesCreated++;

                }
            }

            if (depth === 0) {
                addSubtreeBatchToComments();
            }

        }

        function addSubtreeBatchToComments() {
            console.log('[rpArticleCtrl] addSubtreeBatchToComments(), subtreesAttached: ' + subtreesAttached);


            for (var i = 0; i < subtreeBatchSize; i++) {
                addSubtreeToQueue(subtreesAttached + i);
                // attachSubtreeToComments(subtreesAttached + i);

            }

            subtreesAttached += subtreeBatchSize;

            console.log('[rpArticleCtrl] addSuperBatchToComments(), subtreesAttached: ' + subtreesAttached + ', subtrees.length: ' + subtrees.length);
            if (subtreesAttached >= subtrees.length) {
                $scope.noMoreComments = true;
            }


        }

        function addSubtreeToQueue(subtreeIndex) {
            console.log('[rpArticleCtrl] addSubtreeToQueue() subtreeIndex: ' + subtreeIndex);

            attachSubtree = angular.bind(null, attachSubtreeToComments, subtreeIndex);
            subtreeQueue = subtreeQueue.then(attachSubtree);

        }

        function attachSubtreeToComments(subtreeIndex) {
            console.log('[rpArticleCtrl] attachSubtreeToComments(), began subtree: ' + subtreeIndex);

            if (subtrees[subtreeIndex]) {
                var subtree = subtrees[subtreeIndex].rootComment;
                var insertionDepth = subtree.depth - 1; //TODO both -1 and without seem to work..

                if (subtree.depth === 0) {
                    // console.log('[rpArticleCtrl] attachSubtreeToComments() insertion depth = 0');
                    $scope.comments.push(subtree);

                } else {
                    //last comment is the working branch
                    // console.log('[rpArticleCtrl] attachSubtreeToComments() insertion depth > 0, adding to branch...');

                    var branch = $scope.comments[$scope.comments.length - 1];
                    var branchDepth = 0;

                    // console.log('[rpArticleCtrl] attachSubtreeToComments() angular.isDefined(branch): ' + angular.isDefined(branch));

                    if (angular.isDefined(branch)) {

                        while (
                            branch.data.replies && branch.data.replies !== '' &&
                            branch.data.replies.data.children.length > 0 &&
                            branchDepth < insertionDepth
                        ) {
                            // console.log('[rpArticleCtrl] attachSubtreeToComments(), branchDepth: ' + branchDepth);
                            branch = branch.data.replies.data.children[branch.data.replies.data.children.length - 1];
                            branchDepth++;

                        }

                        // console.log('[rpArticleCtrl] attachSubtreeToComments(), branch found');

                        if (
                            angular.isUndefined(branch.data.replies) ||
                            branch.data.replies === '' ||
                            branch.data.replies.data.children.length === 0
                        ) {
                            branch.data.replies = {
                                data: {
                                    children: []
                                }
                            };

                        }

                        console.log('[rpArticleCtrl] attachSubtreeToComments(), branch primed for push, ' + subtreeIndex);
                        console.log('[rpArticleCtrl] attachSubtreeToComments(), branch primed for push, digest running: ' + $scope.$$phase);

                        branch.data.replies.data.children.push(subtree);


                    }
                }
            }
            return;
        } //attachSubtreeToComments

        loadPosts();



        $scope.$on('$destroy', function() {
            deregisterTabClick();
            deregisterRefresh();
        });

    }
]);
