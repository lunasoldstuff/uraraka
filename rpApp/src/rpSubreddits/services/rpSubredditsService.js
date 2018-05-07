(function () {
  'use strict';

  function rpSubredditsService(
    $rootScope,
    rpAppAuthService,
    rpToastService,
    rpRedditRequestService

  ) {
    const LIMIT = 50;

    var subredditsService = {
      subs: [],
      currentSub: '',
      about: {},
      subscribed: null,

      updateSubreddits(callback) {
        if (rpAppAuthService.isAuthenticated) {
          this.loadUserSubreddits(callback);
        } else {
          this.loadDefaultSubreddits(callback);
        }
      },
      updateSubredditsErrorHandler(error, data) {
        if (error) {
          console.log('[rpSubredditsService] updateSubreddits, load subreddits failed');
          this.updateSubreddits(this.updateSubredditsErrorHandler);
        }
      },
      resetSubreddit() {
        this.currentSub = '';
        this.subscribed = null;
        this.about = {};
      },
      setSubreddit(sub) {
        if (sub && this.currentSub !== sub) {
          this.currentSub = sub;
          this.updateSubscriptionStatus();
          this.loadSubredditAbout();
        }
      },
      loadUserSubreddits(callback) {
        console.log('[rpSubredditsService] loadUserSubreddits()');

        rpRedditRequestService.redditRequest('listing', '/subreddits/mine/$where', {
          $where: 'subscriber',
          limit: LIMIT,
          after: ''

        }, (data) => {
          if (data.responseError) {
            console.log('[rpSubredditsService] loadUserSubreddits(), ResponseError');
            rpToastService('something went wrong updating your subreddits', 'sentiment_dissatisfied');
            callback(data, null);
          } else if (data.get.data.children.length > 0) {
            subredditsService.subs = data.get.data.children;

            /*
              we have all the subreddits, no need to get more.
              */
            if (data.get.data.children.length < LIMIT) {
              $rootScope.$emit('subreddits_updated');
              subredditsService.updateSubscriptionStatus();
              callback(null, data);
            } else { // dont have all the subreddits yet, get more.
              subredditsService.loadMoreUserSubreddits(
                data.get.data.children[data.get.data.children.length - 1].data.name,
                callback
              );
            }

            /*
              no subreddits returned. load deafult subs.
              */
          } else { // If the user has no subreddits load the default subs.
            subredditsService.loadDefaultSubreddits(callback);
          }
        });
      },
      loadMoreUserSubreddits(after, callback) {
        console.log('[rpSubredditsService] loadMoreUserSubreddits(), after: ' + after);

        rpRedditRequestService.redditRequest('listing', '/subreddits/mine/$where', {
          $where: 'subscriber',
          after: after,
          limit: LIMIT
        }, (data) => {
          if (data.responseError) {
            console.log('[rpSubredditsService] loadMoreUserSubreddits() ResponseError');
            rpToastService('something went wrong updating your subreddits', 'sentiment_dissatisfied');
            callback(data, null);
          } else {
            // add the subreddits instead of replacing.
            subredditsService.subs = this.subs.concat(data.get.data.children);

            // end case.we have all the subreddit.
            if (data.get.data.children.length < LIMIT) {
              $rootScope.$emit('subreddits_updated');
              subredditsService.updateSubscriptionStatus();
              callback(null, data);
            } else { // dont have all the subreddits yet. recurse to get more.
              subredditsService.loadMoreUserSubreddits(
                data.get.data.children[data.get.data.children.length - 1].data.name,
                callback
              );
            }
          }
        });
      },
      loadDefaultSubreddits(callback) {
        console.log('[rpSubredditsService] loadDefaultSubreddits()');

        rpRedditRequestService.redditRequest('listing', '/subreddits/$where', {
          $where: 'default',
          limit: LIMIT
        }, (data) => {
          if (data.responseError) {
            console.log('[rpSubredditsService] err');
            rpToastService('something went wrong updating your subreddits', 'sentiment_dissatisfied');
            callback(data, null);
          } else {
            console.log('[rpSubredditsService] loadDefaultSubreddits(), data.get.data.children.length: ' +
              data.get.data.children.length);

            subredditsService.subs = data.get.data.children;
            $rootScope.$emit('subreddits_updated');
            subredditsService.updateSubscriptionStatus();
            callback(null, data);
          }
        });
      },
      subscribeCurrent(callback) {
        console.log('[rpSubredditsService] subscribeCurrent(), currentSub: ' + this.currentSub);
        let action = this.subscribed ? 'unsub' : 'sub';

        rpRedditRequestService.redditRequest('post', '/api/subscribe', {
          action: action,
          sr: this.about.data.name
        }, (data) => {
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
        });
      },
      subscribe(action, name, callback) {
        console.log('[rpSubredditsService], subscribe(), action: ' + action + ', name: ' + name);

        if (rpAppAuthService.isAuthenticated) {
          rpRedditRequestService.redditRequest('post', '/api/subscribe', {
            action: action,
            sr: name
          }, function (data) {
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
          });
        } else {
          rpToastService('you must log in to subscribe to subreddits', 'sentiment_neutral');
        }
      },
      isSubscribed(_sub) {
        let sub = _sub;
        if (typeof sub === 'undefined') {
          sub = this.currentSub;
        }

        console.log('[rpSubredditsService] isSubscribed, rpSubredditsService.subs.length: ' + this.subs
          .length);
        if (this.subs.length > 0 && sub !== '') {
          for (let i = 0; i < this.subs.length; i++) {
            if (this.subs[i].data.display_name.toLowerCase() === sub.toLowerCase()) {
              console.log('[rpSubredditsService] isSubscribed(), true');
              return true;
            }
          }

          console.log('[rpSubredditsService] isSubscribed(), false');
          return false;
        }

        console.log('[rpSubredditsService] isSubscribed(), returning null, rpSubredditsService.subs.length: ' +
          this.subs.length + ', sub: ' + sub);

        return null;
      },
      updateSubscriptionStatus() {
        console.log('[rpSubredditsService] updateSubscriptionStatus(), ' + this.subs.length + ', ' +
          this.currentSub);

        let prevSubStatus = this.subscribed;
        this.subscribed = this.isSubscribed();


        if (this.subscribed !== prevSubStatus) {
          console.log('[rpSubredditsService] updateSubscriptionStatus(), rpSubredditsService.subscribed: ' +
            this.subscribed);
          $rootScope.$emit('subscription_status_changed', this.subscribed);
        }
      },
      aboutSub(sub, callback) {
        console.log('[rpSubredditsService] aboutSub(), sub: ' + sub);
        callback(this.loadSubredditAbout(sub));
      },
      loadSubredditAbout(_sub) {
        // console.log('[rpSubredditsService] loadSubredditAbout()');
        let sub = _sub;
        sub = angular.isDefined(sub) ? sub : this.currentSub;

        rpRedditRequestService.redditRequest('get', '/r/$sub/about.json', {
          $sub: sub
        }, function (data) {
          if (data.responseError) {
            console.log('[rpSubredditsService] loadSubredditsAbout(), err');
            return data;
          }
          console.log('[rpSubredditsService] loadSubredditsAbout, data.data.name: ' + data.data.name);
          // console.log('[rpSubredditsService] loadSubredditsAbout, data: ' + JSON.stringify(data));

          if (sub === subredditsService.currentSub) {
            subredditsService.about = data;
            $rootScope.$emit('subreddits_about_updated');
            $rootScope.$emit('rp_description_change', subredditsService.about.data.public_description);
          }

          return data;
        });
      }

    };

    subredditsService.updateSubreddits(subredditsService.updateSubredditsErrorHandler);

    return subredditsService;
  }

  angular.module('rpSubreddits')
    .factory('rpSubredditsService', [
      '$rootScope',
      'rpAppAuthService',
      'rpToastService',
      'rpRedditRequestService',
      rpSubredditsService
    ]);
}());
