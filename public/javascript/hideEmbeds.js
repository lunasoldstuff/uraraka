$(function() {

	mediaCheck({
		media: '(max-width: 970px)',
		both: removeHiddenEmbeds,
	});

	mediaCheck({
		media: '(max-width: 1550px)',
		both: removeHiddenEmbeds,
	});

	function removeHiddenEmbeds() {
		$('[class^=rp-posts-col]').each(function(){
			if($(this).css('display') == 'none') {
				$(this).find('.rp-media-embed').each(function(){
					$(this).empty();
					var scope = angular.element($(this)).scope();
					scope.$apply(function(){
						scope.post.showEmbed = false;
					});
				});
			}
		});
	}

});