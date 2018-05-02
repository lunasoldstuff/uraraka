(function () {
  'use strict';

  function rpSlideshow(
    $rootScope,
    $compile,
    $timeout
  ) {
    return {
      restrict: 'E',
      templateUrl: 'rpSlideshow/views/rpSlideshow.html',
      controller: 'rpSlideshowCtrl',
      link: function (scope, element, attrs) {
        var deregisterCancelHideHeader;
        var deregisterShowHeader;

        var hideControls;
        var hideHeader;

        console.log('[rpSlideshow] link');


        angular.element('html')
          .bind('mousemove', function () {
            // console.log('[rpSlideshow] link, mousemove');

            $timeout.cancel(hideControls);
            $timeout.cancel(hideHeader);

            if (scope.showControls === false) {
              $timeout(function () {
                console.log('[rpSlideshow] link, mousemove show controls, scope.isPlaying: ' + scope.isPlaying);
                scope.showControls = true;
              }, 0);
            }

            if (scope.showHeader === false) {
              $timeout(function () {
                console.log('[rpSlideshow] link, mousemove show controls');
                scope.showHeader = true;
              }, 0);
            }

            if (angular.isUndefined(scope.mouseOverControls) || scope.mouseOverControls === false) {
              hideControls = $timeout(function () {
                console.log('[rpSlideshow] link, mousemove hide controls');
                scope.showControls = false;
                $timeout(angular.noop, 0);
              }, 3000);
            }

            if (angular.isUndefined(scope.mouseOverHeader) || scope.mouseOverHeader === false) {
              hideHeader = $timeout(function () {
                console.log('[rpSlideshow] link, mousemove hide controls');
                scope.showHeader = false;
                $timeout(angular.noop, 0);
              }, 3000);
            }
          });

        angular.element('html')
          .bind('keydown', function (event) {
            console.log('[rpSlideshow] link, event.which: ' + event.which);
            switch (event.which) {
              case 27:
                scope.closeSlideshow(event);
                break;
              case 39:
                $rootScope.$emit('rp_slideshow_next');
                break;
              case 37:
                $rootScope.$emit('rp_slideshow_prev');
                break;
              case 32:
                console.log('[rpSlideshow] link spacebar');
                $rootScope.$emit('rp_slideshow_play_pause');
                break;
              default:
                break;
            }
          });

        deregisterShowHeader = $rootScope.$on('rp_slideshow_show_header', function () {
          console.log('[rpSlideshow] showHeader()');
          if (!scope.headerFixed) {
            if (scope.showHeader === false) {
              $timeout(function () {
                scope.showHeader = true;
              }, 0);

              if (angular.isUndefined(scope.mouseOverHeader) || scope.mouseOverHeader === false) {
                console.log('[rpSlideshow] showHeader() set hide header timeout');
                hideHeader = $timeout(function () {
                  scope.showHeader = false;
                  $timeout(angular.noop, 0);
                }, 3000);
              }
            }
          }
        });

        deregisterCancelHideHeader = $rootScope.$on('rp_slideshow_cancel_hide_header', function () {
          console.log('[rpSlideshow] link, rp_slideshow_cancel_hide_header');
          if (angular.isDefined(hideHeader)) {
            $timeout.cancel(hideHeader);
          }
        });

        scope.$on('$destroy', function () {
          deregisterShowHeader();
          deregisterCancelHideHeader();
        });
      }
    };
  }

  angular.module('rpSlideshow')
    .directive('rpSlideshow', [
      '$rootScope',
      '$compile',
      '$timeout',
      rpSlideshow
    ]);
}());
