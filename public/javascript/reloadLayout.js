jQuery(function(){
	console.log('im alive');
	// $('.rp-loaded').load(function(){
	// 	console.log('rp loaded');
	// 	$('#rp-subreddit-posts').masonry();
	// });
	// 

// 	// $('#rp-content').on('load', function() {
// 	// 	console.log('rp-content');
// 	// });

	$('.rp-laoded').live('load', function(){
		console.log('loaded loaded');
		// $('#rp-subreddit-posts').masonry();
	});

	// $('#rp-content').on('load', '.rp-post', function(){
	// 	console.log('post loaded');
	// 	$('#rp-subreddit-posts').masonry();
	// });

	// $('#rp-content').on('scroll', function(){
	// 	$('#rp-subreddit-posts').masonry();
	// });

});