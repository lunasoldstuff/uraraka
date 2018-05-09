(function () {
  'use strict';

  function rpPostCtrl(
    $scope,
    $rootScope,
    $routeParams,
    $window,
    $filter,
    $timeout,
    $q,
    $location,
    rpPostService,
    rpAppTitleChangeService,
    rpSubredditsService,
    rpAppLocationService,
    rpAppAuthService,
    rpIdentityService,
    rpToolbarButtonVisibilityService,
    rpSettingsService,
    rpProgressService
  ) {
    // load limits
    const LOAD_LIMIT = 48;
    const MORE_LIMIT = 24;

    // load tracking
    var currentLoad = 0;
    var afterPost = 1;
    var loadingMore = false;
    var thisLoad;

    // event handlers
    var deregisterSettingsChanged;
    var deregisterPostTimeClick;
    var deregisterSlideshowGetShowSub;
    var deregisterSlideshowGetPost;
    var deregisterWindowResize;
    var deregisterRefresh;
    var deregisterPostSortClick;
    var deregisterHidePost;
    var deregisterLayoutWatcher;


    rpToolbarButtonVisibilityService.hideAll();
    rpToolbarButtonVisibilityService.showButton('showPostSort');
    rpToolbarButtonVisibilityService.showButton('showLayout');

    console.log('[rpPostCtrl]');

    /*
      Load Posts
     */
    function getColumn(putInShortest) {
      var shortestColumn;
      var shortestHeight;
      var columns = angular.element('.rp-col-wrapper');

      if (putInShortest) {
        columns.each(function (i) {
          var thisHeight = jQuery(this)
            .height();
          if (
            angular.isUndefined(shortestColumn) ||
            thisHeight < shortestHeight
          ) {
            shortestHeight = thisHeight;
            shortestColumn = i;
          }
        });

        return shortestColumn;
      }
      return $scope.posts.length % columns.length;
    }

    // Adds a posts one at a time,
    function addPosts(posts, putInShortest) {
      var i;
      let duplicate = false;
      let post;

      if (!posts[0].data.hidden) {
        for (i = 0; i < $scope.posts.length; i++) {
          if ($scope.posts[i].data.id === posts[0].data.id) {
            if ($scope.posts[i].data.id === posts[0].data.id) {
              console.log('[rpPostCtrl] addPosts, duplicate post detected, $scope.posts[i].data.id: ' +
                $scope.posts[i].data.id);
              duplicate = true;
              break;
            }
          }
        }

        post = posts.shift();

        if (duplicate === false) {
          post.column = getColumn(putInShortest);
          $scope.posts.push(post);
        }
      }

      $timeout(function () {
        if (posts.length > 0) {
          addPosts(posts, putInShortest);
        }
      }, 50);
    }

    function addBatch(first, last, posts) {
      console.log('[rpPostCtrl] addBatch(), first: ' +
        first +
        ', last: ' +
        last +
        ', $scope.posts.length: ' +
        $scope.posts.length);

      if ($scope.posts.length > 0) {
        $scope.posts = Array.prototype.concat.apply(
          $scope.posts,
          posts.slice(first, last)
        );
      } else {
        $scope.posts = posts.slice(first, last);
      }

      return $timeout(angular.noop, 0);
    }

    function addPostsInBatches(posts, batchSize) {
      var addNextBatch;
      var addPostsAndRender = $q.when();
      var i;
      console.log('[rpPostCtrl] addPostsInBatches(), posts.length: ' +
        posts.length +
        ', batchSize: ' +
        batchSize);

      for (i = 0; i < posts.length; i += batchSize) {
        addNextBatch = angular.bind(
          null,
          addBatch,
          i,
          Math.min(i + batchSize, posts.length),
          posts
        );
        addPostsAndRender = addPostsAndRender.then(addNextBatch);
      }

      return addPostsAndRender;
    }

    function loadPosts() {
      console.log('[rpPostCtrl] loadPosts()');
      thisLoad = ++currentLoad;

      $scope.posts = [];
      $scope.havePosts = false;
      $scope.noMorePosts = false;
      rpProgressService.showProgress();

      rpPostService(
        $scope.subreddit,
        $scope.sort,
        '',
        $scope.t,
        LOAD_LIMIT,
        function (err, data) {
          console.log('[rpPostCtrl] load-tracking loadPosts(), currentLoad: ' +
            currentLoad +
            ', thisLoad: ' +
            thisLoad);

          if (thisLoad === currentLoad) {
            rpProgressService.hideProgress();

            if (err) {
              console.log('[rpPostCtrl] err.status: ' + JSON.stringify(err.status));
            } else {
              console.log('[rpPostCtrl] data.length: ' + data.get.data.children.length);
              $scope.havePosts = true;
              rpToolbarButtonVisibilityService.showButton('showRefresh');
              rpToolbarButtonVisibilityService.showButton('showSlideshow');

              $rootScope.$emit('rp_refresh_button_spin', false);

              if (data.get.data.children.length < LOAD_LIMIT) {
                $scope.noMorePosts = true;
              } else {
                $scope.noMorePosts = false;
              }

              if (data.get.data.children.length > 0) {
                if ($scope.subreddit === 'random') {
                  $scope.subreddit = data.get.data.children[0].data.subreddit;
                  rpAppTitleChangeService.changeTitles('r/' + $scope.subreddit);
                  rpAppLocationService(
                    null,
                    '/r/' + $scope.subreddit,
                    '',
                    false,
                    true
                  );
                  console.log('[rpPostCtrl] loadPosts() random, subreddit: ' +
                    $scope.subreddit);
                  console.log('[rpPostCtrl] loadPosts() random, subreddit: ' +
                    $scope.subreddit);
                }

                addPosts(data.get.data.children, false);

                if (angular.isUndefined(deregisterLayoutWatcher)) {
                  deregisterLayoutWatcher = $scope.$watch(() => {
                    return rpSettingsService.getSetting('layout');
                  }, (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                      loadPosts();
                    }
                  });
                }

                $timeout(function () {
                  // FIXME: should we be using angular $window? it is a service.
                  // Check each variant to see if property is set correctly.
                  window.prerenderReady = true;
                  // $window.prerenderReady = true;
                }, 10000);
              }
            }
          }
        }
      );
    }

    function initPostCtrl() {
      if (rpAppAuthService.isAuthenticated) {
        rpIdentityService.getIdentity(function (identity) {
          $scope.identity = identity;
        });
      }

      $scope.subreddit = $routeParams.sub;
      $scope.sort = $routeParams.sort ? $routeParams.sort : 'hot';
      $scope.t = angular.isDefined($routeParams.t) ? $routeParams.t : 'week';

      if (angular.isUndefined($scope.subreddit)) {
        rpAppTitleChangeService.changeTitles('frontpage');
      } else if ($scope.subreddit === 'all') {
        rpAppTitleChangeService.changeTitles('r/all');
      }

      if (angular.isDefined($scope.subreddit) && $scope.subreddit !== 'all') {
        $scope.showSub = false;
        rpAppTitleChangeService.changeTitles('r/' + $scope.subreddit);
        rpSubredditsService.setSubreddit($scope.subreddit);
        rpToolbarButtonVisibilityService.showButton('showSubscribe');
        rpToolbarButtonVisibilityService.showButton('showRules');
      } else {
        $scope.showSub = true;
        rpToolbarButtonVisibilityService.hideButton('showSubscribe');
        rpToolbarButtonVisibilityService.hideButton('showRules');
        rpSubredditsService.resetSubreddit();
      }

      if ($scope.sort === 'top' || $scope.sort === 'controversial') {
        rpToolbarButtonVisibilityService.showButton('showPostTime');
      }


      loadPosts();

      console.log(`[rpPostCtrl] $scope.subreddit: ${$scope.subreddit}`);
      console.log('[rpPostCtrl] $scope.sort: ' + $scope.sort);
      console.log('[rpPostCtrl] rpSubredditsService.currentSub: ' +
        rpSubredditsService.currentSub);
    }

    /**
     * SCOPE FUNCTIONS
     * */
    $scope.thisController = this;

    this.completeDeleting = function (id) {
      console.log('[rpPostCtrl] this.completeDeleting()');

      $scope.posts.forEach(function (postIterator, i) {
        if (postIterator.data.name === id) {
          $scope.posts.splice(i, 1);
        }
      });
    };

    $scope.showContext = function (e, post) {
      console.log('[rpPostCtrl] showContext()');

      rpAppLocationService(
        e,
        '/r/' +
        post.data.subreddit +
        '/comments/' +
        $filter('rpAppNameToId36Filter')(post.data.link_id) +
        '/' +
        post.data.id +
        '/',
        'context=8',
        true,
        false
      );
    };

    $scope.morePosts = function () {
      console.log('[rpPostCtrl] morePosts(), loadingMore: ' + loadingMore);

      if ($scope.posts && $scope.posts.length > 0) {
        // calculating the last post to use as after in posts request
        let lastPostName =
          $scope.posts[$scope.posts.length - afterPost].data.name;

        console.log('[rpPostCtrl] morePosts(), 1, lastPostName: ' +
          lastPostName +
          ', loadingMore: ' +
          loadingMore);

        if (lastPostName && !loadingMore) {
          console.log('[rpPostCtrl] morePosts(), 2');
          loadingMore = true;
          rpProgressService.showProgress();

          thisLoad = ++currentLoad;

          rpPostService(
            $scope.subreddit,
            $scope.sort,
            lastPostName,
            $scope.t,
            MORE_LIMIT,
            function (err, data) {
              console.log('[rpPostCtrl] load-tracking morePosts(), thisLoad: ' +
                thisLoad +
                ', currentLoad: ' +
                currentLoad);

              if (thisLoad === currentLoad) {
                console.log('[rpPostCtrl] morePosts(), 3');

                rpProgressService.hideProgress();

                if (err) {
                  console.log('[rpPostCtrl] err');
                } else {
                  console.log('[rpPostCtrl] morePosts(), data.length: ' +
                    data.get.data.children.length);

                  if (data.get.data.children.length < MORE_LIMIT) {
                    $scope.noMorePosts = true;
                  } else {
                    $scope.noMorePosts = false;
                  }

                  if (data.get.data.children.length > 0) {
                    afterPost = 1;
                    addPosts(data.get.data.children, true);
                  } else {
                    console.log('[rpPostCtrl] morePosts(), no more posts error, data: ' +
                      JSON.stringify(data));
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
            }
          );
        } else if (loadingMore === true) {
          rpProgressService.showProgress();
        }
      }
    };

    /**
     * EVENT HANDLERS
     */

    deregisterPostSortClick = $rootScope.$on('rp_post_sort_click', function (
      e,
      sort
    ) {
      console.log('[rpPostCtrl] onTabClick(), tab: ' + sort);

      $scope.posts = {};
      $scope.noMorePosts = false;
      $scope.sort = sort;

      if ($scope.subreddit) {
        rpAppLocationService(
          null,
          '/r/' + $scope.subreddit + '/' + $scope.sort,
          '',
          false,
          false
        );
      } else {
        rpAppLocationService(null, $scope.sort, '', false, false);
      }

      if (sort === 'top' || sort === 'controversial') {
        rpToolbarButtonVisibilityService.showButton('showPostTime');
      } else {
        rpToolbarButtonVisibilityService.hideButton('showPostTime');
      }

      loadPosts();
    });

    deregisterHidePost = $scope.$on('rp_hide_post', function (e, id) {
      var i;
      for (i = 0; i < $scope.posts.length; i++) {
        if ($scope.posts[i].data.name === id) {
          $scope.posts.splice(i, 1);
        }
      }
    });

    deregisterRefresh = $rootScope.$on('rp_refresh', function () {
      console.log('[rpPostCtrl] rp_refresh');
      $rootScope.$emit('rp_refresh_button_spin', true);
      // TODO: Cancel any ongoing loads before laoding new content
      loadPosts();
    });

    deregisterWindowResize = $rootScope.$on('rp_window_resize', function (
      e,
      to
    ) {
      var i;
      if (!angular.isUndefined($scope.posts)) {
        for (i = 0; i < $scope.posts.length; i++) {
          $scope.posts[i].column = i % to;
        }
      }
    });

    deregisterSlideshowGetPost = $rootScope.$on(
      'rp_slideshow_get_post',
      function (e, i, callback) {
        if (i >= $scope.posts.length / 2) {
          $scope.morePosts();
        }
        callback($scope.posts[i]);
      }
    );

    deregisterSlideshowGetShowSub = $rootScope.$on(
      'rp_slideshow_get_show_sub',
      function (e, callback) {
        callback($scope.showSub);
      }
    );

    deregisterPostTimeClick = $rootScope.$on('rp_post_time_click', function (
      e,
      time
    ) {
      $scope.t = time;

      if ($scope.subreddit) {
        rpAppLocationService(
          null,
          '/r/' + $scope.subreddit + '/' + $scope.sort,
          't=' + $scope.t,
          false,
          false
        );
      } else {
        rpAppLocationService(null, $scope.sort, 't=' + $scope.t, false, false);
      }

      loadPosts();
    });

    initPostCtrl();

    $scope.$on('$destroy', function () {
      console.log('[rpPostCtrl] $destroy, $scope.subreddit: ' + $scope.subreddit);
      deregisterSlideshowGetPost();
      deregisterSlideshowGetShowSub();
      deregisterPostTimeClick();
      deregisterPostSortClick();
      deregisterWindowResize();
      deregisterRefresh();
      deregisterHidePost();
      deregisterLayoutWatcher();
    });
  }

  angular
    .module('rpPost')
    .controller('rpPostCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      '$window',
      '$filter',
      '$timeout',
      '$q',
      '$location',
      'rpPostService',
      'rpAppTitleChangeService',
      'rpSubredditsService',
      'rpAppLocationService',
      'rpAppAuthService',
      'rpIdentityService',
      'rpToolbarButtonVisibilityService',
      'rpSettingsService',
      'rpProgressService',
      rpPostCtrl
    ]);
}());
