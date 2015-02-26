var redditPlusDirectives = angular.module('redditPlusDirectives', []);

redditPlusDirectives.directive('rpPost', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/rpPost'
  };
});

redditPlusDirectives.controller('rpIngurAlbumCtrl', ['$scope', '$log',
	function($scope, $log){

	}
]).directive('rpImgurAlbum', function(){
	return {
		restrict: 'E',
		template: 'partials/rpImgurAlbum'
	}
});