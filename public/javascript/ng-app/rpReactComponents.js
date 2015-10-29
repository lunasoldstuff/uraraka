var rpReactComponents = angular.module('rpReactComponents', ['react']);

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

var SubredditsComponent = React.createClass({displayName: "SubredditsComponent",

	propTypes: {
		subs: React.PropTypes.array
	},

	render: function() {
		var createSubredditItem = function(sub, index) {

			return (
				React.createElement("md-list-item", {class: "rp-sidenav-subreddit-list-item", key: sub.data.display_name}, 
					React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 

						React.createElement("md-button", {class: "rp-sidenav-subreddit-button flex", "data-ng-click": "openSubreddit($event, '" + sub.data.url + "')"}, sub.data.display_name)

					)
				)

			);	
		};

		return React.createElement("md-list", {className: "rp-sidenav-subreddit-list"}, this.props.subs.map(createSubredditItem));
	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);