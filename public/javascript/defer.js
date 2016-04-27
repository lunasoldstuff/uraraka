/*
    Defer loading scripts until after page load.
    https://varvy.com/pagespeed/defer-loading-javascript.html
 */

console.log('[defer] load');

// bind to onload event
if (window.addEventListener) {
    window.addEventListener("load", downloadDeferred, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", downloadDeferred);
} else {
    window.onload = downloadDeferred;
}

function downloadDeferred() {

    console.log('[defer] downloadDeferred()');

    /*
        Add scripts src here
     */
    var deferredSrc = [
        "/javascript/twitterWidget.js",
        "/javascript/analytics.js",
        "/javascript/kajamba.js"
    ];

    // add script elements to DOM here
    for (var i = 0; i < deferredSrc.length; i++) {
        var element = document.createElement('script');
        element.src = deferredSrc[i];
        document.body.appendChild(element);
    }


}