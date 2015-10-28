var rpReactComponents = angular.module('rpReactComponents', ['react']);

var SubredditsComponent = React.createClass({

	propTypes: {
		name: React.PropTypes.string.isRequired,
		url: React.PropTypes.string.isRequired
	},


	render: function() {


		return <span>name: {this.props.name}, url: {this.props.url}</span>;

	}

});

rpReactComponents.value('SubredditsComponent', SubredditsComponent);

var SubredditsListComponent = React.createClass({

	propTypes: {
		pinnedSubs: React.PropTypes.array
	},

	render: function() {
		
		var createSubredditItem = function(sub, index) {

			return <md-item-content key="{sub.name}" class="rp-sidenav-subreddit-list-item-content" flex>{sub.name}</md-item-content>;	
		
		};

		return <md-list-item class="rp-sidenav-subreddit-list-item">{this.props.pinnedSubs.map(createSubredditItem)}</md-list-item>;
		
	}

});

rpReactComponents.value('SubredditsListComponent', SubredditsListComponent);