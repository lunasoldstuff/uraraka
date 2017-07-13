(function () {
	console.log('[resize-images]');
	interact('.resize-drag')
		// .draggable({
		// 	onmove: window.dragMoveListener
		// })
		.resizable({
			allowFrom: '[drag-handle]',
			preserveAspectRatio: true,
			// edges: { left: true, right: true, bottom: true, top: true }
			edges: { bottom: '*', right: '*' }
		})
		.on('resizestart', function (event) {
			var target = event.target;

			var width = window.getComputedStyle(target).getPropertyValue('width');
			console.log('[resize-images] resizestart width: ' + width);

			if (!target.getAttribute('data-originalWidth')) {
				target.setAttribute('data-originalWidth', width);
			}

			console.log('[resize-images] resizestart targetgetAttribute("data-originalWidth"): ' + target.getAttribute('data-originalWidth'));

		})
		.on('resizemove', function (event) {

			var target = event.target,
				x = (parseFloat(target.getAttribute('data-x')) || 0),
				y = (parseFloat(target.getAttribute('data-y')) || 0);

			//unset the maxwidth
			target.style.maxWidth = 'none';
			target.style.zIndex = 1;


			// var originalWidth = parseInt(target.style.width);
			// target.style.orginalWidth = originalWidth

			// update the element's style
			target.style.width = event.rect.width + 'px';
			target.style.height = event.rect.height + 'px';


			var width = parseFloat(target.style.width);
			var originalWidth = parseFloat(target.getAttribute('data-originalWidth'));
			// var originalWidth = parseFloat(target.originalWidth);
			// var originalWidth = parseFloat(target.style.originalWidth);
			var changeX, translateX;

			// console.log('[resize-images] resizemove originalWidth: ' + originalWidth + ', width: ' + width);

			if (width > originalWidth) {

				changeX = originalWidth - width;
				translateX = changeX / 2;

				// console.log('[resize-images] resizemove changeX: ' + changeX + ', translateX: ' + translateX);

				target.style.webkitTransform = target.style.transform =
					'translate(' + translateX + 'px,' + 0 + 'px)';

			}






			// console.log('[resize-images] target.style.webkitTransform: ' + target.style.webkitTransform);

			// if (changeX < 0) {
			// 	var translateX = parseInt(targe.style.webkitTransform);

			// 	if (!translateX) {
			// 		target.style.webkitTransform = target.style.transform =
			// 			'translateX(' + changeX + 'px)';

			// 	} else {
			// 		changeX = changeX + translateX;
			// 		target.style.webkitTransform = target.style.transform =
			// 			'translateX(' + changeX + 'px)';
			// 	}


			// }


			// translate when resizing from top or left edges
			// x += event.deltaRect.left;
			// y += event.deltaRect.top;

			// x += event.deltaRect.left;
			// y += event.deltaRect.top;

			// target.style.webkitTransform = target.style.transform =
			// 'translate(' + x + 'px,' + y + 'px)';


			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
			target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
		});

})();