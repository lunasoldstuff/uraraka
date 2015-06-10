jQuery(function(){
    jQuery('#rp-post-time-filter-button').on('click', function(){
        jQuery('#rp-post-time-filter-select').trigger('click');
    });

    jQuery('#rp-user-time-filter-button').on('click', function(){
        jQuery('#rp-user-time-filter-select').trigger('click');
    });
    
    jQuery('#rp-user-sort-button').on('click', function(){
        jQuery('#rp-user-sort-select').trigger('click');
    });
});
