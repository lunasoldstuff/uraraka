var rpReactComponents = angular.module('rpReactComponents', ['react']);

var SubredditsComponent = React.createClass({displayName: "SubredditsComponent",

	propTypes: {
		name: React.PropTypes.string.isRequired,
		url: React.PropTypes.string.isRequired
	},


	render: function() {


		return React.createElement("span", null, "name: ", this.props.name, ", url: ", this.props.url);

	}

});

var SubredditsListComponent = React.createClass({displayName: "SubredditsListComponent",

	propTypes: {
		pinnedSubs: React.PropTypes.array
	},

	render: function() {
		
		var createSubredditItem = function(sub, index) {

			return (
				React.createElement("md-list-item", {class: "rp-sidenav-subreddit-list-item", key: sub.name}, 
					React.createElement("md-item-content", {class: "rp-sidenav-subreddit-list-item-content flex"}, 
						React.createElement("button", {className: "md-button md-ink-ripple rp-sidenav-subreddit-button flex"}, sub.name)
					)
				)

			);	
		};

		return React.createElement("md-list", {className: "rp-sidenav-subreddit-list"}, this.props.pinnedSubs.map(createSubredditItem));
		
	}

});


rpReactComponents.value('SubredditsComponent', SubredditsComponent);
rpReactComponents.value('SubredditsListComponent', SubredditsListComponent);