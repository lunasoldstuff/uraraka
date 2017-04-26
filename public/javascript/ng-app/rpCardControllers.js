'use strict';

var rpCardControllers = angular.module('rpCardControllers', []);

/*
    controller of the card container.
    absolutely postions card and recycles card elements adding and removing
    them from the DOM on the fly as the user scrolls
 */
rpCardControllers.controller('rpCardContainerCtrl', [
	'$scope',
	function(
		$scope
	) {

		//size of the top buffer
		this.bottomBufferSize = 1000;

		//size of the bottom buffer
		this.topBufferSize = 1000;

		//pool of card elements to reuse.
		this.pool = [];

		//holds information about current cards and columns;
		this.columns = [];

		//the next post to be added to the ui
		//alternatively, use $scope.posts as a stack and push posts that have been removed back onto it,
		//remove posts from it.
		//will have to modify adding posts in rpPostCtrl, to make sure they are added at the end
		this.nextPost = $scope.posts[0];


		//the current position of the visible area
		// this.top;

		//fills the visible space and bottom buffer with cards
		this.fill = function() {
			//iterate over posts adding cards to the ui until bottom buffer has been filled
			//check if column heights exceed bottom buffer

			//detect the shortest column

			//take an card element from the pool
			//if no element card element is available create once

			//attach the element to the ui

			//increment the next post
		};

		//restores cards in the top buffer that were removed
		this.restore = function() {
			//check if space between the top of the highest post in each column
			//and the buffer is greater than the height of the previous post.
			//if it is add the previous card to the ui again.

			//take a card element from the pool or create one
			//attach it to the ui in it's previous saved position

		};

		//removes cards from the top buffer
		this.removeTop = function() {
			//check the top cards in each column
			//when position of card is above the top buffer remove it
			//remove the card from the ui and add it to the pool
			//do not remove the card from the column/card structure

		};

		//removes cards from the bottom buffer
		this.removeBottom = function() {
			//check if the column height is below the bottom buffer for each column
			//if it is, remove the bottom card from the ui add the element to the pool.
			//also remove it from the column card structure
			//push the post back onto $scope.posts so that it is next in line to be added.
			//
		};

		//handles the scroll event
		this.handleScroll = function() {

			//update the scroll position of the viewport,
			//update the buffer positions


			//detect if we are scrolling up or down
			//if scrolling up call removeBottom and restore
			//if scrolling down call removeTop and fill

		};

		//caculates positions of all cards
		this.calculatePositions = function() {

		};

		//calculates positions for cards in specified column only
		//optionally only recaculates for cards below specified index
		this.calculateColumnPositions = function(column, i) {

		};

		//init

		//get the window size and determine the number of columns

		//create column objects and store them in this.columnsAndCards
		/*
		    column : {
		        height: current height of the column
		        topCardY: position of the highest card in buffer
		        cards: [] current cards in the column

		    }
		 */

		//call fill() to add cards to the ui.

		//column object
		function Column(index) {

			//index of column
			this.index = index;

			//current height of the column
			this.height = 0;

			//cards in the column
			this.cards = [];

			//index of the top visible card in the column
			this.topCard = 0;

			//recaculate the height of the column
			this.calculateHeight = function() {

			};

			//adds card from the column
			this.addCard = function() {

			};

			//removes card from the column
			this.removeCard = function() {

			};

			//returns the position of the top card
			this.topCardPostition = function() {

			};

		}

		//the card object
		function Card(element) {
			//height
			//position
			//post, index of the post this card contains
		}

	}
]);
