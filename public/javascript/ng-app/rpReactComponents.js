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

rpReactComponents.value('SubredditsComponent', SubredditsComponent);

var SubredditsListComponent = React.createClass({displayName: "SubredditsListComponent",

	propTypes: {
		pinnedSubs: React.PropTypes.array
	},

	render: function() {
		
		var createSubredditItem = function(sub, index) {

			return React.createElement("md-item-content", {key: "{sub.name}", class: "rp-sidenav-subreddit-list-item-content", flex: true}, sub.name);	
		
		};

		return React.createElement("md-list-item", {class: "rp-sidenav-subreddit-list-item"}, this.props.pinnedSubs.map(createSubredditItem));
		
	}

});

rpReactComponents.value('SubredditsListComponent', SubredditsListComponent);