'use strict';

var rpCardDirectives = angular.module('rpCardDirectives', []);

rpCardDirectives.directive('rpCardContainer', [
	'$rootScope',
	'$timeout',
	'$compile',
	function (
		$rootScope,
		$timeout,
		$compile
	) {
		return {
			restrict: 'E',
			controller: 'rpCardContainerCtrl',
			reuqire: '^^rpPostsCtrl',
			scope: {
				posts: '=',
				identity: '=',
				showSub: '='
			},
			link: function (scope, element, attributes, rpPostsCtrl) {

				scope.organizeCards = function () {
					console.log('[rpCardContainer] organizeCards()');

					var cards = angular.element('rp-card');
					var shortestColumn;


					cards.each(function (i, card) {
						//put the cards in the shortest column
						shortestColumn = scope.getShortestColumn();

						angular.element(card).removeClass(function (index, className) {
							return (className.match(/\brp-card-col-\S+/g || []).join(' '));
						});

						angular.element(card).addClass('rp-card-col-' + shortestColumn);

						//now we have to set top to give them the right position.

					});

					// for (var i = 0; i < cards.length; i++) {

					// 	angular.element(cards).removeClass(function (index, className) {
					// 		return (className.match(/\brp-card-col-\S+/g || []).join(' '));
					// 	});


					// }

				};

				var positioningCards = false;

				$rootScope.$on('rp_card_height', function (e, column) {
					console.log('[rpCardContainer] rp_card_height: ' + column);
					// if (!positioningCards) {
					// positioningCards = true;

					$timeout(function () {
						positionCards(column);

					}, 1000);
					// }

				});

				function positionCards(column) {
					var top;
					var prevHeight;
					var prevTop;

					var cards = angular.element('rp-card.rp-card-col-' + column);
					console.log('[rpCardContainer] positionCards(), cards.length: ' + cards.length);

					for (var i = 0; i < cards.length; i++) {

						if (i === 0) {
							angular.element(cards[i]).css('top', 0);

						} else {
							prevHeight = parseInt(angular.element(cards[i - 1]).height());
							prevTop = parseInt(angular.element(cards[i - 1]).css('top'));

							top = prevHeight + prevTop;

							angular.element(cards[i]).css('top', top + 'px');

						}
					}

					positioningCards = false;
				}

				scope.addCard = function (postIndex) {
					// var shortestColumn = 1;
					var shortestColumn = scope.getShortestColumn();

					console.log('[rpCardContainer] addCard, postIndex: ' + postIndex);
					console.log('[rpCardContainer] addCard, shortestColumn: ' + shortestColumn);

					angular.element('.rp-card-wrapper')
						.append($compile("<rp-card class=\"rp-card-col-" + shortestColumn + "\" column=\"" + shortestColumn + "\" post=\"posts[" + postIndex + "]\" identity=\"identity\" show-sub=\"showSub\"></rp-card")(scope));

					// .append("<p>asdf</p>");
				};

				scope.getShortestColumn = function () {

					var i;
					var lastElements = [];
					var columnHeights = [];
					var shortestColumn = 0;
					console.log('[rpCardContainer] getShortestColumn(), scope.numColumns: ' + scope.numColumns);




					// var cards = element.find('rp-card');
					// console.log('[rpCardContainer] getShortestColumn(), cards.length: ' + angular.element(cards).length);
					// for (i = 0; i < scope.numColumns; i++) {

					// 	var last;

					// 	last = angular.element(cards).filter('.rp-card-col-' + i).last();

					// 	console.log('[rpCardContainer] getShortestColumn(), last.length: ' + angular.element(last).length);
					// 	console.log('[rpCardContainer] getShortestColumn(), last height: ' + angular.element(last).height());

					// 	if (angular.element(last).length > 0) {

					// 		columnHeights[i] = parseInt(angular.element(last).height()) + parseInt(angular.element(last).css('top'));

					// 		console.log('[rpCardContainer] getShortestColumn(), column ' + i + ' height: ' + columnHeights[i]);
					// 	} else {
					// 		return i;
					// 	}

					// }

					var cards;
					var columnHeight;
					for (i = 0; i < scope.numColumns; i++) {
						columnHeight = 0;

						cards = angular.element('rp-card.rp-card-col-' + i);

						cards.each(function (i, card) {
							columnHeight += parseInt(angular.element(card).height());
						});

						console.log('[rpCardContainer] getShortestColumn(), column ' + i + ' height : ' + columnHeight);
						columnHeights[i] = columnHeight;
					}


					for (i = 0; i < columnHeights.length; i++) {
						if (columnHeights[i] < columnHeights[shortestColumn]) {
							shortestColumn = i;
						}
					}
					console.log('[rpCardContainer] getShortestColumn(), shortestColumn height: ' + columnHeights[shortestColumn]);

					return shortestColumn;

				};

				$timeout(function () {
					console.log('[rpCardContainer] shortestColumn timeout: ' + scope.getShortestColumn());
				}, 5000);

				function getCards() {
					return element.find('rp-card');
				}

			}
		};
	}
]);

