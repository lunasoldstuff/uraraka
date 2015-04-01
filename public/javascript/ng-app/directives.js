var redditPlusDirectives = angular.module('redditPlusDirectives', []);

redditPlusDirectives.directive('rpPost', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/rpPost'
  };
});

redditPlusDirectives.directive('rpImgurAlbum', function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/rpImgurAlbum',
		controller: 'imgurAlbumCtrl'
	};
});

redditPlusDirectives.directive('rpMedia', function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/rpMedia'
	};
});

redditPlusDirectives.directive('rpTweet', function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/rpTweet',
		controller: 'tweetCtrl'
	};
});
// 
// redditPlusDirectives.directive('faFastScroll', ['$log', function ($log) {
//
//   return {
//     link: function (scope, element, attrs) {
//
//       element.on('scroll', function () {
//         scope.$broadcast('suspend');
//         scope.$digest();
//         scope.$broadcast('resume');
//       });
//
//     }
//   };
// }]);
//
// redditPlusDirectives.directive('faSuspendable', ['$log', function ($log) {
//   return {
//     link: function (scope) {
//       // FIXME: this might break is suspend/resume called out of order
//       // or if watchers are added while suspended
//       var watchers;
//
//       scope.$on('suspend', function () {
//         watchers = scope.$$watchers;
//         scope.$$watchers = [];
//       });
//
//       scope.$on('resume', function () {
//           scope.$$watchers = watchers;
//           watchers = void 0;
//       });
//     }
//   };
// }]);
