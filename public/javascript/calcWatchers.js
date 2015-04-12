jQuery(function () {

    jQuery('#calcWatchers').on('click', function(){
        console.log("calcWatchers: " + calcWatchers());
        console.log("calcWatchers2: " + calcWatchers2());
         // jQuery('#rp-subreddit-posts').masonry({
         //        itemSelector: '.rp-card',
         //        columnWidth: 200,
         //        transitionDuration: 0
         //    });
    });

  function isFullscreen() {
    console.log(window.outerWidth === screen.width && window.outerHeight === screen.height);
  }

    // jQuery('.rp-content').on('scroll', calcWatchers);



    function calcWatchers() {

        var root = angular.element(document.getElementsByTagName('body'));

        var watchers = [];

        var f = function (element) {
            angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) {
                if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                    angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
                        watchers.push(watcher);
                    });
                }
            });

            angular.forEach(element.children(), function (childElement) {
                f(angular.element(childElement));
            });
        };

        f(root);

        // Remove duplicate watchers
        var watchersWithoutDuplicates = [];
        angular.forEach(watchers, function(item) {
            if(watchersWithoutDuplicates.indexOf(item) < 0) {
                 watchersWithoutDuplicates.push(item);
            }
        });

        return watchersWithoutDuplicates.length;
    }

    function calcWatchers2() {
    var root = angular.element(document.getElementsByTagName('body'));
      var watcherCount = 0;
     
      function getElemWatchers(element) {
        var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
        var scopeWatchers = getWatchersFromScope(element.data().$scope);
        var watchers = scopeWatchers;
        var watchers = scopeWatchers.concat(isolateWatchers);
        angular.forEach(element.children(), function (childElement) {
          watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
        });
        return watchers;
      }
      
      function getWatchersFromScope(scope) {
        if (scope) {
          return scope.$$watchers || [];
        } else {
          return [];
        }
      }
      return getElemWatchers(root).length;
    }

});
