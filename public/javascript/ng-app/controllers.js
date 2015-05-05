'use strict';

/* Controllers */

var redditPlusControllers = angular.module('redditPlusControllers', []);

/*
	Top level controller.
	controls sidenav toggling. (This might be better suited for the sidenav controller no?)
 */
redditPlusControllers.controller('AppCtrl', ['$scope', '$timeout', '$mdSidenav', '$log', 'titleChangeService',
	function($scope, $timeout, $mdSidenav, $log, titleChangeService) {
	$scope.appTitle = 'reddit: the frontpage of the internet';

	$scope.$on('handleTitleChange', function(e, d) {
		$scope.appTitle = titleChangeService.title;
	});

	$scope.toggleLeft = function() {
		$mdSidenav('left').toggle();
	};

	$scope.close = function() {
		$mdSidenav('left').close();
	};
	}
]);

redditPlusControllers.controller('identityCtrl', ['$scope', 'identityService',
	function($scope, identityService){
		$scope.identity = identityService.query();
	}
]);

redditPlusControllers.controller('toastCtrl', ['$scope', '$rootScope', '$mdToast', 'toastMessage',
	function($scope, $rootScope, $mdToast, toastMessage){
		$scope.toastMessage = toastMessage;

		$scope.closeToast = function() {
			$mdToast.close();
		};

		$rootScope.$on('show_toast', function(e, message) {
			$mdToast.show({
				locals: {toastMessage: message},
				controller: 'toastCtrl',
				templateUrl: 'partials/rpToast',
				hideDelay: 2000,
				position: "top left",
			});			
		});

	}
]);

// redditPlusControllers.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
//   $scope.close = function() {
// 	$mdSidenav('left').close();
//   };
// });

/*
	Toolbar controller handles title change through titleService.
 */
redditPlusControllers.controller('toolbarCtrl', ['$scope', '$rootScope', '$log', 'titleChangeService',
	function($scope, $rootScope, $log, titleChangeService) {
		$scope.filter = false;

	$scope.toolbarTitle = 'reddit: the frontpage of the internet';
	$scope.$on('handleTitleChange', function(e, d) {
		$scope.toolbarTitle = titleChangeService.title;
	});

	$rootScope.$on('tab_change', function(e, tab) {
		if (tab == 'top' || tab == 'controversial') {
			$scope.filter = true;
		} else {
			$scope.filter = false;
		}
	});
	}
]);

redditPlusControllers.controller('tabsCtrl', ['$scope', '$rootScope', '$log', 'subredditService',
	function($scope, $rootScope, $log, subredditService) {
	$scope.subreddit = 'all';
	$scope.selectedIndex = 0;

	$scope.$on('handleSubredditChange', function(e, d){
		$scope.subreddit = subredditService.subreddit;
	});

	$rootScope.$on('tab_change', function(e, tab){
		switch(tab) {
			case 'hot':
				$scope.selectedIndex = 0;
				break;
			case 'new':
				$scope.selectedIndex = 1;
				break;
			case 'rising':
				$scope.selectedIndex = 2;
				break;
			case 'controversial':
				$scope.selectedIndex = 3;
				break;
			case 'top':
				$scope.selectedIndex = 4;
				break;
			default:
				$scope.selectedIndex = 0;
				break;
		}
	});

	$scope.tabClick = function(tab) {

		console.log('[tabsCtrl] tabClick: ' + tab);

		$rootScope.$emit('tab_click', tab);
	};
	}
]);

redditPlusControllers.controller('timeFilterCtrl', ['$scope', '$rootScope', 
	function($scope, $rootScope) {
		$scope.selectTime = function(value){
			$rootScope.$emit('t_click', value);
		};

	}
]);

