var rpReactComponents = angular.module('rpReactComponents', ['react']);

/**
 * PINNED SUBREDDITS
 */

var PinnedSubredditsComponent = React.createClass({displayName: "PinnedSubredditsComponent",

	propTypes: {
		subs: React.PropTypes.array
	},

	render: function() {
		
		var createSubredditItem = function(sub, index) {

			return (
				React.createElement("md-list-item", {class: "rp-sidenav-subreddit-list-item", key: sub.name}, 
					React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 
						React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + sub.url + "')"}, sub.name)
					)
				)

			);	
		};

		return React.createElement("md-list", {className: "rp-sidenav-subreddit-list"}, this.props.subs.map(createSubredditItem));
		
	}

});

// rpReactComponents.value('PinnedSubredditsComponent', PinnedSubredditsComponent);
rpReactComponents.directive('pinnedSubredditsComponent', function(reactDirective) {
	return reactDirective(PinnedSubredditsComponent);
});

/**
 * SUBREDDITS COMPONENT
 */

var SubredditsComponent = React.createClass({displayName: "SubredditsComponent",

	propTypes: {
		display_name: React.PropTypes.string,
		url: React.PropTypes.string
	},

	render: function() {
		var createSubredditItem = function(sub, index) {

			return (
				React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 
					React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + this.props.url + "')"}, 
						this.props.display_name
					)
				)
			);	
		};

	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);

/**
 * SUBREDDIT LIST ITEM COMPONENT
 */

var ItemComponent = React.createClass({displayName: "ItemComponent",
	
	propTypes: {
		name: React.PropTypes.string,
		url: React.PropTypes.string
	},

	render: function() {
		return (
			React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 
				React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + this.props.url + "')"}, 
					this.props.name
				)
			)
		);
	}
});



// rpReactComponents.directive('itemComponent', function(reactDirective) {
// 	return reactDirective(ItemCommponent);
// });

rpReactComponents.value('ItemComponent', ItemComponent);

var TestComponent = React.createClass({displayName: "TestComponent",

	propTypes: {
	    name: React.PropTypes.string,
	    url: React.PropTypes.string
	},

	render: function() {
		return React.createElement("li", null, this.props.name);
	}

});

rpReactComponents.value('TestComponent', TestComponent);