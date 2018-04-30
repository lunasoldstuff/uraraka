'use strict';

(function () {
  'use strict';

  angular.module('rpUser').controller('rpUserCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$timeout', 'rpUserService', 'rpAppTitleChangeService', 'rpSettingsService', 'rpAppLocationService', 'rpIdentityService', 'rpAppAuthService', 'rpToolbarButtonVisibilityService', rpUserCtrl]);

  function rpUserCtrl($scope, $rootScope, $window, $routeParams, $timeout, rpUserService, rpAppTitleChangeService, rpSettingsService, rpAppLocationService, rpIdentityService, rpAppAuthService, rpToolbarButtonVisibilityService) {
    console.log('[rpUserCtrl] loaded.');
    console.log('[rpUserCtrl] $routeParams: ' + JSON.stringify($routeParams));

    var currentLoad = 0;

    var tabs = [{
      label: 'overview',
      value: 'overview'
    }, {
      label: 'submitted',
      value: 'submitted'
    }, {
      label: 'comments',
      value: 'comments'
    }, {
      label: 'gilded',
      value: 'gilded'
    }];

    $rootScope.$emit('rp_tabs_changed', tabs);

    rpToolbarButtonVisibilityService.hideAll();
    rpToolbarButtonVisibilityService.showButton('showUserWhere');
    rpToolbarButtonVisibilityService.showButton('showUserSort');
    rpToolbarButtonVisibilityService.showButton('showLayout');
    rpToolbarButtonVisibilityService.showButton('showSlideshow');

    var loadingMore = false;
    var loadLimit = 22;
    var moreLimit = 8;

    var username = $routeParams.username;
    var where = $routeParams.where || 'overview';
    var sort = $routeParams.sort || 'new';
    var t = $routeParams.t || 'none';

    if (sort === 'top' || sort === 'controversial') {
      rpToolbarButtonVisibilityService.showButton('showUserFilter');
    }
    if (where === 'gilded') {
      rpToolbarButtonVisibilityService.showButton('showUserSort');
      rpToolbarButtonVisibilityService.showButton('showUserFilter');
    }

    rpAppTitleChangeService('u/' + username, true, true);

    $scope.layout = rpSettingsService.settings.layout;
    $scope.showSub = true;

    /*
    Manage setting to open comments in a dialog or window.
    */
    $scope.commentsDialog = rpSettingsService.settings.commentsDialog;

    if (rpAppAuthService.isAuthenticated) {
      rpIdentityService.getIdentity(function (identity) {
        $scope.identity = identity;
        $scope.isMe = username === identity.name;

        if (!$scope.isMe) {
          // If User is not viewing their own User page
          // disallow them from accessing any tabs other than
          // the default.
          if (where === 'upvoted' || where === 'downvoted' || where === 'hidden' || where === 'saved') {
            where = 'overview';
            rpAppLocationService(null, '/u/' + username + '/' + where, '', false, true);
          }
        }

        console.log('[rpUserCtrl] $scope.isMe: ' + $scope.isMe);
        console.log('[rpUserCtrl] where: ' + where);

        loadPosts();
      });
    } else {
      // not logged in

      console.log('[rpUserCtrl] where: ' + where);
      $scope.isMe = false;

      if (where === 'upvoted' || where === 'downvoted' || where === 'hidden' || where === 'saved') {
        where = 'overview';
        rpAppLocationService(null, '/u/' + username + '/' + where, '', false, true);
      }

      loadPosts();
    }

    /**
     * EVENT HANDLERS
     * */

    var deregisterHidePost = $scope.$on('rp_hide_post', function (e, id) {
      console.log('[rpPostCtrl] onHidePost(), id: ' + id);

      $scope.posts.forEach(function (postIterator, i) {
        if (postIterator.data.name === id) {
          $scope.posts.splice(i, 1);
          $timeout(angular.noop, 0);
        }
      });
    });

    var deregisterSettingsChanged = $rootScope.$on('rp_settings_changed', function () {
      console.log('[rpPostCtrl] rp_settings_changed, $scope.singleColumnLayout: ' + $scope.singleColumnLayout);
      $scope.commentsDialog = rpSettingsService.settings.commentsDialog;

      if ($scope.layout !== rpSettingsService.settings.layout) {
        $scope.layout = rpSettingsService.settings.layout;
        loadPosts();
      }
    });

    var deregisterUserSortClick = $rootScope.$on('rp_user_sort_click', function (e, s) {
      console.log('[rpUserCtrl] user_sort_click');
      sort = s;

      rpAppLocationService(null, '/u/' + username + '/' + where, 'sort=' + sort, false, false);

      if (sort === 'top' || sort === 'controversial') {
        rpToolbarButtonVisibilityService.showButton('showUserFilter');
      } else {
        rpToolbarButtonVisibilityService.hideButton('showUserFilter');
      }

      loadPosts();
    });

    var deregisterUserTimeClick = $rootScope.$on('rp_user_time_click', function (e, time) {
      console.log('[rpUserCtrl] user_t_click');
      t = time;

      rpAppLocationService(null, '/u/' + username + '/' + where, 'sort=' + sort + '&t=' + t, false, false);

      loadPosts();
    });

    var deregisterUserWhereClick = $rootScope.$on('rp_user_where_click', function (e, tab) {
      console.log('[rpUserCtrl] this.tabClick(), tab: ' + tab);

      $scope.posts = [];
      $scope.noMorePosts = false;

      where = tab;

      rpAppLocationService(null, '/u/' + username + '/' + where, '', false, false);

      $scope.havePosts = false;
      $rootScope.$emit('rp_progress_start');

      var thisLoad = ++currentLoad;

      rpUserService(username, where, sort, '', t, loadLimit, function (err, data) {
        console.log('[rpUserCtrl] load-tracking loadPosts(), thisLoad: ' + thisLoad + ', currentLoad: ' + currentLoad);

        if (thisLoad === currentLoad) {
          $rootScope.$emit('rp_progress_stop');

          if (err) {
            console.log('[rpUserCtrl] err');
          } else {
            if (data.get.data.children.length < loadLimit) {
              $scope.noMorePosts = true;
            }

            if (data.get.data.children.length > 0) {
              addPosts(data.get.data.children);
            }

            // Array.prototype.push.apply($scope.posts, data.get.data.children);
            // $scope.posts = data.get.data.children;

            $scope.havePosts = true;
          }
        }
      });

      if (tab === 'overview' || tab === 'submitted' || tab === 'comments') {
        rpToolbarButtonVisibilityService.showButton('showUserSort');
      } else {
        rpToolbarButtonVisibilityService.hide('showUserSort');
      }
    });

    var deregisterRefresh = $rootScope.$on('rp_refresh', function () {
      console.log('[rpUserCtrl] rp_refresh');
      $rootScope.$emit('rp_refresh_button_spin', true);
      loadPosts();
    });

    /**
     * CONTROLLER API
     * */

    $scope.thisController = this;

    this.completeDeleting = function (id) {
      console.log('[rpUserCtrl] completeDeleting()');

      $scope.posts.forEach(function (postIterator, i) {
        if (postIterator.data.name === id) {
          $scope.posts.splice(i, 1);
        }
      });
    };

    /**
     * SCOPE FUNCTIONS
     * */

    $scope.morePosts = function () {
      console.log('[rpUserCtrl] morePosts()');

      if ($scope.posts && $scope.posts.length > 0) {
        var lastPostName = $scope.posts[$scope.posts.length - 1].data.name;

        if (lastPostName && !loadingMore) {
          var thisLoad = ++currentLoad;

          loadingMore = true;

          $rootScope.$emit('rp_progress_start');

          rpUserService(username, where, sort, lastPostName, t, moreLimit, function (err, data) {
            console.log('[rpUserCtrl] load-tracking morePosts(), thisLoad: ' + thisLoad + ', currentLoad: ' + currentLoad);

            if (thisLoad === currentLoad) {
              $rootScope.$emit('rp_progress_stop');

              if (err) {
                console.log('[rpUserCtrl] err');
              } else {
                if (data.get.data.children.length < moreLimit) {
                  $scope.noMorePosts = true;
                }

                // Array.prototype.push.apply($scope.posts, data.get.data.children);
                loadingMore = false;

                if (data.get.data.children.length > 0) {
                  addPosts(data.get.data.children);
                }
              }
            }

            loadingMore = false;
          });
        }
      }
    };

    /**
     * Load Posts
     */
    function loadPosts() {
      console.log('[rpUserCtrl] loadPosts()');

      var thisLoad = ++currentLoad;

      $scope.posts = [];
      $scope.havePosts = false;
      $scope.noMorePosts = false;

      $rootScope.$emit('rp_progress_start');

      rpUserService(username, where, sort, '', t, loadLimit, function (err, data) {
        console.log('[rpUserCtrl] load-tracking loadPosts(), thisLoad: ' + thisLoad + ', currentLoad: ' + currentLoad);

        if (thisLoad === currentLoad) {
          $rootScope.$emit('rp_progress_stop');

          if (err) {
            console.log('[rpUserCtrl] err');
          } else {
            console.log('[rpUserCtrl] data.length: ' + data.get.data.children.length);

            if (data.get.data.children.length < loadLimit) {
              $scope.noMorePosts = true;
            }

            if (data.get.data.children.length > 0) {
              addPosts(data.get.data.children);
            }

            // Array.prototype.push.apply($scope.posts, data.get.data.children);
            // $scope.posts = data.get.data.children;
            $scope.havePosts = true;
            rpToolbarButtonVisibilityService.showButton('showRefresh');
            $rootScope.$emit('rp_refresh_button_spin', false);
          }
        }
      });
    }

    function addPosts(posts) {
      var duplicate = false;

      for (var i = 0; i < $scope.posts.length; i++) {
        if ($scope.posts[i].data.id === posts[0].data.id) {
          console.log('[rpPostCtrl] addPosts, duplicate post detected');
          console.log('[rpPostCtrl] $scope.posts[i].data.id: ' + $scope.posts[i].data.id);
          console.log('[rpPostCtrl] posts[0].data.id: ' + posts[0].data.id);
          duplicate = true;
          break;
        }
      }

      var post = posts.shift();

      if (!duplicate) {
        post.column = getShortestColumn();
        $scope.posts.push(post);
      }

      $timeout(function () {
        if (posts.length > 0) {
          addPosts(posts);
        }
      }, 50);
    }

    function getShortestColumn() {
      // console.time('getShortestColumn');

      // var columns = angular.element('.rp-posts-col');
      var columns = angular.element('.rp-col-wrapper');

      var shortestColumn;
      var shortestHeight;

      columns.each(function (i) {
        var thisHeight = jQuery(this).height();
        if (angular.isUndefined(shortestColumn) || thisHeight < shortestHeight) {
          shortestHeight = thisHeight;
          shortestColumn = i;
        }
      });

      return shortestColumn;
      // console.timeEnd('getShortestColumn');
    }

    var deregisterWindowResize = $rootScope.$on('rp_window_resize', function (e, to) {
      if (!angular.isUndefined($scope.posts)) {
        for (var i = 0; i < $scope.posts.length; i++) {
          $scope.posts[i].column = i % to;
        }
      }
    });

    var deregisterSlideshowGetPost = $rootScope.$on('rp_slideshow_get_post', function (e, i, callback) {
      if (i >= $scope.posts.length / 2) {
        $scope.morePosts();
      }
      callback($scope.posts[i]);
    });

    var deregisterSlideshowGetShowSub = $rootScope.$on('rp_slideshow_get_show_sub', function (e, callback) {
      callback($scope.showSub);
    });

    $scope.$on('$destroy', function () {
      deregisterUserTimeClick();
      deregisterUserSortClick();
      deregisterSettingsChanged();
      deregisterUserWhereClick();
      deregisterWindowResize();
      deregisterRefresh();
      deregisterHidePost();
      deregisterSlideshowGetPost();
      deregisterSlideshowGetShowSub();
    });
  }
})();