redditPlusControllers.controller('postsCtrl',
	[
		'$scope',
		'$rootScope',
		'$routeParams',
		'$log',
		'$window',
		'$timeout',
		'postsService',
		'titleChangeService',
		'subredditService',
		'$mdToast',
		'$mdDialog',
		'voteService',
		'saveService',
		'unsaveService',

		function($scope, $rootScope, $routeParams, $log, $window, $timeout, postsService,
			titleChangeService, subredditService, $mdToast, $mdDialog, voteService, saveService, unsaveService) {

			var value = $window.innerWidth;
			
			if (value > 1550) {
				// $log.log("Changing to 3 columns, window size: " + value);
				$scope.columns = [1, 2, 3];
			} else if (value > 970) {
				// $log.log("Changing to 2 columns, window size: " + value);
				$scope.columns = [1, 2];
			} else {
				// $log.log("Changing to 1 column, window size: " + value);
				$scope.columns = [1];
			}

			var sort = $routeParams.sort ? $routeParams.sort : 'hot';
			var sub = $routeParams.sub ? $routeParams.sub : 'all';
			var t;
			var loadingMore = false;
			$scope.showSub = true;
			$scope.havePosts = false;

			if (sub == 'all'){
				$scope.showSub = true;
				titleChangeService.prepTitleChange('reddit: the frontpage of the internet');
			}
			else{
				$scope.showSub = false;
				titleChangeService.prepTitleChange('r/' + sub);
			}
			subredditService.prepSubredditChange(sub);

			$rootScope.$emit('tab_change', sort);

			/*
				Loading Posts
			 */

			$rootScope.$emit('progressLoading');
			postsService.query({sub: sub, sort: sort}, function(data){
				$rootScope.$emit('progressComplete');
				data.forEach(function(post) { 
					post.data.rp_type = mediaType(post.data);
				});
				$scope.posts = data;
				$scope.havePosts = true;

			});

			/*
				Load more posts using the 'after' parameter.
			 */
			$scope.morePosts = function() {
				if ($scope.posts && $scope.posts.length > 0){
					var lastPostName = $scope.posts[$scope.posts.length-1].data.name;
					if(lastPostName && !loadingMore){
						loadingMore = true;
						$rootScope.$emit('progressLoading');
						postsService.query({sub: sub, sort: sort, after: lastPostName, t: t}, function(data) {
							data.forEach(function(post){ post.data.rp_type = mediaType(post.data); });
							Array.prototype.push.apply($scope.posts, data);
							loadingMore = false;
							$rootScope.$emit('progressComplete');
						});
					}
				}
			};

			$rootScope.$on('t_click', function(e, time){
				t = time;
				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;

				postsService.query({sub: sub, sort: sort, t: t}, function(data){
					data.forEach(function(post){ 
						post.data.rp_type = mediaType(post.data); 
					});
					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
				});
			});

			$rootScope.$on('tab_click', function(e, tab){
				sort = tab;
				$rootScope.$emit('tab_change', tab);
				$rootScope.$emit('progressLoading');
				$scope.havePosts = false;
				postsService.query({sub: sub, sort: sort}, function(data) {
					data.forEach(function(post){ 
						post.data.rp_type = mediaType(post.data); 
					});
					$scope.posts = data;
					$scope.havePosts = true;
					$rootScope.$emit('progressComplete');
				});
			});

						/*
				event handlers for post actions emitted from comments controller
			 */

			$rootScope.$on('upvote_post', function(e, post) {
				upvotePost($scope, voteService, post);
			});

			$rootScope.$on('downvote_post', function(e, post) {
				downvotePost($scope, voteService, post);
			});

			$rootScope.$on('save_post', function(e, post) {
				savePost($scope, saveService, unsaveService, post);
			});
			
			$scope.savePost = function(post) {
				savePost($scope, saveService, unsaveService, post);
			};

			$scope.upvotePost = function(post) {
				upvotePost($scope, voteService, post);
			};
			
			$scope.downvotePost = function(post) {
				downvotePost($scope, voteService, post);
			};

			$scope.promptLogin = function(message) {
				$mdToast.show({
					locals: {toastMessage: message},
					controller: 'toastCtrl',
					templateUrl: 'partials/rpToast',
					hideDelay: 2000,
					position: "top left",
				});
			};

			$scope.showComments = function(e, post) {
				
				$mdDialog.show({
					controller: 'commentsCtrl',
					templateUrl: 'partials/rpComments',
					targetEvent: e,
					// parent: angular.element('#rp-content'),
					locals: {post: post}

				});
			};
			
		}
	]
);

