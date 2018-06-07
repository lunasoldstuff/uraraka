(function () {
  'use strict';

  function rpSubredditsService(
    $rootScope,
    rpAppAuthService,
    rpToastService,
    rpRedditRequestService,
    rpAppDescriptionService,
    rpLoginService
  ) {
    const LIMIT = 50;

    var subredditsService = {
      subs: [],
      currentSub: '',
      about: {},
      subscribed: null,

      getAbout() {
        return subredditsService.about;
      },

      getSubs() {
        return subredditsService.subs;
      },

      updateSubreddits(callback) {
        if (rpAppAuthService.isAuthenticated) {
          subredditsService.loadUserSubreddits(callback);
        } else {
          subredditsService.loadDefaultSubreddits(callback);
        }
      },

      updateSubredditsErrorHandler(error, data) {
        if (error) {
          console.log('[rpSubredditsService] updateSubreddits, load subreddits failed');
          subredditsService.updateSubreddits(subredditsService.updateSubredditsErrorHandler);
        }
      },

      resetSubreddit() {
        subredditsService.currentSub = '';
        subredditsService.subscribed = null;
        subredditsService.about.data = {};
      },

      setSubreddit(sub) {
        if (sub && this.currentSub !== sub) {
          subredditsService.currentSub = sub;
          subredditsService.updateSubscriptionStatus();
          subredditsService.loadSubredditAbout();
        }
      },

      loadUserSubreddits(callback) {
        console.log('[rpSubredditsService] loadUserSubreddits()');

        rpRedditRequestService.redditRequest(
          'listing',
          '/subreddits/mine/$where',
          {
            $where: 'subscriber',
            limit: LIMIT,
            after: ''
          },
          data => {
            if (data.responseError) {
              console.log('[rpSubredditsService] loadUserSubreddits(), ResponseError');
              rpToastService(
                'something went wrong updating your subreddits',
                'sentiment_dissatisfied'
              );
              callback(data, null);
            } else if (data.get.data.children.length > 0) {
              subredditsService.subs.push(...data.get.data.children);

              /*
              we have all the subreddits, no need to get more.
              */
              if (data.get.data.children.length < LIMIT) {
                subredditsService.updateSubscriptionStatus();
                callback(null, data);
              } else {
                // dont have all the subreddits yet, get more.
                subredditsService.loadMoreUserSubreddits(
                  data.get.data.children[data.get.data.children.length - 1].data
                    .name,
                  callback
                );
              }

              /*
              no subreddits returned. load deafult subs.
              */
            } else {
              // If the user has no subreddits load the default subs.
              subredditsService.loadDefaultSubreddits(callback);
            }
          }
        );
      },

      loadMoreUserSubreddits(after, callback) {
        console.log('[rpSubredditsService] loadMoreUserSubreddits(), after: ' + after);

        rpRedditRequestService.redditRequest(
          'listing',
          '/subreddits/mine/$where',
          {
            $where: 'subscriber',
            after: after,
            limit: LIMIT
          },
          data => {
            if (data.responseError) {
              console.log('[rpSubredditsService] loadMoreUserSubreddits() ResponseError');
              rpToastService(
                'something went wrong updating your subreddits',
                'sentiment_dissatisfied'
              );
              callback(data, null);
            } else {
              // add the subreddits instead of replacing.
              subredditsService.subs.push(...data.get.data.children);

              // end case.we have all the subreddit.
              if (data.get.data.children.length < LIMIT) {
                subredditsService.updateSubscriptionStatus();
                callback(null, data);
              } else {
                // dont have all the subreddits yet. recurse to get more.
                subredditsService.loadMoreUserSubreddits(
                  data.get.data.children[data.get.data.children.length - 1].data
                    .name,
                  callback
                );
              }
            }
          }
        );
      },
      loadDefaultSubreddits(callback) {
        console.log('[rpSubredditsService] loadDefaultSubreddits()');

        rpRedditRequestService.redditRequest(
          'listing',
          '/subreddits/$where',
          {
            $where: 'default',
            limit: LIMIT
          },
          data => {
            if (data.responseError) {
              console.log('[rpSubredditsService] err');
              rpToastService(
                'something went wrong updating your subreddits',
                'sentiment_dissatisfied'
              );
              callback(data, null);
            } else {
              console.log('[rpSubredditsService] loadDefaultSubreddits(), data.get.data.children.length: ' +
                  data.get.data.children.length);

              subredditsService.subs.push(...data.get.data.children);
              subredditsService.updateSubscriptionStatus();
              callback(null, data);
            }
          }
        );
      },
      subscribeCurrent(callback) {
        console.log('[rpSubredditsService] subscribeCurrent(), currentSub: ' +
            subredditsService.currentSub);
        let action = subredditsService.subscribed ? 'unsub' : 'sub';

        rpRedditRequestService.redditRequest(
          'post',
          '/api/subscribe',
          {
            action: action,
            sr: subredditsService.about.data.name
          },
          data => {
            if (data.responseError) {
              console.log('[rpSubredditsService] err');
              callback(data, null);
            } else {
              subredditsService.updateSubreddits(function (err, data) {
                if (err) {
                  console.log('[rpSubredditsService] err');
                  callback(data, null);
                } else {
                  callback(null, data);
                }
              });
            }
          }
        );
      },
      subscribe(action, name, callback) {
        console.log('[rpSubredditsService], subscribe(), action: ' +
            action +
            ', name: ' +
            name);

        if (rpAppAuthService.isAuthenticated) {
          rpRedditRequestService.redditRequest(
            'post',
            '/api/subscribe',
            {
              action: action,
              sr: name
            },
            function (data) {
              if (data.responseError) {
                console.log('[rpSubredditsService] err');
                callback(data, null);
              } else {
                subredditsService.updateSubreddits(function (err, data) {
                  if (err) {
                    console.log('[rpSubredditsService] err');
                    callback(data, null);
                  } else {
                    callback(null, data);
                  }
                });
              }
            }
          );
        } else {
          rpLoginService.showDialog();
        }
      },
      isSubscribed(_sub) {
        let sub = _sub;
        if (typeof sub === 'undefined') {
          sub = subredditsService.currentSub;
        }

        console.log('[rpSubredditsService] isSubscribed, rpSubredditsService.subs.length: ' +
            subredditsService.subs.length);
        if (subredditsService.subs.length > 0 && sub !== '') {
          for (let i = 0; i < subredditsService.subs.length; i++) {
            if (
              subredditsService.subs[i].data.display_name.toLowerCase() ===
              sub.toLowerCase()
            ) {
              console.log('[rpSubredditsService] isSubscribed(), true');
              return true;
            }
          }

          console.log('[rpSubredditsService] isSubscribed(), false');
          return false;
        }

        console.log('[rpSubredditsService] isSubscribed(), returning null, rpSubredditsService.subs.length: ' +
            subredditsService.subs.length +
            ', sub: ' +
            sub);

        return null;
      },

      updateSubscriptionStatus() {
        console.log('[rpSubredditsService] updateSubscriptionStatus(), ' +
            subredditsService.subs.length +
            ', ' +
            subredditsService.currentSub);

        subredditsService.subscribed = subredditsService.isSubscribed();
      },

      aboutSub(sub, callback) {
        console.log('[rpSubredditsService] aboutSub(), sub: ' + sub);
        callback(subredditsService.loadSubredditAbout(sub));
      },

      loadSubredditAbout(_sub) {
        let sub = _sub;
        sub = angular.isDefined(sub) ? sub : subredditsService.currentSub;

        rpRedditRequestService.redditRequest(
          'get',
          '/r/$sub/about.json',
          {
            $sub: sub
          },
          function (data) {
            if (data.responseError) {
              console.log('[rpSubredditsService] loadSubredditAbout(), err');
              return data;
            }

            console.log(`[rpSubredditsService] about: ${JSON.stringify(data)}`);

            if (sub === subredditsService.currentSub) {
              subredditsService.about.data = data.data;
              subredditsService.subscribed = data.data.user_is_subscriber;
              rpAppDescriptionService.changeDescription(subredditsService.about.public_description);
            }

            return data;
          }
        );
      }
    };

    console.log('[rpSubredditsService()] sidebar');
    subredditsService.updateSubreddits(subredditsService.updateSubredditsErrorHandler);

    return subredditsService;
  }

  angular
    .module('rpSubreddits')
    .factory('rpSubredditsService', [
      '$rootScope',
      'rpAppAuthService',
      'rpToastService',
      'rpRedditRequestService',
      'rpAppDescriptionService',
      'rpLoginService',
      rpSubredditsService
    ]);
}());
