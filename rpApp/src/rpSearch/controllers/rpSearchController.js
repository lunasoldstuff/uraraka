(function () {
  'use strict';

  function rpSearchCtrl(
    $scope,
    $rootScope,
    $routeParams,
    $location,
    $window,
    $timeout,
    $mdDialog,
    $mdBottomSheet,
    rpSubredditsService,
    rpSearchService,
    rpSearchFormService,
    rpAppLocationService,
    rpAppTitleService,
    rpAppAuthService,
    rpIdentityService,
    rpToolbarButtonVisibilityService,
    rpProgressService
  ) {
    var deregisterWindowResize;
    var deregisterSearchSortClick;
    var deregisterSearchTimeClick;
    var deregisterSearchFormSubmitted;
    var deregisterMorePosts;
    var addNextPost;

    var loadingMore = false;
    var currentLoad = 0;
    var thisLoad = ++currentLoad;

    const AUTHOR_RE = /[.]*(author:)[,]*/;


    console.log('[rpSearchCtrl] loaded, $scope.$id: ' + $scope.$id);

    rpToolbarButtonVisibilityService.hideAll();
    rpToolbarButtonVisibilityService.showButton('showLayout');

    console.log('[rpSearchCtrl] rpSubredditsService.currentSub: ' + rpSubredditsService.currentSub);

    $scope.posts = [];
    $scope.links = [];
    $scope.subs = [];
    $scope.haveSubs = false;
    $scope.haveLinks = false;
    $scope.havePosts = false;
    $scope.nothingPosts = false;
    $scope.nothingSubs = false;
    $scope.nothingLinks = false;
    $scope.noMorePosts = false;

    // set search parameters
    $scope.params = rpSearchService.params;

    if (rpAppAuthService.isAuthenticated) {
      rpIdentityService.getIdentity(function (identity) {
        $scope.identity = identity;
      });
    }

    $scope.showSub = true;

    if ($routeParams.q) {
      $scope.params.q = $routeParams.q;
      rpAppTitleService.changeTitles('search: ' + $scope.params.q);
    }

    // $scope.params.sub = $routeParams.sub || rpSubredditsService.currentSub || "all";
    if ($routeParams.sub) {
      $scope.params.sub = $routeParams.sub;
    } else if (rpSubredditsService.currentSub) {
      $scope.params.sub = rpSubredditsService.currentSub;
    }

    // If a subreddit has been specified must search for links only.
    if ($scope.params.sub === 'all' || $scope.params.sub === '') {
      if ($routeParams.type) {
        $scope.params.type = $routeParams.type;
      }
      console.log('[rpSearchCtrl] set type, $scope.params.type: ' + $scope.params.type);
      $scope.type = $scope.params.type;
      $scope.params.formType = $scope.params.type;
    } else {
      $scope.type = 'link';
      $scope.params.formType = 'link';
      $scope.params.type = 'link';
    }

    if (AUTHOR_RE.test($scope.params.q)) {
      $scope.type = 'link';
      $scope.params.type = 'link';
      console.log('[rpSearchCtrl] rpSearchService, author test inside.');
    }

    if ($routeParams.restrict_sr) {
      $scope.params.restrict_sr = $routeParams.restrict_sr;
    }

    if ($routeParams.t) $scope.params.t = $routeParams.t;

    if ($routeParams.sort) {
      $scope.params.sort = $routeParams.sort;
    }

    if ($routeParams.after) {
      $scope.params.after = $routeParams.after;
    } else {
      $scope.params.after = '';
    }

    if ($routeParams.limit) {
      $scope.params.limit = $routeParams.limit;
    }

    // make sure the search form is open.
    rpSearchFormService.show();

    if ($scope.params.type === 'link') {
      rpToolbarButtonVisibilityService.showButton('showSearchSort');
    } else {
      rpToolbarButtonVisibilityService.hideButton('showSearchSort');
    }

    function getColumn(putInShortest) {
      // console.time('getShortestColumn');

      // var columns = angular.element('.rp-posts-col');
      var columns = angular.element('.rp-col-wrapper');

      var shortestColumn;
      var shortestHeight;

      if (putInShortest) {
        columns.each(function (i) {
          var thisHeight = jQuery(this)
            .height();
          if (angular.isUndefined(shortestColumn) || thisHeight < shortestHeight) {
            shortestHeight = thisHeight;
            shortestColumn = i;
          }
        });

        return shortestColumn;
      }
      return $scope.posts.length % columns.length;
    }

    function addPosts(posts, putInShortest) {
      console.log('[rpSearchCtrl] addPosts, posts.length: ' + posts.length);
      console.log('[rpSearchCtrl] addPosts, typeof $scope.posts: ' + typeof $scope.posts);
      let post = posts.shift();
      post.column = getColumn(putInShortest);
      $scope.posts.push(post);

      addNextPost = $timeout(function () {
        if (posts.length > 0) {
          addPosts(posts, putInShortest);
        }
      }, 50);
    }

    // Initiate first search.
    rpProgressService.showProgress();

    // Perform two search requests if we want both subs and links.
    console.log('[rpSearchCtrl] rpSearchService, author test after.');


    if ($scope.params.type === 'sr, link') {
      console.log('[rpSearchCtrl] load sr and link');
      console.log('[rpSearchCtrl] foo');

      rpToolbarButtonVisibilityService.hideButton('showSearchTime');
      $scope.subs = [];
      $scope.haveSubs = false;

      $scope.params.type = 'sr';
      $scope.params.limit = 4;
      console.log('[rpSearchCtrl] rpSearchService.params.limit: ' + rpSearchService.params.limit);

      rpSearchService.search(function (err, data) {
        if (thisLoad === currentLoad) {
          if (err) {
            console.log('[rpSearchCtrl] err');
          } else {
            console.log('[rpSearchCtrl] sr, data.data.children.length: ' + data.data.children.length);
            console.log('[rpSearchCtrl] sr, asdf');

            if (data.data.children.length > 0) {
              $scope.noMorePosts = data.data.children.length < $scope.params.limit;
              console.log('[rpSearchCtrl] sr + link search(sr), data.data.children.length: ' +
                data.data.children.length);
              $scope.subs = data.data.children;
              $scope.haveSubs = true;
              console.log('[rpSearchCtrl] $scope.haveSubs: ' + $scope.haveSubs);
            } else {
              $scope.nothingSubs = true;
            }
            console.log('[rpSearchCtrl] sr, qwer');

            if ($scope.haveLinks || $scope.nothingLinks) {
              rpProgressService.hideProgress();
              $scope.params.limit = 8;
              $scope.params.type = 'sr, link';
            }
          }
        }
      });

      $scope.links = [];
      $scope.haveLinks = false;

      $scope.params.type = 'link';
      $scope.params.limit = 4;

      rpSearchService.search(function (err, data) {
        if (thisLoad === currentLoad) {
          if (err) {
            console.log('[rpSearchCtrl] err');
          } else {
            if (data.data.children.length > 0) {
              $scope.noMorePosts = data.data.children.length < $scope.params.limit;
              console.log('[rpSearchCtrl] sr + link search(link), data.data.children.length: ' +
                data.data.children.length);

              $scope.links = data.data.children;

              $scope.haveLinks = true;
              console.log('[rpSearchCtrl] $scope.haveLinks: ' + $scope.haveLinks);
            } else {
              $scope.nothingLinks = true;
            }

            if ($scope.haveSubs || $scope.nothingSubs) {
              console.log('[rpSearchCtrl] sr + link search(link) over, this should only run once.');

              rpProgressService.hideProgress();
              $scope.params.limit = 8;
              $scope.params.type = 'sr, link';
            }
          }
        }
      });

      $scope.params.type = 'sr, link';
    } else {
      console.log('[rpSearchCtrl] load sr or link');

      if ($scope.params.type === 'link' && $scope.params.sort === 'top') {
        rpToolbarButtonVisibilityService.showButton('showSearchTime');
      } else {
        rpToolbarButtonVisibilityService.hideButton('showSearchTime');
      }

      rpSearchService.search(function (err, data) {
        if (angular.isDefined(addNextPost)) {
          $timeout.cancel(addNextPost);
        }

        if (thisLoad === currentLoad) {
          rpProgressService.hideProgress();

          if (err) {
            console.log('[rpSearchCtrl] err');
          } else {
            console.log('[rpSearchCtrl] data.data.children.length: ' + data.data.children.length);

            if (data && data.data.children.length > 0) {
              $scope.noMorePosts = data.data.children.length < $scope.params.limit;

              if (data.data.children.length > 0) {
                addPosts(data.data.children, false);
              }
              // $scope.posts = data.data.children;
              $scope.havePosts = true;
            } else {
              $scope.nothingPosts = true;
            }
          }
        }
      });
    }

    /**
     * CONTROLLER API
     * */

    $scope.thisController = this;

    this.completeDeleting = function (id) {
      console.log('[rpSearchCtrl] this.completeDeleting(), id:' + id);

      let posts;

      if ($scope.params.type === 'link') {
        posts = $scope.posts;
      } else if ($scope.params.type === 'sr, link') {
        posts = $scope.links;
      }

      posts.forEach(function (postIterator, i) {
        if (postIterator.data.name === id) {
          posts.splice(i, 1);
        }
      });
    };

    deregisterSearchSortClick = $rootScope.$on('rp_search_sort_click', function (e, sort) {
      console.log('[rpSearchCtrl] rp_sort_click, sort:' + sort);

      $scope.params.sort = sort;
      $scope.params.after = '';

      if ($scope.params.sort === 'top') {
        rpToolbarButtonVisibilityService.showButton('showSearchTime');
      } else {
        rpToolbarButtonVisibilityService.hideButton('showSearchTime');
      }

      rpAppLocationService(
        null,
        '/search',
        'q=' +
        $scope.params.q +
        '&sub=' +
        $scope.params.sub +
        '&type=' +
        $scope.params.type +
        '&restrict_sr=' +
        $scope.params.restrict_sr +
        '&sort=' +
        $scope.params.sort +
        '&after=' +
        $scope.params.after +
        '&t=' +
        $scope.params.t,
        false,
        true
      );

      $scope.posts = [];
      $scope.havePosts = false;
      $scope.noMorePosts = false;
      rpProgressService.showProgress();

      let sortLoad = ++currentLoad;

      rpSearchService.search(function (err, data) {
        if (angular.isDefined(addNextPost)) {
          $timeout.cancel(addNextPost);
        }

        if (sortLoad === currentLoad) {
          if (err) {
            console.log('[rpSearchCtrl] this.tabClick(), err');
          } else {
            $scope.noMorePosts = data.data.children.length < $scope.params.limit;
            if (data.data.children.length > 0) {
              addPosts(data.data.children, false);
            }
            rpProgressService.hideProgress();
            // $scope.posts = data.data.children;
            $scope.havePosts = true;
          }
        }
      });
    });

    /**
     * SCOPE FUNCTIONS
     * */

    $scope.morePosts = function () {
      console.log('[rpSearchCtrl] morePost()');

      if ($scope.posts && $scope.posts.length > 0) {
        let lastPostName = $scope.posts[$scope.posts.length - 1].data.name;
        console.log('[rpSearchCtrl] morePosts(), lastPostName: ' + lastPostName);
        console.log('[rpSearchCtrl] morePosts(), loadingMore: ' + loadingMore);

        if (lastPostName && !loadingMore) {
          loadingMore = true;
          $scope.params.after = lastPostName;

          rpAppLocationService(
            null,
            '/search',
            'q=' +
            $scope.params.q +
            '&sub=' +
            $scope.params.sub +
            '&type=' +
            $scope.params.type +
            '&restrict_sr=' +
            $scope.params.restrict_sr +
            '&sort=' +
            $scope.params.sort +
            '&after=' +
            $scope.params.after +
            '&limit=' +
            $scope.params.limit +
            '&t=' +
            $scope.params.t,
            false,
            true
          );

          rpProgressService.showProgress();

          let moreLoad = ++currentLoad;

          rpSearchService.search(function (err, data) {
            if (moreLoad === currentLoad) {
              if (angular.isDefined(addNextPost)) {
                $timeout.cancel(addNextPost);
              }

              if (err) {
                console.log('[rpSearchCtrl] err');
              } else {
                console.log('[rpSearchCtrl] morePosts() data.data.children.length: ' +
                  data.data.children.length);
                console.log('[rpSearchCtrl] $scope.params.limit: ' + $scope.params.limit);
                $scope.noMorePosts = data.data.children.length < $scope.params.limit;

                rpProgressService.hideProgress();
                if (data.data.children.length > 0) {
                  addPosts(data.data.children, true);
                }
                // Array.prototype.push.apply($scope.posts, data.data.children);
                $scope.havePosts = true;
                loadingMore = false;
              }
            }

            loadingMore = false;
          });
        }
      }
    };

    $scope.searchSub = function (e, post) {
      console.log('[rpSearchCtrl] searchSub, post.data.display_name: ' + post.data.display_name);
      console.log('[rpSearchCtrl] searchSub, e.ctrlKey: ' + e.ctrlKey);

      if (e.ctrlKey) {
        rpAppLocationService(
          e,
          '/search',
          'q=' +
          $scope.params.q +
          '&sub=' +
          post.data.display_name +
          '&type=' +
          'link' +
          '&restrict_sr=' +
          'true' +
          '&sort=' +
          'relevance' +
          '&after=' +
          '' +
          '&t=' +
          'all',
          true,
          true
        );
      } else {
        $scope.params.sub = post.data.display_name;
        $scope.type = 'link';
        $scope.params.formType = 'link';
        $scope.params.type = 'link';
        $scope.params.restrict_sr = true;
        $scope.params.after = '';
        $scope.params.sort = 'relevance';
        $scope.params.t = 'all';

        rpToolbarButtonVisibilityService.showButton('showSearchSort');
        $scope.scroll = true;

        rpAppLocationService(
          null,
          '/search',
          'q=' +
          $scope.params.q +
          '&sub=' +
          $scope.params.sub +
          '&type=' +
          $scope.params.type +
          '&restrict_sr=' +
          $scope.params.restrict_sr +
          '&sort=' +
          $scope.params.sort +
          '&after=' +
          $scope.params.after +
          '&t=' +
          $scope.params.t,
          false,
          false
        );

        $scope.posts = [];
        $scope.havePosts = false;

        $scope.nothingPosts = false;
        $scope.nothingSubs = false;
        $scope.nothingLinks = false;
        $scope.noMorePosts = false;

        rpProgressService.showProgress();

        let subLoad = ++currentLoad;

        rpSearchService.search(function (err, data) {
          if (angular.isDefined(addNextPost)) {
            $timeout.cancel(addNextPost);
          }

          if (subLoad === currentLoad) {
            if (err) {
              console.log('[rpSearchCtrl] err');
            } else {
              $scope.noMorePosts = data.data.children.length < $scope.params.limit;
              rpProgressService.hideProgress();
              if (data.data.children.length > 0) {
                addPosts(data.data.children, false);
              }
              // $scope.posts = data.data.children;
              $scope.havePosts = true;
            }
          }
        });
      }
    };

    $scope.moreSubs = function (e) {
      console.log('[rpSearchCtrl] moreSubs()');

      rpToolbarButtonVisibilityService.hideButton('showSearchSort');
      rpToolbarButtonVisibilityService.hideButton('showSearchTime');
      $scope.scroll = false;

      if (e.ctrlKey) {
        rpAppLocationService(
          e,
          '/search',
          'q=' +
          $scope.params.q +
          '&sub=' +
          'all' +
          '&type=' +
          'sr' +
          '&restrict_sr=' +
          'false' +
          '&sort=' +
          'relevance' +
          '&after=' +
          '' +
          '&t=' +
          'all',
          true,
          true
        );
      } else {
        $scope.params.sub = 'all';
        $scope.type = 'sr';
        $scope.params.formType = 'sr';
        $scope.params.type = 'sr';
        $scope.params.restrict_sr = false;
        $scope.params.after = '';
        $scope.params.sort = 'relevance';
        $scope.params.t = 'all';

        rpAppLocationService(
          null,
          '/search',
          'q=' +
          $scope.params.q +
          '&sub=' +
          $scope.params.sub +
          '&type=' +
          $scope.params.type +
          '&restrict_sr=' +
          $scope.params.restrict_sr +
          '&sort=' +
          $scope.params.sort +
          '&after=' +
          $scope.params.after +
          '&t=' +
          $scope.params.t,
          false,
          false
        );

        $scope.posts = [];
        $scope.subs = [];
        $scope.links = [];

        $scope.havePosts = false;
        $scope.haveLinks = false;
        $scope.haveSubs = false;
        $scope.noMorePosts = false;

        rpProgressService.showProgress();

        let moreSubsLoad = ++currentLoad;

        rpSearchService.search(function (err, data) {
          if (angular.isDefined(addNextPost)) {
            $timeout.cancel(addNextPost);
          }

          if (moreSubsLoad === currentLoad) {
            if (err) {
              console.log('[rpSearchCtrl] err');
            } else {
              $scope.noMorePosts = data.data.children.length < $scope.params.limit;
              rpProgressService.hideProgress();

              if (data.data.children.length > 0) {
                addPosts(data.data.children, false);
              }
              // $scope.posts = data.data.children;
              $scope.havePosts = true;
            }
          }
        });
      }
    };

    $scope.moreLinks = function (e) {
      console.log('[rpSearchCtrl] moreSubs()');

      if (e.ctrlKey) {
        rpAppLocationService(
          e,
          '/search',
          'q=' +
          $scope.params.q +
          '&sub=' +
          'all' +
          '&type=' +
          'link' +
          '&restrict_sr=' +
          'false' +
          '&sort=' +
          'relevance' +
          '&after=' +
          '' +
          '&t=' +
          'all',
          true,
          true
        );
      } else {
        $scope.params.sub = 'all';
        $scope.type = 'link';
        $scope.params.formType = 'link';
        $scope.params.type = 'link';
        $scope.params.restrict_sr = false;
        $scope.params.after = '';
        $scope.params.sort = 'relevance';
        $scope.params.t = 'all';

        rpToolbarButtonVisibilityService.showButton('showSearchSort');
        $scope.scroll = true;

        rpAppLocationService(
          null,
          '/search',
          'q=' +
          $scope.params.q +
          '&sub=' +
          $scope.params.sub +
          '&type=' +
          $scope.params.type +
          '&restrict_sr=' +
          $scope.params.restrict_sr +
          '&sort=' +
          $scope.params.sort +
          '&after=' +
          $scope.params.after +
          '&t=' +
          $scope.params.t,
          false,
          false
        );

        $scope.posts = [];
        $scope.subs = [];
        $scope.links = [];

        $scope.havePosts = false;
        $scope.haveLinks = false;
        $scope.haveSubs = false;
        $scope.noMorePosts = false;

        rpProgressService.showProgress();

        let moreLinksLoad = ++currentLoad;

        rpSearchService.search(function (err, data) {
          if (angular.isDefined(addNextPost)) {
            $timeout.cancel(addNextPost);
          }

          if (moreLinksLoad === currentLoad) {
            if (err) {
              console.log('[rpSearchCtrl] err');
            } else {
              $scope.noMorePosts = data.data.children.length < $scope.params.limit;
              rpProgressService.hideProgress();

              if (data.data.children.length > 0) {
                addPosts(data.data.children, false);
              }
              // $scope.posts = data.data.children;
              $scope.havePosts = true;
            }
          }
        });
      }
    };

    $scope.sharePost = function (e, _post) {
      let post = _post;
      console.log('[rpSearchCtrl] sharePost(), post.data.url: ' + post.data.url);
      post.bottomSheet = true;

      let shareBottomSheet = $mdBottomSheet
        .show({
          templateUrl: 'rpShareBottomSheet.html',
          controller: 'rpShareCtrl',
          targetEvent: e,
          parent: '.rp-view',
          disbaleParentScroll: true,
          locals: {
            post: post
          }
        })
        .then(function () {
          console.log('[rpSearchCtrl] bottomSheet Resolved: remove rp-bottom-sheet class');
          post.bottomSheet = false;
        })
        .catch(function () {
          console.log('[rpSearchCtrl] bottomSheet Rejected: remove rp-bottom-sheet class');
          post.bottomSheet = false;
        });
    };

    deregisterSearchTimeClick = $rootScope.$on('rp_search_time_click', function (e, time) {
      console.log('[rpSearchCtrl] search_time_click, time: ' + time);

      $scope.posts = [];
      $scope.havePosts = false;
      $scope.noMorePosts = false;

      $scope.params.t = time;
      $scope.params.after = '';

      rpAppLocationService(
        null,
        '/search',
        'q=' +
        $scope.params.q +
        '&sub=' +
        $scope.params.sub +
        '&type=' +
        $scope.params.type +
        '&restrict_sr=' +
        $scope.params.restrict_sr +
        '&sort=' +
        $scope.params.sort +
        '&after=' +
        $scope.params.after +
        '&t=' +
        $scope.params.t,
        false,
        true
      );

      $scope.havePosts = false;
      rpProgressService.showProgress();

      let searchTimeLoad = ++currentLoad;

      rpSearchService.search(function (err, data) {
        if (angular.isDefined(addNextPost)) {
          $timeout.cancel(addNextPost);
        }

        if (searchTimeLoad === currentLoad) {
          if (err) {
            console.log('[rpSearchCtrl] err');
          } else {
            $scope.noMorePosts = data.data.children.length < $scope.params.limit;
            rpProgressService.hideProgress();

            if (data.data.children.length > 0) {
              addPosts(data.data.children, false);
            }
            // $scope.posts = data.data.children;
            $scope.havePosts = true;
          }
        }
      });
    });

    deregisterSearchFormSubmitted = $rootScope.$on('rp_search_form_submitted', function () {
      console.log('[rpSearchCtrl] rp_search_form_submitted');

      $scope.posts = [];

      $scope.havePosts = false;
      $scope.nothingPosts = false;
      $scope.nothingSubs = false;
      $scope.nothingLinks = false;
      $scope.noMorePosts = false;

      rpProgressService.showProgress();
      $rootScope.$emit('rp_init_select');

      // Test the search string, if author:xxx specified must change type to link.
      if (AUTHOR_RE.test($scope.params.q)) {
        $scope.type = 'link';
        $scope.params.type = 'link';
      }

      $scope.type = $scope.params.type;

      if ($scope.params.type === 'link') {
        rpToolbarButtonVisibilityService.showButton('rpSearchSort');
      } else {
        rpToolbarButtonVisibilityService.hideButton('rpSearchSort');
      }
      $scope.scroll = $scope.params.type === 'link';

      let formSubmittedLoad = ++currentLoad;

      rpAppTitleService.changeTitles('search: ' + $scope.params.q);

      // Perform two search requests if we want both subs and links.
      if ($scope.params.type === 'sr, link') {
        console.log('[rpSearchCtrl] load sr and link');

        rpToolbarButtonVisibilityService.hideButton('showSearchTime');
        $scope.subs = [];
        $scope.haveSubs = false;

        $scope.params.type = 'sr';
        $scope.params.limit = 4;
        console.log('[rpSearchCtrl] rpSearchService.params.limit: ' + rpSearchService.params.limit);

        rpSearchService.search(function (err, data) {
          if (formSubmittedLoad === currentLoad) {
            if (err) {
              console.log('[rpSearchCtrl] err');
            } else {
              console.log('[rpSearchCtrl] sr, data.data.children.length: ' + data.data.children.length);

              if (data && data.data.children.length > 0) {
                $scope.noMorePosts = data.data.children.length < $scope.params.limit;
                console.log('[rpSearchCtrl] sr + link search(sr), data.data.children.length: ' +
                  data.data.children.length);
                $scope.subs = data.data.children;
                $scope.haveSubs = true;
              } else {
                $scope.nothingSubs = true;
              }

              if ($scope.haveLinks || $scope.nothingLinks) {
                console.log('[rpSearchCtrl] sr + link search(sr) over, this should only run once.');

                rpProgressService.hideProgress();
                $scope.params.limit = 8;
                $scope.params.type = 'sr, link';
              }
            }
          }
        });

        $scope.links = [];
        $scope.haveLinks = false;

        $scope.params.type = 'link';
        $scope.params.limit = 4;

        rpSearchService.search(function (err, data) {
          if (formSubmittedLoad === currentLoad) {
            if (err) {
              console.log('[rpSearchCtrl] err');
            } else {
              if (data && data.data.children.length > 0) {
                $scope.noMorePosts = data.data.children.length < $scope.params.limit;
                console.log('[rpSearchCtrl] sr + link search(link), data.data.children.length: ' +
                  data.data.children.length);

                $scope.links = data.data.children;

                $scope.haveLinks = true;
              } else {
                $scope.nothingLinks = true;
              }

              if ($scope.haveSubs || $scope.nothingSubs) {
                console.log('[rpSearchCtrl] sr + link search(link) over, this should only run once.');

                rpProgressService.hideProgress();
                $scope.params.limit = 8;
                $scope.params.type = 'sr, link';
              }
            }
          }
        });

        $scope.params.type = 'sr, link';
      } else {
        console.log('[rpSearchCtrl] load sr or link');

        if ($scope.params.type === 'link' && $scope.params.sort === 'top') {
          rpToolbarButtonVisibilityService.showButton('showSearchTime');
        }

        rpSearchService.search(function (err, data) {
          rpProgressService.hideProgress();

          if (angular.isDefined(addNextPost)) {
            $timeout.cancel(addNextPost);
          }

          if (err) {
            console.log('[rpSearchCtrl] err');
          } else {
            console.log('[rpSearchCtrl] data.data.children.length: ' + data.data.children.length);

            if (data && data.data.children.length > 0) {
              $scope.noMorePosts = data.data.children.length < $scope.params.limit;

              if (data.data.children.length > 0) {
                addPosts(data.data.children, false);
              }
              // $scope.posts = data.data.children;
              $scope.havePosts = true;
            } else {
              $scope.nothingPosts = true;
            }
          }
        });
      }
    });

    deregisterWindowResize = $rootScope.$on('rp_window_resize', function (e, to) {
      if (!angular.isUndefined($scope.posts)) {
        for (let i = 0; i < $scope.posts.length; i++) {
          $scope.posts[i].column = i % to;
        }
      }
    });

    deregisterMorePosts = $rootScope.$on('rp_more_posts', function () {
      $scope.morePosts();
    });

    $scope.$on('$destroy', function () {
      console.log('[rpSearchCtrl] destroy()');
      deregisterSearchFormSubmitted();
      deregisterSearchSortClick();
      deregisterSearchTimeClick();
      deregisterWindowResize();
      deregisterMorePosts();
    });
  }

  angular
    .module('rpSearch')
    .controller('rpSearchCtrl', [
      '$scope',
      '$rootScope',
      '$routeParams',
      '$location',
      '$window',
      '$timeout',
      '$mdDialog',
      '$mdBottomSheet',
      'rpSubredditsService',
      'rpSearchService',
      'rpSearchFormService',
      'rpAppLocationService',
      'rpAppTitleService',
      'rpAppAuthService',
      'rpIdentityService',
      'rpToolbarButtonVisibilityService',
      'rpProgressService',
      rpSearchCtrl
    ]);
}());
