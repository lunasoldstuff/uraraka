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

var SubredditsListComponent = React.createClass({

	propTypes: {
		pinnedSubs: React.PropTypes.array
	},

	render: function() {
		
		var createSubredditItem = function(sub, index) {

			return (
				<md-list-item class="rp-sidenav-subreddit-list-item" key={sub.name}>
					<md-item-content class="rp-sidenav-subreddit-list-item-content flex">
						<button className="md-button md-ink-ripple rp-sidenav-subreddit-button flex">{sub.name}</button>
					</md-item-content>
				</md-list-item>

			);	
		};

		return <md-list className="rp-sidenav-subreddit-list">{this.props.pinnedSubs.map(createSubredditItem)}</md-list>;
		
	}

});


rpReactComponents.value('SubredditsComponent', SubredditsComponent);
rpReactComponents.value('SubredditsListComponent', SubredditsListComponent);