function upvotePost(scope, voteService, post) {
	if (scope.authenticated) {
		var dir = post.data.likes ? 0 : 1;
		if (dir == 1)
				post.data.likes = true;
			else
				post.data.likes = null;
		voteService.save({id: post.data.name, dir: dir}, function(data) {
			// $log.log(data);
		});
	} else {
		scope.promptLogin("vote");
	}
}

function downvotePost(scope, voteService, post) {
	if (scope.authenticated) {
		var dir;

		if (post.data.likes === false) {
			dir = 0;
		} else {
			dir = -1;
		}

		if (dir == -1)
				post.data.likes = false;
			else
				post.data.likes = null;
		
		voteService.save({id: post.data.name, dir: dir}, function(data) {
			// $log.log(data);
		});
	} else {
		scope.promptLogin('vote');
	}
}

function savePost(scope, saveService, unsaveService, post) {
	if (scope.authenticated) {
		if (post.data.saved) {
			post.data.saved = false;
			unsaveService.save({id: post.data.name}, function(data) {

			});
		} else {
			post.data.saved = true;
			saveService.save({id: post.data.name}, function(data) {

			});
		}
	} else {
		scope.promptLogin('save posts');
	}	
}

function mediaType(data) {

	var url = data.url;
	var domain = data.domain;

	if (data.is_self)
	  return 'self';

	if (data.media) {
	  if (data.media.oembed.type == 'video') {
		if (data.media_embed)
		  return 'embed';
		else
		  return 'video';
	  }
	}

	if (data.domain == "twitter.com" && url.indexOf('/status/') > 0)
	  return 'tweet';

	var testImageUrl = url;
	testImageUrl = testImageUrl.substr(0, testImageUrl.indexOf('?'));

	// if (url.substr(url.length-4) == '.jpg' || url.substr(url.length-4) == '.png')
	if (testImageUrl.substr(testImageUrl.length-4) == '.jpg' || testImageUrl.substr(testImageUrl.length-4) == '.png')
	  return 'image';

	if (data.domain.indexOf('imgur.com') >= 0)
	  if (url.indexOf('/a/') > 0 || url.indexOf('/gallery/') > 0 ||
		url.substring(url.lastIndexOf('/')+1).indexOf(',') > 0) {
		return 'album';
	  }


	if (
			data.domain == "gfycat.com" ||
			url.substr(url.length-5) == '.gifv' ||
			url.substr(url.length-5) == '.webm' ||
			url.substr(url.length-4) == '.mp4' ||
			url.indexOf('.gif') > 0
		)
	  return 'video';

	if(domain.substr(domain.length-9) == 'imgur.com')
	  return 'image';

	return 'default';
}

redditPlusControllers.controller('commentsSortCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope) {
		
		$scope.selectedIndex = 0;
		$scope.sort = 'confidence';

		$scope.commentsSort = function(sort){

			$rootScope.$emit('comments_sort', sort);

			switch(sort) {
				case 'confidence':
					$scope.selectedIndex = 0;
					$scope.sort = 'confidence';
					break;
				case 'top':
					$scope.selectedIndex = 1;
					$scope.sort = 'top';
					break;
				case 'new':
					$scope.selectedIndex = 2;
					$scope.sort = 'new';
					break;
				case 'hot':
					$scope.selectedIndex = 3;
					$scope.sort = 'hot';
					break;
				case 'controversial':
					$scope.selectedIndex = 4;
					$scope.sort = 'controversial';
					break;
				case 'old':
					$scope.selectedIndex = 5;
					$scope.sort = 'old';
					break;
				default:
					$scope.selectedIndex = 0;
					$scope.sort = 'confidence';
					break;
			}
		};
	}
]);

