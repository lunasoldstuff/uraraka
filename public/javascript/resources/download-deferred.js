function downloadJSAtOnload() {
	var element = document.createElement("script");
	element.src = "/javascript/dist/deferred.min.js";
	setTimeout(function() {
		document.body.appendChild(element);
	}, 5000);
}
if (window.addEventListener)
	window.addEventListener("load", downloadJSAtOnload, false);
else if (window.attachEvent)
	window.attachEvent("onload", downloadJSAtOnload);
else window.onload = downloadJSAtOnload;