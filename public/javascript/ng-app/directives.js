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

redditPlusDirectives.directive('rpLoaded', function(){
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {
			element.bind('load', function(){
				angular.element('#rp-subreddit-posts').masonry();
			});
		}
	};
});

redditPlusDirectives.directive('rpImgurAlbumWrapper', function() {
	return {
		restrict: 'C',
		link: function(scope, element, attrs) {
			
			var prev = 0;

			console.log('im alive!');
			
			element.resize(function() {
				console.log('album resize');
				curr = element.css('height');
				if (curr > prev) {
					prev = curr;
					element.css('min-height', curr);
				}
			});
		}
	};
});

// redditPlusDirectives.directive('faFastScroll', ['$log', function ($log) {

//   return {
//     link: function (scope, element, attrs) {

//       element.on('scroll', function () {
//         scope.$broadcast('suspend');
//         scope.$digest();
//         scope.$broadcast('resume');
//       });

//     }
//   };
// }]);

// redditPlusDirectives.directive('faSuspendable', ['$log', function ($log) {
//   return {
//     link: function (scope) {
//       // FIXME: this might break is suspend/resume called out of order
//       // or if watchers are added while suspended
//       var watchers;

//       scope.$on('suspend', function () {
//         watchers = scope.$$watchers;
//         scope.$$watchers = [];
//       });

//       scope.$on('resume', function () {
//           scope.$$watchers = watchers;
//           watchers = void 0;
//       });
//     }
//   };
// }]);

// redditPlusDirectives.directive('rpSuspendable', ['$log', function ($log) {
//   return {
// 	link: function (scope, element, attrs) {
// 	  var watchers = [];
// 	  var beenHidden = false;
// 	  var i = 0;

// 	scope.$on('suspend_columns', function () {
// 		// $log.log('suspend directive heard event, display: ' + element.css('display') + ", beenHidden: " + beenHidden);
// 		if (!beenHidden && element.css('display') === 'none') {
// 			// $log.log('remove watchers');
// 			watchers = scope.$$watchers;
// 			scope.$$watchers = [];
// 			beenHidden = true;
// 		} else if (beenHidden && element.css('display') !== 'none') {
// 			// $log.log('restore watchres, watchers.length: ' + watchers.length);
// 			scope.$$watchers = watchers;
// 			watchers = [];
// 			beenHidden = false;
// 		}
// 	});
// 	}
//   };
// }]);

// redditPlusDirectives.directive('rpSuspendable', ['$log', function ($log) {
// 	function removeElemWatchers(watchers, element) {

// 		if (element.scope()) {

// 			// if (element.scope().$$watchers !== null && element.scope().$$watchers.length > 0) {
				
// 				// $log.log("Before retrieving, element " + element.scope().$id + " has " + element.scope().$$watchers.length + " watchers");

// 				// watchers[element.scope().$id] = element.scope().$$watchers;
// 				watchers.push(element.scope().$$watchers);
// 				element.scope().$$watchers = [];

// 			// }
			
// 			angular.forEach(element.children(), function (childElement) {
// 				watchers = removeElemWatchers(watchers, angular.element(childElement));
// 			});
			
// 		}
		
// 		return watchers;

// 	}

// 	function retrieveElemWatchers(watchers, element) {
		
// 		if (element.scope()) {
			
// 			// if(watchers[element.scope().$id]) {
// 				// element.scope().$$watchers = watchers[element.scope().$id]; 
// 				element.scope().$$watchers = watchers.shift();
// 				// $log.log("After setting, element " + element.scope().$id + " has " + element.scope().$$watchers.length + " watchers");
// 			// }

// 			angular.forEach(element.children(), function(childElement) {
// 				element = retrieveElemWatchers(watchers, angular.element(childElement));
// 			});

// 			return element;

// 		}
// 	}  

// 	return {
// 		link: function (scope, element, attrs) {
			
// 			// var watchers = {};
// 			var watchers = [];
// 			var beenHidden = false;

// 			scope.$on('suspend_columns', function () {
		
// 				// $log.log('suspend directive heard event, display: ' + element.css('display') + ", beenHidden: " + beenHidden);
				
// 				if (!beenHidden && element.css('display') === 'none') {
					
// 					// $log.log('remove watchers');
					
// 					$log.log("element.watchers.length, before removing: " + element.scope().$$watchers.length);
					
// 					watchers = removeElemWatchers(watchers, element);

// 					// $log.log("saved watchers: " + Object.keys(watchers).length);
// 					$log.log("saved watchers: " + watchers.length);


// 					beenHidden = true;

// 				} else if (beenHidden && element.css('display') === 'block') {

// 					// $log.log("restoring watchers: " + Object.keys(watchers).length);
// 					$log.log("restoring watchers: " + watchers.length);
					
// 						$log.log("element.watchers.length, before restoring: " + element.scope().$$watchers.length);

// 					element = retrieveElemWatchers(watchers, element);

// 						$log.log("element.watchers.length, after restoring: " + element.scope().$$watchers.length);

// 					// watchers = {};
// 					watchers = [];

// 					beenHidden = false;
// 				}
// 			});
// 		}
// 	};
// }]);