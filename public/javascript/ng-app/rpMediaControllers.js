var rpMediaControllers = angular.module('rpMediaControllers', []);

rpMediaControllers.controller('rpMediaCtrl', ['$scope', '$timeout', 'rpSettingsUtilService',
	function($scope, $timeout, rpSettingsUtilService) {

		if ($scope.post) {

			if ($scope.post.data.title.toLowerCase().indexOf('nsfw') > 0) {
				$scope.showWarning = true;
				$scope.warningText = "nsfw";
			}

			if ($scope.post.data.title.toLowerCase().indexOf('nsfl') > 0) {
				$scope.showWarning = true;
				$scope.warningText = "nsfl";
			}

			if ($scope.post.data.title.toLowerCase().indexOf('gore') > 0) {
				$scope.showWarning = true;
				$scope.warningText = "gore";
			}

			if (!$scope.warningText && $scope.post.data.link_flair_text) {
				$scope.warningText = $scope.post.data.link_flair_text;
			}

			if ($scope.post.data.over_18) {
				$scope.showWarning = true;

				$scope.showWarning = rpSettingsUtilService.settings.over18;

				if (!$scope.warningText)
					$scope.warningText = "over 18";
			}

		}

		$scope.showMedia = function() {
			$scope.showWarning = false;
			// $timeout(function() {
			// 	$scope.$emit('angular_masonry_directive_update');
			// }, 2000);

		};

	}
]);

rpMediaControllers.controller('rpMediaDefaultCtrl', ['$scope', '$timeout',
	function($scope, $timeout) {

		if (
			$scope.url.substr($scope.url.length - 4) === '.jpg' || $scope.url.substr($scope.url.length - 5) === '.jpeg' ||
			$scope.url.substr($scope.url.length - 4) === '.png' || $scope.url.substr($scope.url.length - 4) === '.bmp'
		) {
			$scope.playable = false;
			$scope.imageUrl = $scope.url;

		} else if ($scope.url.substr($scope.url.length - 4) === '.gif' || $scope.url.length - 5 === '.gifv') {
			$scope.defaultType = 'gif';
			$scope.gifUrl = $scope.url;
			$scope.playable = true;
		} else if ($scope.url.substr($scope.url.length - 5) === '.webm') {
			$scope.defaultType = 'video';
			$scope.webmUrl = $scope.url;
			$scope.playable = true;
		} else if ($scope.url.substr($scope.url.length - 4) === '.mp4') {
			$scope.defaultType = 'video';
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

			} else if ($scope.post.data.thumbnail) {

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
			// $timeout(function() {
			// 	$scope.$emit('angular_masonry_directive_update');
			// }, 2000);
		};

		$scope.hide = function() {
			$scope.showPlayable = false;
			// $timeout(function() {
			// 	$scope.$emit('angular_masonry_directive_update');
			// }, 2000);
		};

	}
]);

