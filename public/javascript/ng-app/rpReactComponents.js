var rpReactComponents = angular.module('rpReactComponents', ['react']);

/**
 * PINNED SUBREDDITS
 */
var PinnedSubredditsComponent = React.createClass({displayName: "PinnedSubredditsComponent",
	
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

rpReactComponents.value('PinnedSubredditsComponent', PinnedSubredditsComponent);

/**
 * SUBREDDITS COMPONENT
 */
var SubredditsComponent = React.createClass({displayName: "SubredditsComponent",

	propTypes: {
		display_name: React.PropTypes.string,
		url: React.PropTypes.string
	},

	render: function() {

		return (
			React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 
				React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + this.props.url + "')"}, 
					this.props.display_name
				)
			)
		);	

	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);