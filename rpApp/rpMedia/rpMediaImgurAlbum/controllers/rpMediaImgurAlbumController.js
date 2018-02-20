(function() {
	'use strict';
	angular.module('rpMediaImgurAlbum').controller('rpMediaImgurAlbumCtrl', [
		'$scope',
		'$rootScope',
		'$log',
		'$filter',
		'$routeParams',
		'$mdPanel',
		'rpImgurAlbumResourceService',
		'rpImgurGalleryResourceService',
		'rpMediaImgurAlbumPreloaderService',
		rpMediaImgurAlbumCtrl
	]);

	function rpMediaImgurAlbumCtrl(
		$scope,
		$rootScope,
		$log,
		$filter,
		$routeParams,
		$mdPanel,
		rpImgurAlbumResourceService,
		rpImgurGalleryResourceService,
		rpMediaImgurAlbumPreloaderService
	) {

		var imageIndex = 0;
		var selectedImageId = "";
		var imagesToPreload = 2;
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
					"link": "https://i.imgur.com/" + value + ".jpg"
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
						"link": 'https://i.imgur.com/' + id + '.jpg'
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

		$scope.prev = function() {
			var n = $scope.album.data.images_count;
			$scope.$emit('rp_album_image_changed');
			if (--imageIndex < 0)
				imageIndex = n - 1;
			setCurrentImage();
		};

		$scope.next = function() {
			var n = $scope.album.data.images_count;
			console.log('[rpMediaImgurAlbumCtrl] next()');
			$scope.$emit('rp_album_image_changed');
			if (++imageIndex == n) {
				imageIndex = 0;

			} else {
				preloadImages($scope.album.data.images.slice(imageIndex + imagesToPreload - 1, imageIndex + imagesToPreload));

			}
			console.log('[rpMediaImgurAlbumCtrl] next(), imageIndex: ' + imageIndex);
			setCurrentImage();
		};

		function setCurrentImage() {
			console.log('[rpMediaImgurAlbumCtrl] setCurrentImage()');
			$scope.currentImageUrl = $scope.album.data.images[imageIndex].link;
			$scope.imageDescription = $scope.album.data.images[imageIndex].description;
			$scope.imageDescriptionLinky = $filter('linky')($scope.album.data.images[imageIndex].description, '_blank');
			$scope.imageTitle = $scope.album.data.images[imageIndex].title;
			$scope.currentImage = imageIndex + 1;
			$rootScope.$broadcast('rp_media_album_image_changed', $scope.currentImageUrl, $scope.imageTitle, $scope.imageDescriptionLinky);
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

					imageLocations.push($filter('rpMediaHttpsFilter')(image.link));

				});

				console.log('[rpMediaImgurAlbumCtrl] preloadImages, imageLocations: ' + imageLocations);

				rpMediaImgurAlbumPreloaderService.preloadImages(imageLocations).then(

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


		var position = $mdPanel.newPanelPosition().absolute().center();
		var mdPanelRef;
		var thisController = this;

		$scope.openImagePanel = function() {
			if (!$scope.slideshow) {

				mdPanelRef = $mdPanel.open({
					attachTo: angular.element(document.body),
					controller: 'rpMediaImagePanelAlbumCtrl',
					disableParentScroll: this.disableParentScroll,
					templateUrl: 'rpMedia/rpMediaImagePanel/views/rpMediaImagePanelAlbum.html',
					hasBackdrop: true,
					position: position,
					trapFocus: true,
					zIndex: 150,
					clickOutsideToClose: true,
					escapeToClose: true,
					focusOnOpen: true,
					panelClass: 'rp-media-image-panel-album',
					locals: {
						imageUrl: $scope.currentImageUrl,
						imageTitle: $scope.imageTitle,
						imageDescriptionLinky: $scope.imageDescriptionLinky,
						albumCtrl: thisController
					}
				});
			}

		};

		$scope.close = function(e) {
			console.log('[rpMediaImagePanelCtrl] close()');

			mdPanelRef.close().then(function() {
				mdPanelRef.destroy();
			});
		};

		this.next = function() {
			console.log('[rpMediaImgurAlbumCtrl] next()');
			$scope.next();
		};

		this.prev = function() {
			console.log('[rpMediaImgurAlbumCtrl] prev()');
			$scope.prev();
		};
	}

})();