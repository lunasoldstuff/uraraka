var redditPlusDirectives = angular.module('redditPlusDirectives', []);

redditPlusDirectives.directive('rpPost', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/rpPost'
  };
});