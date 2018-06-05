(function () {
  'use strict';

  function rpToolbarSelectCtrl($scope) {
    $scope.config = {
      postSort: {
        type: 'postSort',
        event: 'rp_post_sort_click',
        routeParam: 'sort',
        ariaLabel: 'sort',
        defaultOption: 0,
        options: [
          {
            label: 'hot',
            value: 'hot'
          },
          {
            label: 'new',
            value: 'new'
          },
          {
            label: 'rising',
            value: 'rising'
          },
          {
            label: 'controversial',
            value: 'controversial'
          },
          {
            label: 'top',
            value: 'top'
          },
          {
            label: 'gilded',
            value: 'gilded'
          }
        ]
      },
      postTime: {
        type: 'postTime',
        event: 'rp_post_time_click',
        routeParam: 't',
        ariaLabel: 'time',
        defaultOption: 2,
        options: [
          {
            label: 'this hour',
            value: 'hour'
          },
          {
            label: 'today',
            value: 'day'
          },
          {
            label: 'this week',
            value: 'week'
          },
          {
            label: 'this month',
            value: 'month'
          },
          {
            label: 'this year',
            value: 'year'
          },
          {
            label: 'all time',
            value: 'all'
          }
        ]
      },
      articleSort: {
        type: 'articleSort',
        event: 'rp_article_sort_click',
        routeParam: 'sort',
        ariaLabel: 'sort',
        defaultOption: '0',
        options: [
          {
            label: 'best',
            value: 'confidence'
          },
          {
            label: 'top',
            value: 'top'
          },
          {
            label: 'new',
            value: 'new'
          },
          {
            label: 'hot',
            value: 'hot'
          },
          {
            label: 'controversial',
            value: 'controversial'
          },
          {
            label: 'old',
            value: 'old'
          },
          {
            label: 'q&a',
            value: 'qa'
          }
        ]
      },
      userWhere: {
        type: 'userWhere',
        event: 'rp_user_where_click',
        routeParam: 'where',
        ariaLabel: 'where',
        defaultOption: 0,
        options: [
          {
            label: 'overview',
            value: 'overview'
          },
          {
            label: 'submitted',
            value: 'submitted'
          },
          {
            label: 'comments',
            value: 'comments'
          },
          {
            label: 'gilded',
            value: 'gilded'
          }
        ]
      },
      userSort: {
        type: 'userSort',
        event: 'rp_user_sort_click',
        routeParam: 'sort',
        ariaLabel: 'sort',
        defaultOption: 0,
        options: [
          {
            label: 'new',
            value: 'new'
          },
          {
            label: 'top',
            value: 'top'
          },
          {
            label: 'hot',
            value: 'hot'
          },
          {
            label: 'controversial',
            value: 'controversial'
          }
        ]
      },
      userTime: {
        type: 'userTime',
        event: 'rp_user_time_click',
        routeParam: 't',
        ariaLabel: 'time',
        defaultOption: 1,
        options: [
          {
            label: 'this hour',
            value: 'hour'
          },
          {
            label: 'today',
            value: 'day'
          },
          {
            label: 'this week',
            value: 'week'
          },
          {
            label: 'this month',
            value: 'month'
          },
          {
            label: 'this year',
            value: 'year'
          },
          {
            label: 'all time',
            value: 'all'
          }
        ]
      },
      searchSort: {
        type: 'searchSort',
        event: 'rp_search_sort_click',
        routeParam: 'sort',
        ariaLabel: 'sort',
        defaultOption: '0',
        options: [
          {
            label: 'relevance',
            value: 'relevance'
          },
          {
            label: 'hot',
            value: 'hot'
          },
          {
            label: 'top',
            value: 'top'
          },
          {
            label: 'new',
            value: 'new'
          },
          {
            label: 'comments',
            value: 'comments'
          }
        ]
      },
      searchTime: {
        type: 'searchTime',
        event: 'rp_search_time_click',
        routeParam: 't',
        ariaLabel: 'time',
        defaultOption: 1,
        options: [
          {
            label: 'this hour',
            value: 'hour'
          },
          {
            label: 'today',
            value: 'day'
          },
          {
            label: 'this week',
            value: 'week'
          },
          {
            label: 'this month',
            value: 'month'
          },
          {
            label: 'this year',
            value: 'year'
          },
          {
            label: 'all time',
            value: 'all'
          }
        ]
      },
      messageWhere: {
        type: 'messageWhere',
        event: 'rp_message_where_click',
        routeParam: 'where',
        ariaLabel: 'where',
        defaultOption: 0,
        options: [
          {
            label: 'all',
            value: 'inbox'
          },
          {
            label: 'unread',
            value: 'unread'
          },
          {
            label: 'messages',
            value: 'messages'
          },
          {
            label: 'comment replies',
            value: 'comments'
          },
          {
            label: 'post replies',
            value: 'selfreply'
          },
          {
            label: 'username mentions',
            value: 'mentions'
          }
        ]
      }
    };
  }

  angular
    .module('rpToolbarSelect')
    .controller('rpToolbarSelectCtrl', ['$scope', rpToolbarSelectCtrl]);
}());