redditPlusControllers.controller('commentsCtrl', ['$scope', '$rootScope', '$mdDialog', 'post', 'commentsService', 
	'voteService', 'saveService', 'unsaveService',
	function($scope, $rootScope, $mdDialog, post, commentsService, voteService, saveService, unsaveService) {
		
		$scope.post = post;

		if (!$scope.sort)
			$scope.sort = 'confidence';

		getComments($scope, commentsService);

		$rootScope.$on('comments_sort', function(e, sort) {
			$scope.sort = sort;
			getComments($scope, commentsService);
		});

		$scope.closeDialog = function() {
			$mdDialog.hide();
		};

		$scope.upvotePost = function() {
			$rootScope.$emit('upvote_post', post);
		};

		$scope.downvotePost = function() {
			$rootScope.$emit('downvote_post', post);
		};

		$scope.savePost = function() {
			$rootScope.$emit('save_post', post);
		};

	}

]);

/*
	Helper function to get comments
 */
function getComments(scope, commentsService) {
	scope.threadLoading = true;
	commentsService.query({
		subreddit: scope.post.data.subreddit, 
		article: scope.post.data.id,
		sort: scope.sort
	}, function(data) {
		scope.comments = data[1].data.children;
		scope.threadLoading = false;
	});
}

redditPlusControllers.controller('commentCtrl', ['$scope', '$rootScope', '$element', '$compile', 'moreChildrenService',
	function($scope, $rootScope, $element, $compile, moreChildrenService) {

		if ($scope.comment.data.replies) {
			$scope.childDepth = $scope.depth + 1;
		}

		$scope.showReply = false;

		$scope.showMore = function() {
			$scope.loadingMoreChildren = true;
			moreChildrenService.query({
				sort: $scope.sort,
				link_id: $scope.post.data.name,
				children: $scope.comment.data.children.join(",")
			}, function(data) {
				$scope.loadingMoreChildren = false;
				$scope.moreChildren = data.json.data.things;
				$compile("<rp-comment ng-repeat='comment in moreChildren' " + 
					"comment='comment' depth='depth' post='post' sort='sort'></rp-comment>")
					($scope, function(cloned, scope) {
						$element.replaceWith(cloned);
					});				
			});
		};

		$scope.toggleReply = function() {
			$scope.showReply = !$scope.showReply;
		};

		$scope.upvotePost = function() {
			$rootScope.$emit('upvote_post', $scope.comment);
		};

		$scope.downvotePost = function() {
			$rootScope.$emit('downvote_post', $scope.comment);
		};

		$scope.savePost = function() {
			$rootScope.$emit('save_post', $scope.comment);
		};		


	}
]);

/*
	Determine the type of the media link
 */

redditPlusControllers.controller('commentMediaCtrl', ['$scope', '$element',
	function($scope, $element) {
		$scope.redditLink = false;
		if ($scope.href.indexOf('/r/') === 0) {
		 	$scope.redditLink = true;
		}
	}
]);

/*
	Sidenav Subreddits Controller
	Gets popular subreddits.
 */
redditPlusControllers.controller('subredditsCtrl', ['$scope', 'subredditsService',
	function($scope, subredditsService){
		$scope.subs = subredditsService.query();
	}
]);


redditPlusControllers.controller('mediaCtrl', ['$scope', 
	function($scope) {
		


	}
]);