rpMediaControllers.controller('rpMediaGiphyCtrl', ['$scope',
	function($scope) {

		var giphyRe = /^http:\/\/(?:www\.)?giphy\.com\/gifs\/(.*?)(\/html5)?$/i;
		var giphyAltRe = /^http:\/\/(?:www\.)?(?:i\.)?giphy\.com\/([\w]+)(?:.gif)?/i;
		var giphyAlt2Re = /^https?:\/\/(?:www\.)?(?:media[0-9]?\.)?(?:i\.)?giphy\.com\/(?:media\/)?([\w]+)(?:.gif)?/i;
		var groups;

		if (giphyRe.test($scope.url)) {
			groups = giphyRe.exec($scope.url);
		} else if (giphyAltRe.test($scope.url)) {
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

rpMediaControllers.controller('rpMediaGfycatCtrl', ['$scope',
	function($scope) {

		var gfycatRe = /(^https?:\/\/[\w]?\.?)?gfycat\.com\/(\w+)(\.gif)?/i;
		var groups = gfycatRe.exec($scope.url);

		// console.log('[rpMediaGfycatCtrl] url: ' + $scope.url);
		// console.log('[rpMediaGfycatCtrl] groups[1]: ' + groups[1]);
		// console.log('[rpMediaGfycatCtrl] groups[2]: ' + groups[2]);
		// console.log('[rpMediaGfycatCtrl] groups[3]: ' + groups[3]);


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

		// console.log('[rpMediaGfycatCtrl] prefix: ' + prefix);


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

rpMediaControllers.controller('rpMediaTwitterCtrl', ['$scope', '$sce', 'rpTweetResourceService',
	function($scope, $sce, rpTweetResourceService) {

		$scope.tweet = "";
		var twitterRe = /^https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?[\w]+\/status(?:es)?\/([\d]+)/i;
		var groups = twitterRe.exec($scope.url);

		if (groups) {
			var data = rpTweetResourceService.get({
				id: groups[1]
			}, function(data) {
				$scope.tweet = $sce.trustAsHtml(data.html);
			});
		}

	}
]);

/*
	Youtube Video
 */
rpMediaControllers.controller('rpMediaYoutubeCtrl', ['$scope', '$sce', '$filter',
	function($scope, $sce, $filter) {

		var youtubeRe = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?.*v=([\w\-]+)/i;
		var youtubeAltRe = /^https?:\/\/(?:www\.)?youtu\.be\/([\w\-]+)(\?t=[\w]+)?/i;
		var youtubeTimestampRe = /\?t\=[\w+]+/i;

		var groups;
		groups = youtubeRe.exec($scope.url);
		if (!groups) groups = youtubeAltRe.exec($scope.url);

		if (groups) {

			console.log('[rpMediaYoutubeCtrl] groups: ' + groups);

			$scope.thumbnailUrl = 'https://img.youtube.com/vi/' + groups[1] + '/default.jpg';

			var embedUrl = 'http://www.youtube.com/embed/' + groups[1] + '?autoplay=1';

			if (groups[2]) {
				if (youtubeTimestampRe.test(groups[2])) {
					console.log('[rpMediaYoutubeCtrl] groups[2]: ' + groups[2]);
					var time = $filter('rp_youtube_time_to_seconds')(groups[2].replace('?t=', ''));
					embedUrl += '&start=' + time;
				}
			}

			console.log('[rpMediaYoutubeCtrl] embedUrl: ' + embedUrl);

			$scope.embedUrl = $sce.trustAsResourceUrl(embedUrl);

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
rpMediaControllers.controller('rpMediaImgurCtrl', ['$scope',
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
rpMediaControllers.controller('rpMediaImgurAlbumCtrl', ['$scope', '$log', '$filter', '$routeParams', 'rpImgurAlbumResourceService', 'rpImgurGalleryResourceService', 'rpImgurPreloaderUtilService',
	function($scope, $log, $filter, $routeParams, rpImgurAlbumResourceService, rpImgurGalleryResourceService, rpImgurPreloaderUtilService) {

		var imageIndex = 0;
		var selectedImageId = "";
		var imagesToPreload = 3;
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

			console.log('[rpMediaImgurAlbumCtrl] implicit album');

			var images = [];
			var imageIds = id.split(',');
			imageIds.forEach(function(value, i) {
				images.push({
					"link": "http://i.imgur.com/" + value + ".jpg"
				});
			});

			$scope.album = {

				"data": {
					"images_count": imageIds.length,
					"images": images
				}

			};

			setCurrentImage();
			preloadImages($scope.album.data.images.slice(1, imagesToPreload));

		}


		//Not an Album but a Gallery. Use the Gallery Service.
		else {

			if ($scope.url.indexOf('/gallery/') > 0) {
				console.log('[rpMediaImgurAlbumCtrl] gallery');
				// imgurGalleryAlbumService.query({id: id}, function(data){
				rpImgurGalleryResourceService.get({
					id: id
				}, function(gallery) {

					if (gallery.data.is_album) {
						$scope.album = gallery;

						if (selectedImageId) {
							imageIndex = findImageById(selectedImageId, $scope.album.data.images);
						}

						setCurrentImage();
						preloadImages($scope.album.data.images.slice(1, imagesToPreload));


					} else {
						// $log.log('Gallery Image: ' + id);

						var images = [];
						images[0] = {
							"link": gallery.data.link
						};

						$scope.album = {
							"data": {
								"images_count": 1,
								"images": images
							}
						};

						setCurrentImage();
						preloadImages($scope.album.data.images.slice(1, imagesToPreload));

					}

				}, function(error) {
					$log.log('Error retrieving Gallery data, ' + id);
					$log.log(error);
				});
			}

			//An actual Album! use the album service.
			else {
				console.log('[rpMediaImgurAlbumCtrl] album');
				rpImgurAlbumResourceService.get({
					id: id
				}, function(album) {
					$scope.album = album;

					if (selectedImageId) {
						imageIndex = findImageById(selectedImageId, $scope.album.data.images);
					}

					setCurrentImage();
					preloadImages($scope.album.data.images.slice(1, imagesToPreload));


				}, function(error) {
					var images = [];
					images[0] = {
						"link": 'http://i.imgur.com/' + id + '.jpg'
					};

					$scope.album = {
						"data": {
							"images_count": 1,
							"images": images
						}
					};

					setCurrentImage();
					preloadImages($scope.album.data.images.slice(1, imagesToPreload));


				});
			}
		}

		$scope.prev = function(n) {
			$scope.$emit('album_image_change');
			if (--imageIndex < 0)
				imageIndex = n - 1;
			setCurrentImage();
		};

		$scope.next = function(n) {
			console.log('[rpMediaImgurAlbumCtrl] next()');
			$scope.$emit('album_image_change');
			if (++imageIndex == n)
				imageIndex = 0;
			console.log('[rpMediaImgurAlbumCtrl] next(), imageIndex: ' + imageIndex);
			preloadImages($scope.album.data.images.slice(imageIndex + imagesToPreload - 1, imageIndex + imagesToPreload));
			setCurrentImage();
		};

		function setCurrentImage() {
			console.log('[rpMediaImgurAlbumCtrl] setCurrentImage()');
			$scope.currentImageUrl = $scope.album.data.images[imageIndex].link;
			$scope.imageDescription = $scope.album.data.images[imageIndex].description;
			$scope.imageDescriptionLinky = $filter('linky')($scope.album.data.images[imageIndex].description, '_blank');
			$scope.imageTitle = $scope.album.data.images[imageIndex].title;
			$scope.currentImage = imageIndex + 1;
		}

		function findImageById(id, images) {
			for (var i = 0; i < images.length; i++) {
				if (images[i].id == id) {
					return i;
				}
			}
		}

		function preloadImages(images) {

			if (images && images !== 'undefined') {

				console.log('[rpMediaImgurAlbumCtrl] preloadImages, images: ' + images);

				var imageLocations = [];

				images.forEach(function(image, i) {

					imageLocations.push(image.link);

				});

				console.log('[rpMediaImgurAlbumCtrl] preloadImages, imageLocations: ' + imageLocations);

				rpImgurPreloaderUtilService.preloadImages(imageLocations).then(

					function handleResolve(imageLocations) {

						console.log('[rpMediaImgurAlbumCtrl] handleResolve, images load successful.');

					},
					function handleReject(imageLocations) {

						console.log('[rpMediaImgurAlbumCtrl] handleReject, images load failed.');

					},
					function handleNotify(imageLocations) {

						// console.log('[rpMediaImgurAlbumCtrl] handleNotify, images load percent: ' + event.percent);

					}

				);

			}
		}
	}
]);