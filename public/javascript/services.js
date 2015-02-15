'use strict';

/* Services */

var redditPlusServices = angular.module('redditPlusServices', ['ngResource']);

phonecatServices.factory('Posts', ['$resource',
  function($resource){
    return $resource('/r/:sub', {}, {
      query: {method:'GET', params:{sub:'sub'}, isArray:true}
    });
  }]);