redditPlusControllers.controller('rpMediaDefaultCtrl', ['$scope', 
	function($scope) {
	
		if (
			$scope.url.substr($scope.url.length-4) === '.jpg' || $scope.url.substr($scope.url.length-5) === '.jpeg' ||
			$scope.url.substr($scope.url.length-4) === '.png' || $scope.url.substr($scope.url.length-4) === '.bmp'
		) {
			$scope.playable = false;
			$scope.imageUrl = $scope.url;
		
		} 

		else if ($scope.url.substr($scope.url.length-4) === '.gif' || $scope.url.length-5 === '.gifv') {
			$scope.defaultType = 'gif'
			$scope.gifUrl = $scope.url;
			$scope.playable = true;
		} 

		else if ($scope.url.substr($scope.url.length-5) === '.webm') {
			$scope.defaultType = 'video'
			$scope.webmUrl = $scope.url;
			$scope.playable = true;
		} 

		else if ($scope.url.substr($scope.url.length-4) === '.mp4') {
			$scope.defaultType = 'video'
			$scope.mp4Url = $scope.url;
			$scope.playable = true;
		}


		// Could not directly identify media type from url fall back to post data
		else if ($scope.post) {

			if ($scope.post.data.media) {

				if ($scope.post.data.media.oembed.type === 'video') {
					$scope.defaultType = 'embed';
					$scope.playable = true;
				}

			} 

			else if ($scope.post.data.thumbnail) {
				
				$scope.playable = false;

				$scope.imageUrl = $scope.post.data.thumbnail;

			}

		}


		if ($scope.playable) {

			//might error if no post defined in scope
			if ($scope.post && $scope.post.data.thumbnail) {
				$scope.thumbnailUrl = $scope.post.data.thumbnail;
			}

		}

		$scope.showPlayable = false;

		$scope.show = function() {
			$scope.showPlayable = true;
		};

		$scope.hide = function() {
			$scope.showPlayable = false;
		};

	}
]);

redditPlusControllers.controller('rpMediaGiphyCtrl', ['$scope', 
	function($scope) {
	
		var giphyRe = /^http:\/\/(?:www\.)?giphy\.com\/gifs\/(.*?)(\/html5)?$/i;
		var giphyAltRe = /^http:\/\/(?:www\.)?(?:i\.)?giphy\.com\/([\w]+)(?:.gif)?/i;
		var giphyAlt2Re = /^https?:\/\/(?:www\.)?(?:media[0-9]?\.)?(?:i\.)?giphy\.com\/(?:media\/)?([\w]+)(?:.gif)?/i;
		var groups;
		
		if (giphyRe.test($scope.url)) {
			groups = giphyRe.exec($scope.url);
		}
		else if (giphyAltRe.test($scope.url)) {
			groups = giphyAltRe.exec($scope.url);
		} else if (giphyAlt2Re.test($scope.url)) {
			groups = giphyAlt2Re.exec($scope.url);
		}

		$scope.giphyType = (groups[2]) ? 'video' : 'image';				

		if (groups) {

			$scope.thumbnailUrl = 'http://media.giphy.com/media/' + groups[1] + '/200_s.gif';

			if ($scope.giphyType === 'image') {
				$scope.imageUrl = 'http://media.giphy.com/media/' + groups[1] + '/giphy.gif';
			} else if ($scope.giphyType === 'video') {
				$scope.videoUrl = 'http://media.giphy.com/media/' + groups[1] + '/giphy.mp4';
			}

		}

		$scope.show = function() {
			$scope.showGif = true;
		};

		$scope.hide = function() {
			$scope.showGif = false;
		};	
	}
]);

