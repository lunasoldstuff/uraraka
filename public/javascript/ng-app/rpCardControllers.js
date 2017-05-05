'use strict';

var rpCardControllers = angular.module('rpCardControllers', []);

/*
    controller of the card container.
    absolutely postions card and recycles card elements adding and removing
    them from the DOM on the fly as the user scrolls
 */
rpCardControllers.controller('rpCardContainerCtrl', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$window',
	'$q',
	function (
		$scope,
		$rootScope,
		$timeout,
		$window,
		$q
	) {
		//the space between cards
		var cardMargin = 20;

		//the space between columns
		var columnGutter = 15;

		var columnWidth = 350;

		//size of the top buffer
		var bottomBufferSize = 1000;

		//size of the bottom buffer
		var topBufferSize = 1000;

		//pool of card elements to reuse.
		var pool = [];

		//current post
		//our currest position in the posts array
		var currentPostIndex = 0;

		//Queue of posts that have been removed and need to be readded
		var removedPostsIndex = [];

		/*
			HELPER FUNCTIONS
		 */

		//returns the scroll of the card container
		function getContainerScrollPosition() {
			return angular.element('rp-card-container').scrollTop();
		}
		//returns the Y offset of the top buffer
		function getTopBufferPosition() {
			return getContainerScrollPosition() - topBufferSize;
		}
		//returns the Y offset of the bottom buffer
		function getBottomBufferPosition() {
			var windowHeight = angular.element($window).height();
			var scrollPosition = getContainerScrollPosition();
			console.log('[rpCardContainerCtrl] getBottomBufferPosition(), scrollPosition: ' + scrollPosition);
			console.log('[rpCardContainerCtrl] getBottomBufferPosition(), windowHeight: ' + windowHeight);
			return parseInt(scrollPosition) + parseInt(windowHeight) + bottomBufferSize;
		}

		/*
			INIT
		 */

		//listen for rp column resize event
		//reset the cards in the ui
		var deregisterWindowResize = $rootScope.$on('rp_window_resize', function (e, cols) {
			console.log('[rpCardContainerCtrl] rp_window_resize, cols: ' + cols);
			$scope.initColumns(cols);

		});

		//watch the posts scope variable for changes (new posts loaded in rpPostsCtrl)
		var unWatchPosts = $scope.$watch(function (scope) {
			return scope.posts;
		}, function (newVal, oldVal) {
			console.log('[rpCardContainerCtrl] watch, newVal.length: ' + newVal.length);
			console.log('[rpCardContainerCtrl] watch, oldVal.length: ' + oldVal.length);

			//if the length of the array has changed call fill()
			if (newVal.length !== oldVal.length) {
				fill();
			}

		});

		this.cardChangedHeight = function (card, height) {
			console.log('[rpCardContainerCtrl] card changed height');
			// columns[card.columnIndex][card.cardIndex].setHeight(height);
		};

		//the current position of the visible area
		// this.top;

		//fills the visible space and bottom buffer with cards
		function fill() {
			console.log('[rpCardContainerCtrl] fill()');

			var addCardQueue = $q.when();
			var addCard;

			//ccontinously add cards if we have space to add cards
			while (
				angular.element($scope.getShortestColumn).height() < getBottomBufferPosition() &&
				currentPostIndex < $scope.posts.length
			) {

				if (!isDuplicate(currentPostIndex)) {
					//TODO attempt tp reuse cards first
					// $scope.addCard(currentPostIndex);
					addCard = angular.bind(null, $scope.addCard, currentPostIndex);
					addCardQueue = addCardQueue.then(addCard);
				}

				currentPostIndex++;

			}
		}

		function isDuplicate(postIndex) {
			// console.log('[rpCardContainerCtrl] $scope.posts.length: ' + $scope.posts.length);
			// console.log('[rpCardContainerCtrl] postIndex: ' + postIndex);
			// console.log('[rpCardContainerCtrl] currentPostIndex: ' + currentPostIndex);

			var isDuplicate = false;
			for (var i = 0; i < currentPostIndex; i++) {
				if ($scope.posts[postIndex].data.id ===
					$scope.posts[currentPostIndex].id) {
					isDuplicate = true;
					break;
				}
			}
			return isDuplicate;
		}

		//TODO next step, getting the position of the card set correctly by rpCard link function

		//restores cards in the top buffer that were removed
		function restore() {
			//check if space between the top of the highest post in each column
			//and the buffer is greater than the height of the previous post.
			//if it is add the previous card to the ui again.

			//take a card element from the pool or create one
			//attach it to the ui in it's previous saved position

		}

		//removes cards from the top buffer
		function removeTop() {
			//check the top cards in each column
			//when position of card is above the top buffer remove it
			//remove the card from the ui and add it to the pool
			//do not remove the card from the column/card structure

		}

		//removes cards from the bottom buffer
		function removeBottom() {
			//check if the column height is below the bottom buffer for each column
			//if it is, remove the bottom card from the ui add the element to the pool.
			//also remove it from the column card structure
			//push the post back onto $scope.posts so that it is next in line to be added.
			//
		}

		//handles the scroll event
		function handleScroll() {

			//update the scroll position of the viewport,
			//update the buffer positions


			//detect if we are scrolling up or down
			//if scrolling up call removeBottom and restore
			//if scrolling down call removeTop and fill

		}

		//caculates positions of all cards
		function calculatePositions() {

		}

		//calculates positions for cards in specified column only
		//optionally only recaculates for cards below specified index
		function calculateColumnPositions(column, i) {

		}



		// //column object
		// function Column(index) {
		//
		// 	//index of column
		// 	this.index = index;
		//
		// 	//current height of the column
		// 	this.height = 0;
		//
		// 	//cards in the column
		// 	this.cards = [];
		//
		// 	//index of the top visible card in the column
		// 	this.topCard = 0;
		//
		// 	this.left = index * columnWidth + columnGutter;
		//
		// 	this.getHeight = function() {
		// 		return this.height;
		// 	};
		//
		// 	//checks if the specified card is contained in the column
		// 	this.hasPost = function(postIndex) {
		//
		// 	};
		//
		// 	this.updateCardHeight = function(cardIndex, height) {
		// 		//update the height of the card
		// 		this.cards[cardIndex].updateHeight(height);
		//
		// 		//recalculate height of the column
		// 		this.calculateHeight();
		//
		// 		//recalculate card positions
		//
		// 	};
		//
		// 	//recaculate the height of the column
		// 	this.calculateHeight = function() {
		// 		console.log('[rpCardContainer] column.calculateHeight()');
		//
		// 		var height = 0;
		//
		// 		//iterate through the cards adding up thier heights + margin between them
		// 		for (var i = 0; i < this.cards.length; i++) {
		// 			height += this.cards[i].getHeight() + cardMargin;
		// 		}
		//
		// 		this.height = height;
		// 		return height;
		//
		// 	};
		//
		// 	//adds card from the column
		// 	this.addCard = function(post) {
		//
		// 		var position = {
		// 			top: this.height + cardMargin,
		// 			left: this.left
		// 		};
		//
		// 		var card = new Card(post, position);
		//
		// 	};
		//
		// 	//removes card from the column
		// 	this.removeCard = function() {
		//
		// 	};
		//
		// 	//returns the position of the top card
		// 	this.topCardPostition = function() {
		//
		// 	};
		//
		// }
		//
		// //the card object
		// function Card(postIndex, position) {
		//
		// 	this.postIndex = postIndex;
		//
		// 	this.position = position;
		//
		// 	this.height = 0;
		//
		// 	this.getHeight = function() {
		// 		return this.height;
		// 	};
		//
		// 	this.setHeight = function(height) {
		// 		this.height = height;
		// 	};
		//
		// }

		$scope.$on('$destroy', function () {
			deregisterWindowResize();
			unWatchPosts();
		});

	}
]);

rpCardControllers.controller('rpCardColumnCtrl', [
	'$scope',
	function (
		$scope
	) {

	}
]);

// rpCardControllers.controller('rpCardCtrl', [
// 	'$scope',
// 	function(
// 		$scope
// 	) {
// 		console.log('[rpCardCtrl]');
//
// 	}
// ]);
