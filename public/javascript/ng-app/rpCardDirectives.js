'use strict';

var rpCardDirectives = angular.module('rpCardDirectives', []);

rpCardDirectives.directive('rpCardContainer', [
	'$compile',
	'$timeout',
	function (
		$compile,
		$timeout
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

				// $timeout(function () {
				// 	scope.organizeCards();
				// }, 10000);

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
				var top;
				var column = attributes.column;
				var previousCard = element.prevAll('.rp-card-col-' + column + ':first');

				top = parseInt(angular.element(previousCard).height()) + parseInt(angular.element(previousCard).css('top'));

				console.log('[rpCard] top: ' + top);

				element.css('top', top);

				$rootScope.$emit('rp_card_added');
				// rpCardContainerCtrl.addNextCard();

				//rpCard watches it's own height and informs rpCardContainer
				scope.$watch(function () {
					return element.height();
				}, function (height) {
					// rpCardContainer.cardChangedHeight(scope.card, height);
					//Notify the Column instead of the Container

				});

			}
		};
	}
]);