redditPlusControllers.controller('rpMediaGfycatCtrl', ['$scope', 
	function($scope) {
		
		var gfycatRe = /(^https?:\/\/[\w]?\.?)?gfycat\.com\/(\w+)(\.gif)?/i;
		var groups = gfycatRe.exec($scope.url);
		
		console.log('[rpMediaGfycatCtrl] url: ' + $scope.url);
		console.log('[rpMediaGfycatCtrl] groups[1]: ' + groups[1]);
		console.log('[rpMediaGfycatCtrl] groups[2]: ' + groups[2]);
		console.log('[rpMediaGfycatCtrl] groups[3]: ' + groups[3]);


		if (groups[3] && groups[3] == '.gif')
			$scope.gfycatType = 'image';
		else
			$scope.gfycatType = 'video';

		$scope.showGif = false;

		var prefix = 'https://';
		// var prefix = groups[1];
		// var prefix = 'http://zippy.';
		// var prefix = groups[1] || 'http://zippy.';
		// var prefix = 'http://giant.';

		console.log('[rpMediaGfycatCtrl] prefix: ' + prefix);


		if (groups) {

			$scope.dataId = groups[2];
			
			$scope.thumbnailUrl = 'http://thumbs.gfycat.com/' + groups[2] + '-poster.jpg';

			if ($scope.gfycatType === 'image') {
				$scope.imageUrl = prefix + 'gfycat.com/' + groups[2] + '.gif';
			} else if ($scope.gfycatType === 'video') {
				// $scope.videoUrl = prefix + 'gfycat.com/' + groups[2] + '.webm';
				// $scope.videoUrl = prefix + 'gfycat.com/' + groups[2];

				$scope.zippyVideoUrl = 'http://zippy.gfycat.com/' + groups[2] + '.webm';
				$scope.fatVideoUrl = 'http://fat.gfycat.com/' + groups[2] + '.webm';
				$scope.giantVideoUrl = 'http://giant.gfycat.com/' + groups[2] + '.webm';
			}

		}

		$scope.show = function() {
			$scope.showGif = true;
		};

		$scope.hide = function() {
			$scope.showGif = false;
		};				
	}
]);

redditPlusControllers.controller('rpMediaTwitterCtrl', ['$scope', '$sce', 'tweetService',
	function($scope, $sce, tweetService) {
		
		$scope.tweet = "";
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
		var groups = twitterRe.exec($scope.url);

		if (groups) {
			var data = tweetService.query({id: groups[1]}, function(data){
				$scope.tweet = $sce.trustAsHtml(data.html);
			});
		}
		
	}
]);

/*
	Youtube Video
 */
redditPlusControllers.controller('rpMediaYoutubeCtrl', ['$scope', '$sce',
	function($scope, $sce) {
		
		var youtubeRe = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i;
		var youtubeAltRe = /^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)/i;

		var groups;
		groups = youtubeRe.exec($scope.url);
		if (!groups) groups = youtubeAltRe.exec($scope.url);

		if (groups) {
			$scope.thumbnailUrl = 'https://img.youtube.com/vi/'+ groups[1] + '/default.jpg';
			$scope.embedUrl = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + groups[1]);
		}

		$scope.showYoutubeVideo = false;

		$scope.show = function() {
			$scope.showYoutubeVideo = true;
		};

		$scope.hide = function() {
			$scope.showYoutubeVideo = false;
		};		

	}
]);

/*
	Imgur Controller
 */
redditPlusControllers.controller('rpMediaImgurCtrl', ['$scope',
	function($scope) {

		var imgurRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/[\w]+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)([\w]{5,7}(?:[&,][\w]{5,7})*)(?:#\d+)?[sbtmlh]?(\.(?:jpe?g|gif|png|gifv|webm))?(\?.*)?$/i;
		var groups = imgurRe.exec($scope.url);

		var extension = groups[2] || '.jpg';

		if (extension == '.gif' || extension == '.gifv' || extension == '.webm')
			$scope.imgurType = 'video';
		else
			$scope.imgurType = 'image';

		// console.log('[rpMediaImgurCtrl] url: ' + $scope.url);
		// console.log('[rpMediaImgurCtrl] groups: ' + groups);

		if (groups) {
			$scope.thumbnailUrl = "http://i.imgur.com/" + groups[1] + 't.jpg';

			if ($scope.imgurType === 'image') {
				$scope.imageUrl = groups[1] ? 'http://i.imgur.com/' + groups[1] + extension : $scope.url;
			} else if ($scope.imgurType === 'video') {
				
				$scope.webmUrl = 'http://i.imgur.com/' + groups[1] + '.webm';
				$scope.mp4Url = 'http://i.imgur.com/' + groups[1] + '.mp4';
			}

		}
 
		$scope.showGif = false;

		$scope.show = function() {
			$scope.showGif = true;
		};

		$scope.hide = function() {
			$scope.showGif = false;
		};				


	} 
]);

