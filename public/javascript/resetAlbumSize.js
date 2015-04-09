$(function() {

	mediaCheck({
		media: '(max-width: 960px)',
		both: resetAlbumSizes,
	});

	mediaCheck({
		media: '(min-width: 1150px)',
		both: resetAlbumSizes,
	});
	mediaCheck({
		media: '(min-width: 1560px)',
		both: resetAlbumSizes,
	});

	function resetAlbumSizes() {
		console.log('resetAlbumSizes');
		$('.rp-imgur-album-image-wrapper').removeAttr('style');
	}


});