rpCardDirectives.directive('rpCardColumn', function () {
	return {
		restrict: 'E',
		// require: '^rpCardContainer',
		controller: 'rpCardColumnCtrl',
		link: function (scope, element, attributes, rpCardContainer) {

		}
	};
});

rpCardDirectives.directive('rpCard', [
	'$rootScope',
	'$timeout',
	function (
		$rootScope,
		$timeout
	) {
		return {
			restrict: 'E',
			// require: '^^rpCardContianerCtrl',
			templateUrl: 'rpCard.html',
			scope: {
				post: '=',
				identity: '=',
				showSub: '='
			},
			link: function (scope, element, attributes) {

				console.log('[rpCard] post.data.name: ' + scope.post.data.name);

				//set vertical position
				// var column = attributes.column;
				// var prevTransformY;
				// var prevHeight;
				// var translateY;
				// var translateX;

				// var prev = element.prevAll('.rp-card-col-' + column + ':first');
				// console.log('[rpCard] prev.length: ' + prev.length);

				// if (prev.length > 0) {

				// 	console.log('[rpCard] angular.element(prev).css(\'transform\'): ' + angular.element(prev).css('transform'));
				// 	console.log('[rpCard] angular.element(prev).css(\'transform\'): ' + parseInt(angular.element(prev).css('transform').split(',')[5]));

				// 	prevTransformY = parseInt(angular.element(prev).css('transform').split(',')[5])
				// 	prevHeight = parseInt(angular.element(prev).height());

				// 	console.log('[rpCard] prevTransformY: ' + prevTransformY);
				// 	console.log('[rpCard] prevHeight: ' + prevHeight);

				// 	translateY = prevTransformY + prevHeight;
				// 	translateX = parseInt(angular.element(prev).css('transform').split(',')[4])

				// 	console.log('[rpCard] translateY: ' + translateY);
				// 	console.log('[rpCard] translateX: ' + translateX);


				// 	element.css('transform', 'translateY(' + translateY + 'px) translateX(' + translateX + 'px)');

				// } else {
				// 	translateX = parseInt(element.css('transform').split(',')[4])

				// 	element.css('transform', 'translateY(0px) translateX(' + translateX + 'px)');
				// }





				//set vertical position
				var column = attributes.column;
				var top;
				var prevHeight;
				var prevTop;

				var prev = element.prevAll('.rp-card-col-' + column + ':first');
				console.log('[rpCard] prev.length: ' + prev.length);

				if (prev.length > 0) {

					prevTop = parseInt(angular.element(prev).css('top'));
					prevHeight = parseInt(angular.element(prev).height());

					console.log('[rpCard] top: ' + prevTop);
					console.log('[rpCard] prevHeight: ' + prevHeight);

					top = prevTop + prevHeight;

					console.log('[rpCard] top: ' + top);

					element.css('top', top + 'px');

				} else {
					element.css('top', 0);
				}





				$rootScope.$emit('rp_card_added');
				// rpCardContainerCtrl.addNextCard();

				//rpCard watches it's own height and informs rpCardContainer
				scope.$watch(function () {
					return element.height();
				}, function (height) {
					// rpCardContainer.cardChangedHeight(scope.card, height);
					//Notify the Column instead of the Container
					$rootScope.$emit('rp_card_height', attributes.column);
				});

			}
		};
	}
]);