/*
	Imgur Album Info
 */
redditPlusControllers.controller('rpMediaImgurAlbumCtrl', ['$scope', '$log', '$routeParams', 'imgurAlbumService', 'imgurGalleryService',
	function($scope, $log, $routeParams, imgurAlbumService, imgurGalleryService) {
	
	var imageIndex = 0;
	var selectedImageId = "";
	$scope.currentImage = 0;
	$scope.currentImageUrl = "";
	$scope.imageDescription = "";
	$scope.imageTitle = "";

	// var url = $scope.post.data.url;

	var imgurAlbumRe = /^https?:\/\/(?:i\.|m\.)?imgur\.com\/(?:a|gallery)\/([\w]+)(\..+)?(?:\/)?(?:#?\w*)?(?:\?\_[\w]+\=[\w]+)?$/i;

	var groups = imgurAlbumRe.exec($scope.url);

	var id = groups[1];

	//START SETTINGS ALBUM INFO.

	//some albums are just a comma separated list of images
	if (id.indexOf(',') > 0) { //implicit album (comma seperated list of image ids)

		var images = [];
		var imageIds = id.split(',');
		imageIds.forEach(function(value, i){
		images.push({"link" : "http://i.imgur.com/" + value + ".jpg"});
		});

		$scope.album = {
		"data" : {
			"images_count": imageIds.length,
			"images": images
		}
		};
		setCurrentImage();
	}


	//Not an Album but a Gallery. Use the Gallery Service.
	else {

		if ($scope.url.indexOf('/gallery/') > 0) {
			// imgurGalleryAlbumService.query({id: id}, function(data){
			imgurGalleryService.query({id: id}, function(gallery) {

				if (gallery.data.is_album) {
					$scope.album = gallery;

					if (selectedImageId) {
						imageIndex = findImageById(selectedImageId, $scope.album.data.images);
					}

					setCurrentImage();

				} else {
					// $log.log('Gallery Image: ' + id);

					var images = [];
					images[0] = {
						"link": gallery.data.link
					};

					$scope.album = {
						"data" : {
							"images_count": 1,
							"images": images
						}
					};

					setCurrentImage();

				}

			}, function(error) {
				$log.log('Error retrieving Gallery data, ' + id);
				$log.log(error);
			});
		}

		//An actual Album! use the album service.
		else {
			imgurAlbumService.query({id: id}, function(album) {
				$scope.album = album;

				if(selectedImageId) {
					imageIndex = findImageById(selectedImageId, $scope.album.data.images);
				}

				setCurrentImage();
				}, function(error) {
					var images = [];
					images[0] = {
					"link": 'http://i.imgur.com/' + id + '.jpg'
					};

					$scope.album = {
					"data" : {
						"images_count": 1,
						"images": images
					}
				};
			
				setCurrentImage();
				
			});
		}
	}

	$scope.prev = function(n) {
		$scope.$emit('album_image_change');
		if(--imageIndex < 0)
		imageIndex = n-1;
		setCurrentImage();
	};

	$scope.next = function(n) {
		$scope.$emit('album_image_change');
		if(++imageIndex == n)
		imageIndex = 0;
		setCurrentImage();
	};

	function setCurrentImage() {
		$scope.currentImageUrl = $scope.album.data.images[imageIndex].link;
		$scope.imageDescription = $scope.album.data.images[imageIndex].description;
		$scope.imageTitle = $scope.album.data.images[imageIndex].title;
		$scope.currentImage = imageIndex+1;
	}

	function findImageById(id, images) {
		for (var i = 0; i < images.length; i++) {
			if (images[i].id == id) {
				return i;
			}
		}
	}

	}
]);

/*
	Progress bar controller.
	based on https://github.com/chieffancypants/angular-loading-bar
	need to adjust increment numbers, loading bar can finish then jump back when refreshing.
 */
redditPlusControllers.controller('progressCtrl', ['$scope', '$rootScope', '$log', '$timeout',

	function($scope, $rootScope, $log, $timeout){

			$scope.loading = false;

			$rootScope.$on('progressLoading', function(e, d){
				// $log.log('progressLoading');
				$scope.loading = true;
			});

			$rootScope.$on('progressComplete', function(e,d){
				// $log.log('progressComplete');
					 $scope.loading = false;
			});
		}

]);

/*
	Post Media Controller
	controls revealing an embedded video
 */
redditPlusControllers.controller('embedCtrl', ['$scope', '$log',
	function($scope, $log) {

	$scope.post.showEmbed = false;

	$scope.show = function() {
		$scope.post.showEmbed = true;
	};

	$scope.hide = function() {
		$scope.post.showEmbed = false;
	};

	}
]);

/*
	Post Media Controller
	controls revealing a video
 */
redditPlusControllers.controller('videoCtrl', ['$scope', '$log',
	function($scope, $log) {

	$scope.post.showVideo = false;

	$scope.show = function() {
		$scope.post.showVideo = true;
	};

	$scope.hide = function() {
		$scope.post.showVideo = false;
	};

	}
]);



// redditPlusControllers.controller('progressCtrl', ['$scope', '$rootScope', '$log', '$timeout',
//   function($scope, $rootScope, $log, $timeout){
// 	$scope.value = 0.2;
// 	$scope.loading = true;
// 	var incTimeout = 0;
//
// 	$rootScope.$on('progressLoading', function(e, d){
// 	  // $log.log('progressLoading');
// 	  $scope.loading = true;
// 	  set(20);
// 	});
// 	$rootScope.$on('progressComplete', function(e,d){
// 	  // $log.log('progressComplete');
// 	  set(100);
// 	  $timeout(function(){
// 		$scope.loading = false;
// 	  }, 600);
// 	});
// 	$rootScope.$on('progress', function(e, d){
// 	  // $log.log('progress: ' + d.value);
// 	  set(d.value);
// 	});
//
// 	function set(n) {
// 	  if ($scope.loading === false) return;
// 	  $scope.value = n;
//
// 	  $timeout.cancel(incTimeout);
// 	  incTimeout = $timeout(function(){
// 		inc();
// 	  }, 750);
// 	}
//
//
// 	function inc() {
// 	  var rnd = 0;
// 		// TODO: do this mathmatically instead of through conditions
// 		var stat = $scope.value/100;
// 		if (stat >= 0 && stat < 0.25) {
// 		  // Start out between 3 - 6% increments
// 		  rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
// 		} else if (stat >= 0.25 && stat < 0.65) {
// 		  // increment between 0 - 3%
// 		  rnd = (Math.random() * 3) / 100;
// 		} else if (stat >= 0.65 && stat < 0.9) {
// 		  // increment between 0 - 2%
// 		  rnd = (Math.random() * 2) / 100;
// 		} else if (stat >= 0.9 && stat < 0.99) {
// 		  // finally, increment it .5 %
// 		  rnd = 0.005;
// 		} else {
// 		  // after 99%, don't increment:
// 		  rnd = 0;
// 		}
// 		// $log.log("RANDOM INC: " + rnd*1000);
// 		$scope.value += rnd*500;
// 	}
//   }
// ]);
